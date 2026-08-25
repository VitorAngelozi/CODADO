package httpapi

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"

	"codado/backendgo/internal/auth"
	"codado/backendgo/internal/config"
	"codado/backendgo/internal/domain"
)

type sandboxRunner interface {
	RunBugHuntInSandbox(ctx context.Context, challenge domain.BugHuntChallenge, code string) domain.BugHuntRunResponse
}

type authStore interface {
	CreateUser(context.Context, string, string, string) (auth.User, error)
	Authenticate(context.Context, string, string) (auth.User, error)
	CreateSession(context.Context, string, time.Duration) (string, error)
	UserBySession(context.Context, string) (auth.User, error)
	DeleteSession(context.Context, string) error
}

type Server struct {
	config         config.Config
	levels         []domain.Level
	questionsByLvl map[domain.ApiQuizLevelID][]domain.Question
	challenges     []domain.BugHuntChallenge
	sandbox        sandboxRunner
	auth           authStore
	router         http.Handler
}

func NewServer(
	cfg config.Config,
	levels []domain.Level,
	questionsByLvl map[domain.ApiQuizLevelID][]domain.Question,
	challenges []domain.BugHuntChallenge,
	sandbox sandboxRunner,
) *Server {
	server := &Server{
		config:         cfg,
		levels:         levels,
		questionsByLvl: questionsByLvl,
		challenges:     challenges,
		sandbox:        sandbox,
	}
	server.router = server.buildRouter()
	return server
}

func (s *Server) SetAuthStore(store authStore) {
	s.auth = store
	s.router = s.buildRouter()
}

func (s *Server) Router() http.Handler {
	return s.router
}

func (s *Server) buildRouter() http.Handler {
	router := chi.NewRouter()
	router.Use(chimiddleware.RequestID)
	router.Use(chimiddleware.RealIP)
	router.Use(chimiddleware.Recoverer)
	router.Use(chimiddleware.Timeout(15 * time.Second))
	router.Use(s.loggingMiddleware)
	router.Use(s.corsMiddleware)

	router.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	router.Post("/auth/register", s.registerHandler)
	router.Post("/auth/login", s.loginHandler)
	router.Get("/auth/me", s.meHandler)
	router.Post("/auth/logout", s.logoutHandler)
	router.Get("/levels", s.getLevelsHandler)
	router.Get("/questions", s.getQuestionsHandler)
	router.Post("/submit", s.submitHandler)
	router.Post("/bug-hunt/run", s.runBugHuntHandler)

	return router
}

type authRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

const sessionDuration = 7 * 24 * time.Hour

func (s *Server) registerHandler(w http.ResponseWriter, r *http.Request) {
	if s.auth == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "auth database unavailable"})
		return
	}

	var request authRequest
	if err := decodeJSONBody(r, &request); err != nil || strings.TrimSpace(request.Name) == "" || !validEmail(request.Email) || len(request.Password) < 8 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "name, valid email and password with at least 8 characters are required"})
		return
	}

	user, err := s.auth.CreateUser(r.Context(), request.Name, request.Email, request.Password)
	if err != nil {
		if err == auth.ErrEmailAlreadyExists {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "email already registered"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create user"})
		return
	}
	if err := s.startSession(w, r, user.ID); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create session"})
		return
	}
	writeJSON(w, http.StatusCreated, user)
}

func (s *Server) loginHandler(w http.ResponseWriter, r *http.Request) {
	if s.auth == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "auth database unavailable"})
		return
	}

	var request authRequest
	if err := decodeJSONBody(r, &request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	user, err := s.auth.Authenticate(r.Context(), request.Email, request.Password)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid email or password"})
		return
	}
	if err := s.startSession(w, r, user.ID); err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create session"})
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) meHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := s.currentUser(w, r)
	if !ok {
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) logoutHandler(w http.ResponseWriter, r *http.Request) {
	if s.auth != nil {
		if cookie, err := r.Cookie("codado_session"); err == nil {
			_ = s.auth.DeleteSession(r.Context(), cookie.Value)
		}
	}
	http.SetCookie(w, &http.Cookie{Name: "codado_session", Value: "", Path: "/", MaxAge: -1, HttpOnly: true, SameSite: http.SameSiteLaxMode, Secure: s.config.AuthCookieSecure})
	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) startSession(w http.ResponseWriter, r *http.Request, userID string) error {
	token, err := s.auth.CreateSession(r.Context(), userID, sessionDuration)
	if err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{Name: "codado_session", Value: token, Path: "/", MaxAge: int(sessionDuration.Seconds()), HttpOnly: true, SameSite: http.SameSiteLaxMode, Secure: s.config.AuthCookieSecure})
	return nil
}

func (s *Server) currentUser(w http.ResponseWriter, r *http.Request) (auth.User, bool) {
	if s.auth == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "auth database unavailable"})
		return auth.User{}, false
	}
	cookie, err := r.Cookie("codado_session")
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "not authenticated"})
		return auth.User{}, false
	}
	user, err := s.auth.UserBySession(r.Context(), cookie.Value)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "not authenticated"})
		return auth.User{}, false
	}
	return user, true
}

func validEmail(email string) bool {
	parts := strings.Split(strings.TrimSpace(email), "@")
	return len(parts) == 2 && parts[0] != "" && parts[1] != "" && strings.Contains(parts[1], ".")
}

func (s *Server) getLevelsHandler(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string][]domain.Level{"levels": s.levels})
}

func (s *Server) getQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	level := domain.NormalizeLevel(r.URL.Query().Get("level"))
	questions := s.questionsByLvl[level]
	writeJSON(w, http.StatusOK, domain.BuildQuestionsResponse(string(level), questions))
}

func (s *Server) submitHandler(w http.ResponseWriter, r *http.Request) {
	var request domain.SubmitAnswersRequest
	if err := decodeJSONBody(r, &request); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"erro": "payload invalido"})
		return
	}

	level := domain.NormalizeLevel(request.Level)
	questions := s.questionsByLvl[level]
	writeJSON(w, http.StatusOK, domain.ScoreQuiz(string(level), request, questions))
}

func (s *Server) runBugHuntHandler(w http.ResponseWriter, r *http.Request) {
	var request domain.BugHuntRunRequest
	if err := decodeJSONBody(r, &request); err != nil {
		writeJSON(w, http.StatusBadRequest, domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: "payload invalido",
		})
		return
	}

	if strings.TrimSpace(request.ChallengeID) == "" {
		writeJSON(w, http.StatusBadRequest, domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: "challengeId obrigatorio",
		})
		return
	}

	challenge, found := s.findChallenge(request.ChallengeID)
	if !found {
		writeJSON(w, http.StatusBadRequest, domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: "desafio nao encontrado",
		})
		return
	}

	result := s.sandbox.RunBugHuntInSandbox(r.Context(), challenge, request.Code)
	log.Printf("{\"event\":\"bug_hunt_run\",\"challengeId\":%q,\"status\":%q,\"detail\":%q}", request.ChallengeID, result.Status, result.Details)
	writeJSON(w, http.StatusOK, result)
}

func (s *Server) findChallenge(id string) (domain.BugHuntChallenge, bool) {
	for _, challenge := range s.challenges {
		if challenge.ID == id {
			return challenge, true
		}
	}
	return domain.BugHuntChallenge{}, false
}

func decodeJSONBody(r *http.Request, target any) error {
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	return decoder.Decode(target)
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

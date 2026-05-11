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

	"codado/backendgo/internal/config"
	"codado/backendgo/internal/domain"
)

type sandboxRunner interface {
	RunBugHuntInSandbox(ctx context.Context, challenge domain.BugHuntChallenge, code string) domain.BugHuntRunResponse
}

type Server struct {
	config         config.Config
	levels         []domain.Level
	questionsByLvl map[domain.ApiQuizLevelID][]domain.Question
	challenges     []domain.BugHuntChallenge
	sandbox        sandboxRunner
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
	router.Get("/levels", s.getLevelsHandler)
	router.Get("/questions", s.getQuestionsHandler)
	router.Post("/submit", s.submitHandler)
	router.Post("/bug-hunt/run", s.runBugHuntHandler)

	return router
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

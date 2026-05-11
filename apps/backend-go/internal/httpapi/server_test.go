package httpapi

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"codado/backendgo/internal/config"
	"codado/backendgo/internal/data"
	"codado/backendgo/internal/domain"
)

func TestHealthEndpoint(t *testing.T) {
	server := newTestServer()
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusOK)
	assertJSONContains(t, recorder.Body.Bytes(), `"status":"ok"`)
}

func TestQuestionsEndpointMatchesLegacyAndCurrentContract(t *testing.T) {
	server := newTestServer()
	request := httptest.NewRequest(http.MethodGet, "/questions?level=invalid", nil)
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusOK)
	assertJSONContains(t, recorder.Body.Bytes(), `"level":"easy"`)
	assertJSONContains(t, recorder.Body.Bytes(), `"perguntas"`)
	assertJSONContains(t, recorder.Body.Bytes(), `"questions"`)
}

func TestSubmitEndpointAcceptsCurrentPayload(t *testing.T) {
	server := newTestServer()
	payload := []byte(`{"level":"easy","answers":[{"id":"q1_easy","answer":1}]}`)
	request := httptest.NewRequest(http.MethodPost, "/submit", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusOK)
	assertJSONContains(t, recorder.Body.Bytes(), `"acertos":1`)
}

func TestSubmitEndpointAcceptsLegacyPayload(t *testing.T) {
	server := newTestServer()
	payload := []byte(`{"level":"easy","respostas":[{"pergunta_id":"q1_easy","opcao":"8"}]}`)
	request := httptest.NewRequest(http.MethodPost, "/submit", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusOK)
	assertJSONContains(t, recorder.Body.Bytes(), `"pontuacao":1`)
}

func TestBugHuntEndpointValidatesChallengeID(t *testing.T) {
	server := newTestServer()
	payload := []byte(`{"code":"print(1)"}`)
	request := httptest.NewRequest(http.MethodPost, "/bug-hunt/run", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusBadRequest)
	assertJSONContains(t, recorder.Body.Bytes(), `"challengeId obrigatorio"`)
}

func TestBugHuntEndpointReturnsSandboxResult(t *testing.T) {
	server := newTestServer()
	payload := []byte(`{"challengeId":"bug_normal_01","code":"def pares_ate(n):\n    return [0]"}`)
	request := httptest.NewRequest(http.MethodPost, "/bug-hunt/run", bytes.NewReader(payload))
	request.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()

	server.Router().ServeHTTP(recorder, request)

	assertStatus(t, recorder, http.StatusOK)
	assertJSONContains(t, recorder.Body.Bytes(), `"status":"passed"`)
}

func newTestServer() *Server {
	return NewServer(
		config.Config{ExecTimeout: time.Second},
		data.Levels(),
		data.QuestionsByLevel(),
		data.BugHuntChallenges(),
		stubSandbox{},
	)
}

type stubSandbox struct{}

func (stubSandbox) RunBugHuntInSandbox(_ context.Context, _ domain.BugHuntChallenge, _ string) domain.BugHuntRunResponse {
	return domain.BugHuntRunResponse{
		Status: domain.StatusPassed,
		Tests:  &domain.BugHuntRunTests{Passed: 1, Total: 1},
	}
}

func assertStatus(t *testing.T, recorder *httptest.ResponseRecorder, expected int) {
	t.Helper()
	if recorder.Code != expected {
		t.Fatalf("expected status %d, got %d", expected, recorder.Code)
	}
}

func assertJSONContains(t *testing.T, body []byte, expected string) {
	t.Helper()
	var pretty bytes.Buffer
	if err := json.Indent(&pretty, body, "", "  "); err != nil {
		t.Fatalf("invalid json body: %v", err)
	}
	if !bytes.Contains(body, []byte(expected)) {
		t.Fatalf("expected response to contain %s, got %s", expected, pretty.String())
	}
}

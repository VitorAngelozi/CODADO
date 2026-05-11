package sandbox

import (
	"context"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"codado/backendgo/internal/config"
	"codado/backendgo/internal/domain"
)

func TestParseRunnerOutputSupportsSuccessPayload(t *testing.T) {
	response := parseRunnerOutput("{\"status\":\"passed\",\"tests\":{\"passed\":3,\"total\":3}}\n", "", nil)
	if response.Status != domain.StatusPassed || response.Tests == nil || response.Tests.Total != 3 {
		t.Fatalf("unexpected parsed response: %+v", response)
	}
}

func TestParseRunnerOutputHandlesMissingRunnerResponse(t *testing.T) {
	response := parseRunnerOutput("", "boom", errors.New("exit status 1"))
	if response.Status != domain.StatusSandboxError || !strings.Contains(response.Details, "runner sem resposta") {
		t.Fatalf("unexpected response: %+v", response)
	}
}

func TestRunBugHuntInSandboxCreatesAndCleansSandbox(t *testing.T) {
	tempDir := t.TempDir()
	cfg := config.Config{
		RunnerImage:       "codado-bughunt-runner:local",
		SandboxWorkRoot:   tempDir,
		SandboxHostPrefix: "/codado-sandbox",
		ExecTimeout:       time.Second,
	}

	service := &Service{
		config: cfg,
		executeCmd: func(_ context.Context, _ []string) (string, string, error) {
			entries, err := os.ReadDir(tempDir)
			if err != nil {
				t.Fatalf("failed reading sandbox root: %v", err)
			}
			if len(entries) != 1 {
				t.Fatalf("expected one sandbox directory, got %d", len(entries))
			}

			sandboxDir := filepath.Join(tempDir, entries[0].Name())
			if _, err := os.Stat(filepath.Join(sandboxDir, "submission.py")); err != nil {
				t.Fatalf("submission missing: %v", err)
			}
			if _, err := os.Stat(filepath.Join(sandboxDir, "runner.py")); err != nil {
				t.Fatalf("runner missing: %v", err)
			}

			return "{\"status\":\"passed\",\"tests\":{\"passed\":1,\"total\":1}}", "", nil
		},
	}

	response := service.RunBugHuntInSandbox(context.Background(), domain.BugHuntChallenge{
		ID:            "challenge",
		EntryFunction: "resolver",
		TestCases: []struct {
			Input    []any `json:"input"`
			Expected any   `json:"expected"`
		}{{Input: []any{1}, Expected: 1}},
	}, "def resolver(x):\n    return x")

	if response.Status != domain.StatusPassed {
		t.Fatalf("unexpected response: %+v", response)
	}

	entries, err := os.ReadDir(tempDir)
	if err != nil {
		t.Fatalf("failed reading sandbox root after run: %v", err)
	}
	if len(entries) != 0 {
		t.Fatalf("expected sandbox cleanup, found %d entries", len(entries))
	}
}

func TestRunBugHuntInSandboxHandlesDockerMissing(t *testing.T) {
	service := &Service{
		config: config.Config{
			SandboxWorkRoot:   t.TempDir(),
			SandboxHostPrefix: "/codado-sandbox",
			ExecTimeout:       time.Second,
		},
		executeCmd: func(_ context.Context, _ []string) (string, string, error) {
			return "", "", execErrNotFound{}
		},
	}

	response := service.RunBugHuntInSandbox(context.Background(), domain.BugHuntChallenge{
		EntryFunction: "resolver",
	}, "def resolver():\n    return 1")

	if response.Status != domain.StatusSandboxError || !strings.Contains(response.Details, "docker nao encontrado") {
		t.Fatalf("unexpected response: %+v", response)
	}
}

type execErrNotFound struct{}

func (execErrNotFound) Error() string { return "executable file not found in %PATH%" }
func (execErrNotFound) Is(target error) bool {
	return target == exec.ErrNotFound
}

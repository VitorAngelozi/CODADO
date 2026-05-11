package sandbox

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"codado/backendgo/internal/config"
	"codado/backendgo/internal/domain"
)

const codeMaxLength = 12000

type dockerExecutor func(ctx context.Context, args []string) (string, string, error)

type Service struct {
	config     config.Config
	executeCmd dockerExecutor
}

func NewService(cfg config.Config) *Service {
	return &Service{
		config: cfg,
		executeCmd: func(ctx context.Context, args []string) (string, string, error) {
			cmd := exec.CommandContext(ctx, "docker", args...)
			var stdout bytes.Buffer
			var stderr bytes.Buffer
			cmd.Stdout = &stdout
			cmd.Stderr = &stderr
			err := cmd.Run()
			return stdout.String(), stderr.String(), err
		},
	}
}

func (s *Service) RunBugHuntInSandbox(ctx context.Context, challenge domain.BugHuntChallenge, code string) domain.BugHuntRunResponse {
	if code == "" {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: "codigo vazio"}
	}
	if len(code) > codeMaxLength {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: fmt.Sprintf("codigo excede limite de %d caracteres", codeMaxLength)}
	}

	sandboxID, err := randomSandboxID()
	if err != nil {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: fmt.Sprintf("falha de sandbox: %v", err)}
	}

	sandboxDir := filepath.Join(s.config.SandboxWorkRoot, sandboxID)
	if err := os.MkdirAll(sandboxDir, 0o755); err != nil {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: fmt.Sprintf("falha de sandbox: %v", err)}
	}
	defer os.RemoveAll(sandboxDir)

	if err := os.WriteFile(filepath.Join(sandboxDir, "submission.py"), []byte(code), 0o644); err != nil {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: fmt.Sprintf("falha de sandbox: %v", err)}
	}
	if err := os.WriteFile(filepath.Join(sandboxDir, "runner.py"), []byte(buildRunnerScript(challenge)), 0o644); err != nil {
		return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: fmt.Sprintf("falha de sandbox: %v", err)}
	}

	hostSandboxPath := filepath.ToSlash(filepath.Join(s.config.SandboxHostPrefix, sandboxID))
	timeoutCtx, cancel := context.WithTimeout(ctx, s.config.ExecTimeout)
	defer cancel()

	stdout, stderr, err := s.executeCmd(timeoutCtx, []string{
		"run",
		"--rm",
		"--network", "none",
		"--cpus", "0.5",
		"--memory", "128m",
		"--pids-limit", "64",
		"--read-only",
		"--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
		"--security-opt", "no-new-privileges",
		"--cap-drop", "ALL",
		"-v", fmt.Sprintf("%s:/sandbox:ro", hostSandboxPath),
		s.config.RunnerImage,
		"python",
		"/sandbox/runner.py",
	})
	if errors.Is(timeoutCtx.Err(), context.DeadlineExceeded) {
		return domain.BugHuntRunResponse{Status: domain.StatusTimeout, Details: "tempo limite excedido"}
	}
	if err != nil {
		if errors.Is(err, exec.ErrNotFound) || strings.Contains(strings.ToLower(err.Error()), "not recognized") {
			return domain.BugHuntRunResponse{Status: domain.StatusSandboxError, Details: "docker nao encontrado. instale/inicie o Docker e gere a imagem do runner."}
		}
	}

	return parseRunnerOutput(stdout, stderr, err)
}

func parseRunnerOutput(stdout, stderr string, execErr error) domain.BugHuntRunResponse {
	lines := strings.Split(strings.TrimSpace(stdout), "\n")
	raw := ""
	for i := len(lines) - 1; i >= 0; i-- {
		if strings.TrimSpace(lines[i]) != "" {
			raw = lines[i]
			break
		}
	}

	if raw == "" {
		details := strings.TrimSpace(stderr)
		if details == "" && execErr != nil {
			details = execErr.Error()
		}
		if details == "" {
			details = "n/a"
		}
		return domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: fmt.Sprintf("runner sem resposta. stderr: %s", details),
		}
	}

	var parsed domain.BugHuntRunResponse
	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: fmt.Sprintf("resposta invalida do runner: %s", raw),
		}
	}

	switch parsed.Status {
	case domain.StatusPassed, domain.StatusFailed, domain.StatusRuntimeError:
		return parsed
	default:
		return domain.BugHuntRunResponse{
			Status:  domain.StatusSandboxError,
			Details: "status invalido retornado pelo runner",
		}
	}
}

func buildRunnerScript(challenge domain.BugHuntChallenge) string {
	testsJSON, _ := json.Marshal(challenge.TestCases)
	entryJSON, _ := json.Marshal(challenge.EntryFunction)

	return fmt.Sprintf(`import importlib.util
import json

spec = importlib.util.spec_from_file_location('submission', '/sandbox/submission.py')
module = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(module)
except Exception as e:
    print(json.dumps({"status": "runtime_error", "details": f"erro ao carregar submissao: {type(e).__name__}: {e}"}))
    raise SystemExit(0)

func = getattr(module, %s, None)
if not callable(func):
    print(json.dumps({"status": "runtime_error", "details": "funcao esperada nao encontrada ou invalida"}))
    raise SystemExit(0)

tests = %s
passed = 0
for idx, test in enumerate(tests, start=1):
    args = test.get('input', [])
    expected = test.get('expected')
    try:
        output = func(*args)
    except Exception as e:
        print(json.dumps({"status": "runtime_error", "details": f"erro de runtime no teste {idx}: {type(e).__name__}: {e}"}))
        raise SystemExit(0)

    if output == expected:
        passed += 1
    else:
        print(json.dumps({"status": "failed", "tests": {"passed": passed, "total": len(tests)}, "details": f"falha no teste {idx}: esperado={expected!r} obtido={output!r}"}))
        raise SystemExit(0)

print(json.dumps({"status": "passed", "tests": {"passed": len(tests), "total": len(tests)}}))
`, string(entryJSON), string(testsJSON))
}

func randomSandboxID() (string, error) {
	buffer := make([]byte, 4)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	return fmt.Sprintf("codado_%d_%s", time.Now().UnixMilli(), hex.EncodeToString(buffer)), nil
}

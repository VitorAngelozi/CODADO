package config

import (
	"fmt"
	"os"
	"runtime"
	"strconv"
	"time"
)

type Config struct {
	Port              int
	RunnerImage       string
	SandboxWorkRoot   string
	SandboxHostPrefix string
	ExecTimeout       time.Duration
}

func Load() Config {
	workRoot := envOrDefault("SANDBOX_WORK_ROOT", defaultSandboxWorkRoot())
	return Config{
		Port:              envInt("PORT", 8080),
		RunnerImage:       envOrDefault("BUG_HUNT_RUNNER_IMAGE", "codado-bughunt-runner:local"),
		SandboxWorkRoot:   workRoot,
		SandboxHostPrefix: envOrDefault("SANDBOX_HOST_PREFIX", defaultSandboxHostPrefix(workRoot)),
		ExecTimeout:       time.Duration(envInt("BUG_HUNT_EXEC_TIMEOUT_MS", 2000)) * time.Millisecond,
	}
}

func (c Config) ListenAddress() string {
	return fmt.Sprintf(":%d", c.Port)
}

func envOrDefault(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

func envInt(key string, fallback int) int {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}

func defaultSandboxWorkRoot() string {
	if runtime.GOOS == "windows" {
		return `C:\mnt\sandbox`
	}
	return "/mnt/sandbox"
}

func defaultSandboxHostPrefix(workRoot string) string {
	if runtime.GOOS == "windows" {
		return workRoot
	}
	return "/codado-sandbox"
}

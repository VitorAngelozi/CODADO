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
	DatabaseURL       string
	FrontendOrigin    string
	AuthCookieSecure  bool
	RunnerImage       string
	SandboxWorkRoot   string
	SandboxHostPrefix string
	ExecTimeout       time.Duration
}

func Load() Config {
	workRoot := envOrDefault("SANDBOX_WORK_ROOT", defaultSandboxWorkRoot())
	return Config{
		Port:              envInt("PORT", 8080),
		DatabaseURL:       envOrDefault("DATABASE_URL", "postgres://codado:codado_dev_password@localhost:5432/codado?sslmode=disable"),
		FrontendOrigin:    envOrDefault("FRONTEND_ORIGIN", "http://localhost:5173"),
		AuthCookieSecure:  envBool("AUTH_COOKIE_SECURE", false),
		RunnerImage:       envOrDefault("BUG_HUNT_RUNNER_IMAGE", "codado-bughunt-runner:local"),
		SandboxWorkRoot:   workRoot,
		SandboxHostPrefix: envOrDefault("SANDBOX_HOST_PREFIX", defaultSandboxHostPrefix(workRoot)),
		ExecTimeout:       time.Duration(envInt("BUG_HUNT_EXEC_TIMEOUT_MS", 2000)) * time.Millisecond,
	}
}

func envBool(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}

	return parsed
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

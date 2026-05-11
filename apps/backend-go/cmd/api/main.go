package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"codado/backendgo/internal/config"
	"codado/backendgo/internal/data"
	"codado/backendgo/internal/httpapi"
	"codado/backendgo/internal/sandbox"
)

func main() {
	cfg := config.Load()
	sandboxService := sandbox.NewService(cfg)
	server := httpapi.NewServer(
		cfg,
		data.Levels(),
		data.QuestionsByLevel(),
		data.BugHuntChallenges(),
		sandboxService,
	)

	httpServer := &http.Server{
		Addr:              cfg.ListenAddress(),
		Handler:           server.Router(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		log.Printf("Servidor Codado Go iniciado em http://localhost:%d", cfg.Port)
		log.Printf("Endpoints: GET /health, GET /levels, GET /questions?level=easy, POST /submit, POST /bug-hunt/run")
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("falha ao iniciar servidor: %v", err)
		}
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		log.Printf("erro ao encerrar servidor: %v", err)
	}
}

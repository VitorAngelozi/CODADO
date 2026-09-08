.PHONY: help install dev dev-backend dev-frontend build typecheck lint test build-bughunt-runner

help:
	@echo "Codado Monorepo"
	@echo "make install            - instalar dependencias do monorepo"
	@echo "make dev                - backend Go + frontend"
	@echo "make dev-backend        - backend Go"
	@echo "make dev-frontend       - frontend"
	@echo "make build              - gera tipos + build backend Go + frontend"
	@echo "make typecheck          - gera tipos + build backend Go + typecheck frontend"
	@echo "make test               - testes Go + comparacao de contratos"
	@echo "make lint               - lint frontend"
	@echo "make build-bughunt-runner - build da imagem Python sandbox"

install:
	npm install

dev:

	npm run dev

dev-backend:
	npm run dev:backend

dev-frontend:
	npm run dev:frontend

build:
	npm run build

typecheck:
	npm run typecheck

test:
	npm run test

lint:
	npm run lint

build-bughunt-runner:
	docker build -f apps/backend-go/Dockerfile.bughunt-runner -t codado-bughunt-runner:local apps/backend-go

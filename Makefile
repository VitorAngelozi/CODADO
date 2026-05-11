.PHONY: help install dev dev-backend dev-frontend build typecheck lint build-bughunt-runner

help:
	@echo "Codado Monorepo"
	@echo "make install            - instalar dependencias do monorepo"
	@echo "make dev                - backend"
	@echo "make dev-backend        - backend"
	@echo "make dev-frontend       - frontend"
	@echo "make build              - build backend + frontend"
	@echo "make typecheck          - typecheck backend + frontend"
	@echo "make lint               - lint frontend"
	@echo "make build-bughunt-runner - build da imagem Python sandbox"

install:
	npm install

dev:
	npm run dev:backend

dev-backend:
	npm run dev:backend

dev-frontend:
	npm run dev:frontend

build:
	npm run build

typecheck:
	npm run typecheck

lint:
	npm run lint

build-bughunt-runner:
	docker build -f apps/backend/Dockerfile.bughunt-runner -t codado-bughunt-runner:local apps/backend

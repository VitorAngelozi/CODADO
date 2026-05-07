.PHONY: help install run dev build-bughunt-runner

help:
	@echo "Codado Backend (Node.js)"
	@echo "make install - instalar dependencias"
	@echo "make run     - executar em producao"
	@echo "make dev     - executar com nodemon"
	@echo "make build-bughunt-runner - build da imagem Python sandbox"

install:
	npm install

run:
	npm start

dev:
	npm run dev

build-bughunt-runner:
	docker build -f Dockerfile.bughunt-runner -t codado-bughunt-runner:local .

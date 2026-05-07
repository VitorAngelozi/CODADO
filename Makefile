.PHONY: help install run dev

help:
	@echo "Codado Backend (Node.js)"
	@echo "make install - instalar dependencias"
	@echo "make run     - executar em producao"
	@echo "make dev     - executar com nodemon"

install:
	npm install

run:
	npm start

dev:
	npm run dev

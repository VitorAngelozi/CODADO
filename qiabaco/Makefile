# Makefile para Qiabaco
# Facilita comandos comuns do projeto

.PHONY: help install run build test clean lint fmt

help:
	@echo "🎯 Qiabaco - Comandos disponíveis:"
	@echo ""
	@echo "  make install    - Baixar dependências"
	@echo "  make run        - Executar servidor (localhost:8080)"
	@echo "  make build      - Build para produção"
	@echo "  make test       - Rodar testes"
	@echo "  make fmt        - Formatar código"
	@echo "  make lint       - Verificar problemas"
	@echo "  make clean      - Limpar arquivos compilados"
	@echo ""

# Instalar dependências
install:
	@echo "📦 Instalando dependências..."
	go mod download
	go mod tidy
	@echo "✅ Dependências instaladas!"

# Executar servidor
run:
	@echo "🚀 Iniciando servidor..."
	@echo "💡 Acesse: http://localhost:8080/health"
	@echo "💡 Documentação: http://localhost:8080/levels"
	@echo ""
	go run main.go

# Build para produção
build:
	@echo "🔨 Building..."
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/qiabaco main.go
	@echo "✅ Build completo: bin/qiabaco"

# Testes
test:
	@echo "🧪 Rodando testes..."
	go test -v ./...
	@echo "✅ Testes concluídos!"

# Formatar código
fmt:
	@echo "📝 Formatando código..."
	go fmt ./...
	@echo "✅ Código formatado!"

# Lint (verificação de problemas)
lint:
	@echo "🔍 Verificando problemas..."
	@which golangci-lint > /dev/null || echo "⚠️  golangci-lint não instalado. Instale com: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest"
	@which golangci-lint > /dev/null && golangci-lint run ./... || echo "Pule para verificação manual"

# Limpar
clean:
	@echo "🧹 Limpando..."
	rm -f bin/qiabaco
	go clean
	@echo "✅ Limpo!"

# Desenvolvimento (watch + run)
dev:
	@echo "👀 Modo desenvolvimento com auto-reload"
	@echo "⚠️  Certifique-se de ter 'air' instalado: go install github.com/cosmtrek/air@latest"
	air

# Docker
docker-build:
	@echo "🐳 Build Docker..."
	docker build -t qiabaco:latest .
	@echo "✅ Docker build completo!"

docker-run:
	@echo "🐳 Rodando Docker..."
	docker run -p 8080:8080 qiabaco:latest

# Verifica Golang
check:
	@echo "🔍 Verificando instalação..."
	@echo "Go version: $$(go version)"
	@echo "Go path: $$(go env GOPATH)"
	@echo "✅ Tudo pronto!"

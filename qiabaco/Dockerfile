# Multi-stage build para Qiabaco
# Reduz o tamanho da imagem final

# Estágio 1: Build
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Instalar dependências de build
RUN apk add --no-cache git

# Copiar arquivos de dependência
COPY go.mod go.sum ./

# Baixar dependências
RUN go mod download

# Copiar código fonte
COPY . .

# Build da aplicação
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o qiabaco .

# Estágio 2: Runtime
FROM alpine:latest

# Instalar certificados SSL (se precisar fazer requisições HTTPS)
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copiar binário do builder
COPY --from=builder /app/qiabaco .

# Expor porta
EXPOSE 8080

# Comando para rodar
CMD ["./qiabaco"]

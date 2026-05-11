FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bin/codado-api ./cmd/api

FROM alpine:3.22

RUN apk add --no-cache docker-cli

WORKDIR /app

COPY --from=builder /bin/codado-api /usr/local/bin/codado-api

EXPOSE 8080

ENTRYPOINT ["codado-api"]

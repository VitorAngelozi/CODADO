package main

import (
	"fmt"
	"qiabaco/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Define o modo de execução do Gin
	// Em produção use: gin.ReleaseMode
	gin.SetMode(gin.DebugMode)

	// Cria uma nova instância do router Gin
	router := gin.Default()

	// Configura todas as rotas da aplicação
	routes.SetupRoutes(router)

	// Define a porta onde o servidor vai rodar
	port := ":8080"

	// Inicia o servidor HTTP
	fmt.Println("🎯 Servidor Qiabaco iniciado em http://localhost:8080")
	fmt.Println("📚 Endpoints disponíveis:")
	fmt.Println("  - GET  /health            - Verificar status do servidor")
	fmt.Println("  - GET  /levels            - Obter níveis disponíveis")
	fmt.Println("  - GET  /questions?level=easy  - Obter perguntas (easy/medium/hard)")
	fmt.Println("  - POST /submit            - Submeter respostas")

	router.Run(port)
}

package routes

import (
	"qiabaco/handlers"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configura todas as rotas da aplicação
// Define os endpoints disponíveis e seus handlers
func SetupRoutes(router *gin.Engine) {
	// Middleware CORS para permitir requisições do frontend React
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Rota de health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
		})
	})

	// ===== Rotas do Quiz =====

	// GET /levels - Retorna os níveis disponíveis (fácil, médio, difícil)
	router.GET("/levels", handlers.GetLevels)

	// GET /questions?level=easy - Retorna 10 perguntas do nível especificado
	router.GET("/questions", handlers.GetQuestions)

	// POST /submit - Recebe as respostas do usuário e retorna a pontuação
	router.POST("/submit", handlers.SubmitAnswers)
}

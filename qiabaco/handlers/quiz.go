package handlers

import (
	"net/http"
	"qiabaco/data"
	"qiabaco/models"

	"github.com/gin-gonic/gin"
)

// GetLevels é o handler que retorna os níveis disponíveis
// GET /levels
// Responde com JSON contendo todos os níveis (fácil, médio, difícil)
func GetLevels(c *gin.Context) {
	levels := data.GetLevels()

	response := models.LevelsResponse{
		Levels: levels,
	}

	c.JSON(http.StatusOK, response)
}

// GetQuestions é o handler que retorna as perguntas de um nível específico
// GET /questions?level=easy
// Query parameter "level" pode ser: easy, medium ou hard
// Responde com JSON contendo 10 perguntas do nível solicitado
func GetQuestions(c *gin.Context) {
	// Obtém o parâmetro 'level' da query string
	// Se não fornecido, usa "easy" como padrão
	level := c.DefaultQuery("level", "easy")

	// Busca as perguntas do nível
	questions := data.GetQuestionsByLevel(level)

	// Cria a resposta com as perguntas
	// Nota: não incluímos a resposta correta aqui para o frontend
	// (ela será verificada no backend ao submeter)
	response := gin.H{
		"level":      level,
		"total":      len(questions),
		"perguntas": questions,
	}

	c.JSON(http.StatusOK, response)
}

// SubmitAnswers é o handler que recebe as respostas do usuário e calcula a pontuação
// POST /submit
// Body: JSON com level e array de respostas
// Responde com: acertos, total, pontuação e percentual
func SubmitAnswers(c *gin.Context) {
	var req models.SubmitRequest

	// Valida o JSON recebido
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"erro": "Formato inválido",
		})
		return
	}

	// Busca as perguntas do nível para validar as respostas
	questions := data.GetQuestionsByLevel(req.Level)

	// Cria um mapa para acesso rápido das perguntas por ID
	questionsMap := make(map[string]models.Question)
	for _, q := range questions {
		questionsMap[q.ID] = q
	}

	// Calcula a quantidade de acertos
	// Itera sobre todas as respostas do usuário
	acertos := 0
	for _, resposta := range req.Respostas {
		// Busca a pergunta original
		question, existe := questionsMap[resposta.PerguntaID]

		// Se a pergunta existe e a resposta está correta, incrementa acertos
		if existe && resposta.Opcao == question.Resposta {
			acertos++
		}
	}

	// Calcula o percentual
	total := len(questions)
	percentual := 0.0
	if total > 0 {
		percentual = (float64(acertos) / float64(total)) * 100
	}

	// Cria mensagem de feedback baseada na performance
	mensagem := ""
	if acertos == total {
		mensagem = "Perfeito! 🎉 Você acertou todas!"
	} else if acertos >= total-2 {
		mensagem = "Excelente! 👏 Muito bom!"
	} else if acertos >= total/2 {
		mensagem = "Bom trabalho! 👍 Continue praticando"
	} else {
		mensagem = "Continue praticando! 💪 Você consegue!"
	}

	// Prepara a resposta com o resultado
	resultado := models.ResultadoResponse{
		Acertos:    acertos,
		Total:      total,
		Pontuacao:  acertos * 10, // Cada acerto vale 10 pontos
		Percentual: percentual,
		Mensagem:   mensagem,
	}

	c.JSON(http.StatusOK, resultado)
}

package data

import "qiabaco/models"

// GetLevels retorna todos os níveis disponíveis
// Cada nível tem um ID, nome e descrição
func GetLevels() []models.Level {
	return []models.Level{
		{
			ID:   "easy",
			Nome: "Fácil",
			Desc: "Operações básicas: adição e subtração",
		},
		{
			ID:   "medium",
			Nome: "Médio",
			Desc: "Multiplicação e divisão",
		},
		{
			ID:   "hard",
			Nome: "Difícil",
			Desc: "Expressões mais complexas",
		},
	}
}

// GetQuestionsByLevel retorna 10 perguntas de matemática baseadas no nível
// As perguntas são hardcoded por enquanto (dados mockados em memória)
func GetQuestionsByLevel(level string) []models.Question {
	easyQuestions := []models.Question{
		{
			ID:       "q1_easy",
			Enunciar: "Quanto é 5 + 3?",
			Opcoes:   []string{"7", "8", "9", "10"},
			Resposta: "8",
		},
		{
			ID:       "q2_easy",
			Enunciar: "Quanto é 12 - 4?",
			Opcoes:   []string{"6", "7", "8", "9"},
			Resposta: "8",
		},
		{
			ID:       "q3_easy",
			Enunciar: "Quanto é 7 + 2?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "9",
		},
		{
			ID:       "q4_easy",
			Enunciar: "Quanto é 15 - 6?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "9",
		},
		{
			ID:       "q5_easy",
			Enunciar: "Quanto é 10 + 5?",
			Opcoes:   []string{"14", "15", "16", "17"},
			Resposta: "15",
		},
		{
			ID:       "q6_easy",
			Enunciar: "Quanto é 20 - 8?",
			Opcoes:   []string{"10", "11", "12", "13"},
			Resposta: "12",
		},
		{
			ID:       "q7_easy",
			Enunciar: "Quanto é 3 + 4 + 2?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "9",
		},
		{
			ID:       "q8_easy",
			Enunciar: "Quanto é 25 - 10?",
			Opcoes:   []string{"13", "14", "15", "16"},
			Resposta: "15",
		},
		{
			ID:       "q9_easy",
			Enunciar: "Quanto é 6 + 6?",
			Opcoes:   []string{"10", "11", "12", "13"},
			Resposta: "12",
		},
		{
			ID:       "q10_easy",
			Enunciar: "Quanto é 18 - 9?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "9",
		},
	}

	mediumQuestions := []models.Question{
		{
			ID:       "q1_medium",
			Enunciar: "Quanto é 5 × 4?",
			Opcoes:   []string{"18", "19", "20", "21"},
			Resposta: "20",
		},
		{
			ID:       "q2_medium",
			Enunciar: "Quanto é 24 ÷ 4?",
			Opcoes:   []string{"5", "6", "7", "8"},
			Resposta: "6",
		},
		{
			ID:       "q3_medium",
			Enunciar: "Quanto é 7 × 3?",
			Opcoes:   []string{"19", "20", "21", "22"},
			Resposta: "21",
		},
		{
			ID:       "q4_medium",
			Enunciar: "Quanto é 36 ÷ 6?",
			Opcoes:   []string{"5", "6", "7", "8"},
			Resposta: "6",
		},
		{
			ID:       "q5_medium",
			Enunciar: "Quanto é 8 × 5?",
			Opcoes:   []string{"38", "39", "40", "41"},
			Resposta: "40",
		},
		{
			ID:       "q6_medium",
			Enunciar: "Quanto é 50 ÷ 5?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "10",
		},
		{
			ID:       "q7_medium",
			Enunciar: "Quanto é 9 × 6?",
			Opcoes:   []string{"52", "53", "54", "55"},
			Resposta: "54",
		},
		{
			ID:       "q8_medium",
			Enunciar: "Quanto é 63 ÷ 9?",
			Opcoes:   []string{"6", "7", "8", "9"},
			Resposta: "7",
		},
		{
			ID:       "q9_medium",
			Enunciar: "Quanto é 12 × 3?",
			Opcoes:   []string{"34", "35", "36", "37"},
			Resposta: "36",
		},
		{
			ID:       "q10_medium",
			Enunciar: "Quanto é 100 ÷ 10?",
			Opcoes:   []string{"8", "9", "10", "11"},
			Resposta: "10",
		},
	}

	hardQuestions := []models.Question{
		{
			ID:       "q1_hard",
			Enunciar: "Quanto é (5 + 3) × 2?",
			Opcoes:   []string{"14", "15", "16", "17"},
			Resposta: "16",
		},
		{
			ID:       "q2_hard",
			Enunciar: "Quanto é 10 + 5 × 2?",
			Opcoes:   []string{"20", "25", "30", "35"},
			Resposta: "20",
		},
		{
			ID:       "q3_hard",
			Enunciar: "Quanto é (20 - 4) ÷ 2?",
			Opcoes:   []string{"6", "7", "8", "9"},
			Resposta: "8",
		},
		{
			ID:       "q4_hard",
			Enunciar: "Quanto é 3 × (4 + 2)?",
			Opcoes:   []string{"16", "17", "18", "19"},
			Resposta: "18",
		},
		{
			ID:       "q5_hard",
			Enunciar: "Quanto é 25 + 25 - 10?",
			Opcoes:   []string{"38", "39", "40", "41"},
			Resposta: "40",
		},
		{
			ID:       "q6_hard",
			Enunciar: "Quanto é (30 ÷ 5) × 4?",
			Opcoes:   []string{"22", "23", "24", "25"},
			Resposta: "24",
		},
		{
			ID:       "q7_hard",
			Enunciar: "Quanto é 50 - 20 + 15?",
			Opcoes:   []string{"42", "43", "44", "45"},
			Resposta: "45",
		},
		{
			ID:       "q8_hard",
			Enunciar: "Quanto é (100 ÷ 10) × 3?",
			Opcoes:   []string{"28", "29", "30", "31"},
			Resposta: "30",
		},
		{
			ID:       "q9_hard",
			Enunciar: "Quanto é 7 × 8 - 10?",
			Opcoes:   []string{"45", "46", "47", "48"},
			Resposta: "46",
		},
		{
			ID:       "q10_hard",
			Enunciar: "Quanto é (15 + 5) × 2 - 10?",
			Opcoes:   []string{"28", "29", "30", "31"},
			Resposta: "30",
		},
	}

	// Retorna as perguntas baseado no nível solicitado
	switch level {
	case "easy":
		return easyQuestions
	case "medium":
		return mediumQuestions
	case "hard":
		return hardQuestions
	default:
		return easyQuestions
	}
}

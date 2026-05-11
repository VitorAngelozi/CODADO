package domain

func NormalizeLevel(level string) ApiQuizLevelID {
	switch ApiQuizLevelID(level) {
	case LevelEasy, LevelMedium, LevelHard:
		return ApiQuizLevelID(level)
	default:
		return LevelEasy
	}
}

func ToLegacyQuestion(question Question) LegacyQuestion {
	resposta := ""
	if question.Answer >= 0 && question.Answer < len(question.Options) {
		resposta = question.Options[question.Answer]
	}

	return LegacyQuestion{
		ID:       question.ID,
		Enunciar: question.Question,
		Opcoes:   question.Options,
		Resposta: resposta,
	}
}

func BuildQuestionsResponse(level string, questions []Question) QuestionsResponse {
	legacy := make([]LegacyQuestion, 0, len(questions))
	for _, question := range questions {
		legacy = append(legacy, ToLegacyQuestion(question))
	}

	return QuestionsResponse{
		Level:     string(NormalizeLevel(level)),
		Total:     len(questions),
		Perguntas: legacy,
		Questions: questions,
	}
}

func ScoreQuiz(level string, request SubmitAnswersRequest, questions []Question) SubmitAnswersResponse {
	questionMap := make(map[string]Question, len(questions))
	for _, question := range questions {
		questionMap[question.ID] = question
	}

	acertos := 0

	for _, resposta := range request.Respostas {
		question, found := questionMap[resposta.PerguntaID]
		if !found {
			continue
		}

		correctValue := ""
		if question.Answer >= 0 && question.Answer < len(question.Options) {
			correctValue = question.Options[question.Answer]
		}

		if resposta.Opcao == correctValue {
			acertos++
		}
	}

	for _, answer := range request.Answers {
		question, found := questionMap[answer.ID]
		if !found {
			continue
		}

		if answer.Answer == question.Answer {
			acertos++
		}
	}

	total := len(questions)
	percentual := 0.0
	if total > 0 {
		percentual = (float64(acertos) / float64(total)) * 100
	}

	mensagem := "Continue praticando! Voce consegue!"
	if acertos == total {
		mensagem = "Perfeito! Voce acertou todas!"
	} else if acertos >= total-2 {
		mensagem = "Excelente! Muito bom!"
	} else if acertos >= total/2 {
		mensagem = "Bom trabalho! Continue praticando"
	}

	return SubmitAnswersResponse{
		Acertos:    acertos,
		Total:      total,
		Pontuacao:  acertos,
		Percentual: percentual,
		Mensagem:   mensagem,
	}
}

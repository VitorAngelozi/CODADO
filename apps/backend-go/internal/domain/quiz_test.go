package domain

import "testing"

func TestNormalizeLevelFallsBackToEasy(t *testing.T) {
	if got := NormalizeLevel("invalid"); got != LevelEasy {
		t.Fatalf("expected easy fallback, got %s", got)
	}
}

func TestBuildQuestionsResponsePreservesLegacyAndCurrentFields(t *testing.T) {
	questions := []Question{{
		ID:       "q1",
		Question: "Quanto e 2 + 2?",
		Options:  []string{"3", "4"},
		Answer:   1,
	}}

	response := BuildQuestionsResponse("hard", questions)

	if response.Level != "hard" {
		t.Fatalf("expected hard level, got %s", response.Level)
	}
	if response.Total != 1 {
		t.Fatalf("expected total 1, got %d", response.Total)
	}
	if len(response.Perguntas) != 1 || response.Perguntas[0].Resposta != "4" {
		t.Fatalf("legacy payload mismatch: %+v", response.Perguntas)
	}
}

func TestScoreQuizSupportsLegacyAndCurrentPayloads(t *testing.T) {
	questions := []Question{
		{ID: "q1", Options: []string{"a", "b"}, Answer: 1},
		{ID: "q2", Options: []string{"x", "y"}, Answer: 0},
	}

	response := ScoreQuiz("easy", SubmitAnswersRequest{
		Level: "easy",
		Respostas: []LegacySubmitAnswerItem{
			{PerguntaID: "q1", Opcao: "b"},
			{PerguntaID: "missing", Opcao: "x"},
		},
		Answers: []SubmitAnswerItem{
			{ID: "q2", Answer: 0},
		},
	}, questions)

	if response.Acertos != 2 || response.Total != 2 || response.Pontuacao != 2 {
		t.Fatalf("unexpected score: %+v", response)
	}
	if response.Mensagem != "Perfeito! Voce acertou todas!" {
		t.Fatalf("unexpected message: %s", response.Mensagem)
	}
}

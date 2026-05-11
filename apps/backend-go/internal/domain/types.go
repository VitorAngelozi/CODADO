package domain

type ApiQuizLevelID string

const (
	LevelEasy   ApiQuizLevelID = "easy"
	LevelMedium ApiQuizLevelID = "medium"
	LevelHard   ApiQuizLevelID = "hard"
)

type BugHuntRunStatus string

const (
	StatusPassed       BugHuntRunStatus = "passed"
	StatusFailed       BugHuntRunStatus = "failed"
	StatusTimeout      BugHuntRunStatus = "timeout"
	StatusRuntimeError BugHuntRunStatus = "runtime_error"
	StatusSandboxError BugHuntRunStatus = "sandbox_error"
)

type Level struct {
	ID   ApiQuizLevelID `json:"id"`
	Nome string         `json:"nome"`
	Desc string         `json:"desc"`
}

type Question struct {
	ID          string   `json:"id"`
	Question    string   `json:"question"`
	Code        string   `json:"code"`
	Options     []string `json:"options"`
	Answer      int      `json:"answer"`
	Explanation string   `json:"explanation"`
}

type LegacyQuestion struct {
	ID       string   `json:"id"`
	Enunciar string   `json:"enunciar"`
	Opcoes   []string `json:"opcoes"`
	Resposta string   `json:"resposta"`
}

type QuestionsResponse struct {
	Level     string           `json:"level"`
	Total     int              `json:"total"`
	Perguntas []LegacyQuestion `json:"perguntas"`
	Questions []Question       `json:"questions"`
}

type SubmitAnswerItem struct {
	ID     string `json:"id"`
	Answer int    `json:"answer"`
}

type LegacySubmitAnswerItem struct {
	PerguntaID string `json:"pergunta_id"`
	Opcao      string `json:"opcao"`
}

type SubmitAnswersRequest struct {
	Level     string                   `json:"level"`
	Respostas []LegacySubmitAnswerItem `json:"respostas"`
	Answers   []SubmitAnswerItem       `json:"answers"`
}

type SubmitAnswersResponse struct {
	Acertos    int     `json:"acertos"`
	Total      int     `json:"total"`
	Pontuacao  int     `json:"pontuacao"`
	Percentual float64 `json:"percentual"`
	Mensagem   string  `json:"mensagem"`
}

type BugHuntRunRequest struct {
	ChallengeID string `json:"challengeId"`
	Code        string `json:"code"`
}

type BugHuntRunTests struct {
	Passed int `json:"passed"`
	Total  int `json:"total"`
}

type BugHuntRunResponse struct {
	Status  BugHuntRunStatus `json:"status"`
	Details string           `json:"details,omitempty"`
	Tests   *BugHuntRunTests `json:"tests,omitempty"`
}

type BugHuntChallenge struct {
	ID            string `json:"id"`
	Title         string `json:"title"`
	Prompt        string `json:"prompt"`
	BuggyCode     string `json:"buggyCode"`
	EntryFunction string `json:"entryFunction"`
	TestCases     []struct {
		Input    []any `json:"input"`
		Expected any   `json:"expected"`
	} `json:"testCases"`
}

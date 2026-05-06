package models

// Question representa uma pergunta de matemática
// Cada pergunta tem um ID, enunciado, opções e resposta correta
type Question struct {
	ID       string   `json:"id"`
	Enunciar string   `json:"enunciar"`
	Opcoes   []string `json:"opcoes"`
	Resposta string   `json:"resposta"`
}

// Level representa um nível de dificuldade
// Contém o nome do nível e as perguntas associadas
type Level struct {
	ID   string       `json:"id"`
	Nome string       `json:"nome"`
	Desc string       `json:"desc"`
	Perguntas []Question `json:"perguntas,omitempty"`
}

// Resposta é uma resposta do usuário para uma pergunta
type Resposta struct {
	PerguntaID string `json:"pergunta_id"`
	Opcao      string `json:"opcao"`
}

// SubmitRequest contém as respostas do usuário para submissão
type SubmitRequest struct {
	Level    string   `json:"level"`
	Respostas []Resposta `json:"respostas"`
}

// ResultadoResponse é o resultado final do quiz
// Contém quantidade de acertos, total de perguntas e pontuação
type ResultadoResponse struct {
	Acertos           int   `json:"acertos"`
	Total             int   `json:"total"`
	Pontuacao         int   `json:"pontuacao"`
	Percentual        float64 `json:"percentual"`
	Mensagem          string `json:"mensagem"`
}

// LevelsResponse é a resposta com os níveis disponíveis
type LevelsResponse struct {
	Levels []Level `json:"levels"`
}

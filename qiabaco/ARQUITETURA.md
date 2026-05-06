# 🔄 Arquitetura e Fluxo da Aplicação

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (React Frontend)                 │
│  - Exibe níveis                                              │
│  - Exibe perguntas                                           │
│  - Coleta respostas                                          │
│  - Exibe resultado                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Requisições HTTP JSON
                     │ (CORS habilitado)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Go + Gin)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ routes/routes.go (Configuração de rotas)            │   │
│  │ - GET  /health                                       │   │
│  │ - GET  /levels                                       │   │
│  │ - GET  /questions?level=X                            │   │
│  │ - POST /submit                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ handlers/quiz.go (Lógica dos endpoints)             │   │
│  │ - GetLevels()                                        │   │
│  │ - GetQuestions()                                     │   │
│  │ - SubmitAnswers()                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ data/questions.go (Dados mockados)                   │   │
│  │ - GetLevels()                                        │   │
│  │ - GetQuestionsByLevel()                              │   │
│  │ (30 perguntas hardcoded em memória)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ models/quiz.go (Estruturas de dados)                │   │
│  │ - Question                                           │   │
│  │ - Level                                              │   │
│  │ - Resposta                                           │   │
│  │ - SubmitRequest                                      │   │
│  │ - ResultadoResponse                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Banco: Em memória (nenhum banco ainda)                     │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo de Requisição - GET /levels

```
Cliente                          Backend
   │                              │
   │────────────GET /levels──────→│
   │                              │
   │                        handlers.GetLevels()
   │                              │
   │                        data.GetLevels()
   │                        (retorna 3 níveis)
   │                              │
   │←─── JSON com níveis ─────────│
   │                              │
```

**Resposta:**
```json
{
  "levels": [
    {"id": "easy", "nome": "Fácil", "desc": "..."},
    {"id": "medium", "nome": "Médio", "desc": "..."},
    {"id": "hard", "nome": "Difícil", "desc": "..."}
  ]
}
```

---

## Fluxo de Requisição - GET /questions?level=easy

```
Cliente                          Backend
   │                              │
   │─ GET /questions?level=easy ─→│
   │                              │
   │                        handlers.GetQuestions()
   │                        (extrai level da query)
   │                              │
   │                        data.GetQuestionsByLevel("easy")
   │                        (retorna 10 perguntas)
   │                              │
   │←─── JSON com 10 perguntas ──│
   │                              │
```

**Resposta:**
```json
{
  "level": "easy",
  "total": 10,
  "perguntas": [
    {
      "id": "q1_easy",
      "enunciar": "Quanto é 5 + 3?",
      "opcoes": ["7", "8", "9", "10"],
      "resposta": "8"
    },
    ...
  ]
}
```

---

## Fluxo de Requisição - POST /submit

```
Cliente                          Backend
   │                              │
   │──── POST /submit ───────────→│
   │ {                            │
   │   level: "easy",             │
   │   respostas: [...]           │
   │ }                            │
   │                              │
   │                        handlers.SubmitAnswers()
   │                        (valida JSON)
   │                              │
   │                        data.GetQuestionsByLevel("easy")
   │                        (busca perguntas originais)
   │                              │
   │                        Compara respostas
   │                        Conta acertos
   │                        Calcula pontuação
   │                        Gera mensagem
   │                              │
   │← JSON com resultado ─────────│
   │ {                            │
   │   acertos: 9,                │
   │   total: 10,                 │
   │   pontuacao: 90,             │
   │   percentual: 90,            │
   │   mensagem: "Excelente..."   │
   │ }                            │
   │                              │
```

---

## Estrutura de Dados no Código

### Request - POST /submit

```go
type Resposta struct {
    PerguntaID string `json:"pergunta_id"`  // ID da pergunta
    Opcao      string `json:"opcao"`        // Opção selecionada pelo usuário
}

type SubmitRequest struct {
    Level     string     `json:"level"`    // Nível (easy/medium/hard)
    Respostas []Resposta `json:"respostas"` // Array com todas as respostas
}
```

### Response - POST /submit

```go
type ResultadoResponse struct {
    Acertos    int     `json:"acertos"`     // Número de acertos
    Total      int     `json:"total"`       // Total de perguntas
    Pontuacao  int     `json:"pontuacao"`   // Total de pontos (acertos × 10)
    Percentual float64 `json:"percentual"`  // Percentual de acertos (0-100)
    Mensagem   string  `json:"mensagem"`    // Mensagem motivacional
}
```

---

## Fluxo Completo do Usuário

```
1. PÁGINA INICIAL
   └─→ GET /levels
       └─→ Exibe botões dos 3 níveis

2. USUÁRIO CLICA EM UM NÍVEL
   └─→ GET /questions?level=easy
       └─→ Exibe 10 perguntas com 4 opções cada

3. USUÁRIO RESPONDE AS 10 PERGUNTAS
   └─→ Cada resposta é armazenada no estado do React

4. USUÁRIO CLICA "ENVIAR"
   └─→ POST /submit
       └─→ Backend processa e retorna resultado

5. PÁGINA DE RESULTADO
   └─→ Exibe:
       - Número de acertos
       - Pontuação total
       - Percentual
       - Mensagem motivacional (com emoji)
       - Botão para tentar novamente
       - Botão para voltar
```

---

## Responsabilidades de Cada Arquivo

| Arquivo | Responsabilidade |
|---------|------------------|
| `main.go` | Inicializar Gin e rodar servidor |
| `routes/routes.go` | Definir rotas e middleware |
| `handlers/quiz.go` | Lógica dos endpoints (validação, cálculos) |
| `data/questions.go` | Dados mockados (perguntas hardcoded) |
| `models/quiz.go` | Estruturas de dados (tipos/structs) |

---

## Fluxo de Dados

```
Dados Mockados (memory)
↓
data/questions.go
↓
handlers/quiz.go (processa)
↓
models/quiz.go (formato)
↓
JSON API
↓
Frontend React
```

---

## Como Expandir

### Adicionar um novo nível:

1. Adicione 10 novas perguntas em `data/questions.go`
2. Crie um novo slice `expertQuestions`
3. Adicione case no `GetQuestionsByLevel()`:
   ```go
   case "expert":
       return expertQuestions
   ```
4. Pronto! A API já funcionará

### Adicionar banco de dados:

1. Crie um arquivo `database/db.go`
2. Implemente funções para buscar perguntas do DB
3. Substitua chamadas em `data/questions.go`
4. Nada muda na API! (abstração)

### Adicionar autenticação:

1. Crie `middleware/auth.go`
2. Valide JWT token
3. Adicione em `routes/routes.go`
4. Nada muda nos handlers!

---

## Boas Práticas Aplicadas

✅ **Separação de Responsabilidades**: Cada arquivo tem uma função clara
✅ **Abstração de Dados**: Mudanças no DB não afetam handlers
✅ **Reutilização**: Funções bem estruturadas
✅ **Comentários**: Código bem documentado
✅ **Tratamento de Erros**: Validação de entrada
✅ **CORS**: Pronto para frontend
✅ **Padrão RESTful**: Endpoints seguem convenções


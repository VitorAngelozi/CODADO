# 🎯 Qiabaco - Quiz de Matemática Style Duolingo

Um aplicativo web estilo Duolingo focado em matemática, com backend em Go (Gin) e pronto para consumo por frontend React.

## 📋 Visão Geral

**Qiabaco** é um MVP (Minimum Viable Product) de um sistema de quiz de matemática com:
- ✅ 3 níveis de dificuldade (Fácil, Médio, Difícil)
- ✅ 10 perguntas por nível
- ✅ API REST bem estruturada
- ✅ Sistema de pontuação automático
- ✅ Dados mockados em memória (sem banco ainda)
- ✅ Pronto para integração com frontend React

---

## 🏗️ Estrutura do Projeto

```
qiabaco/
├── main.go                 # Ponto de entrada da aplicação
├── go.mod                  # Dependências do projeto
├── go.sum                  # Hash das dependências (gerado automaticamente)
│
├── models/
│   └── quiz.go            # Define as estruturas de dados (Question, Level, etc)
│
├── data/
│   └── questions.go       # Dados mockados (perguntas hardcoded em memória)
│
├── handlers/
│   └── quiz.go            # Lógica dos endpoints (GetLevels, GetQuestions, SubmitAnswers)
│
├── routes/
│   └── routes.go          # Configuração das rotas e middleware CORS
│
└── README.md              # Este arquivo
```

### Explicação de cada pasta:

- **models/**: Define as estruturas (structs) que representam dados
- **data/**: Armazena dados mockados (simula um banco de dados)
- **handlers/**: Contém a lógica de negócio de cada endpoint
- **routes/**: Configura as rotas e middleware da aplicação

---

## 🚀 Como Rodar

### Pré-requisitos

- **Go 1.21 ou superior** ([Download](https://golang.org/dl/))
- **Git** (opcional, para clonar)

### Passo 1: Entrar na pasta do projeto

```bash
cd qiabaco
```

### Passo 2: Baixar as dependências

```bash
go mod download
```

Ou, para sincronizar as dependências:

```bash
go mod tidy
```

### Passo 3: Executar o servidor

```bash
go run main.go
```

Você verá algo como:

```
🎯 Servidor Qiabaco iniciado em http://localhost:8080
📚 Endpoints disponíveis:
  - GET  /health            - Verificar status do servidor
  - GET  /levels            - Obter níveis disponíveis
  - GET  /questions?level=easy  - Obter perguntas (easy/medium/hard)
  - POST /submit            - Submeter respostas
```

---

## 📡 API Endpoints

### 1. GET /health
Verifica se o servidor está rodando.

**Resposta:**
```json
{
  "status": "ok"
}
```

---

### 2. GET /levels
Retorna os níveis disponíveis.

**URL:** `http://localhost:8080/levels`

**Resposta:**
```json
{
  "levels": [
    {
      "id": "easy",
      "nome": "Fácil",
      "desc": "Operações básicas: adição e subtração"
    },
    {
      "id": "medium",
      "nome": "Médio",
      "desc": "Multiplicação e divisão"
    },
    {
      "id": "hard",
      "nome": "Difícil",
      "desc": "Expressões mais complexas"
    }
  ]
}
```

---

### 3. GET /questions?level=easy
Retorna 10 perguntas do nível especificado.

**URLs válidas:**
- `http://localhost:8080/questions?level=easy`
- `http://localhost:8080/questions?level=medium`
- `http://localhost:8080/questions?level=hard`

**Resposta (exemplo):**
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
    {
      "id": "q2_easy",
      "enunciar": "Quanto é 12 - 4?",
      "opcoes": ["6", "7", "8", "9"],
      "resposta": "8"
    }
    // ... mais 8 perguntas
  ]
}
```

---

### 4. POST /submit
Submete as respostas do usuário e retorna a pontuação.

**URL:** `http://localhost:8080/submit`

**Request Body:**
```json
{
  "level": "easy",
  "respostas": [
    {
      "pergunta_id": "q1_easy",
      "opcao": "8"
    },
    {
      "pergunta_id": "q2_easy",
      "opcao": "8"
    },
    {
      "pergunta_id": "q3_easy",
      "opcao": "9"
    }
    // ... respostas para todas as 10 perguntas
  ]
}
```

**Resposta de Sucesso:**
```json
{
  "acertos": 9,
  "total": 10,
  "pontuacao": 90,
  "percentual": 90,
  "mensagem": "Excelente! 👏 Muito bom!"
}
```

---

## 🧪 Testando com cURL

### Obter níveis:
```bash
curl http://localhost:8080/levels
```

### Obter perguntas (fácil):
```bash
curl "http://localhost:8080/questions?level=easy"
```

### Submeter respostas:
```bash
curl -X POST http://localhost:8080/submit \
  -H "Content-Type: application/json" \
  -d '{
    "level": "easy",
    "respostas": [
      {"pergunta_id": "q1_easy", "opcao": "8"},
      {"pergunta_id": "q2_easy", "opcao": "8"},
      {"pergunta_id": "q3_easy", "opcao": "9"},
      {"pergunta_id": "q4_easy", "opcao": "9"},
      {"pergunta_id": "q5_easy", "opcao": "15"},
      {"pergunta_id": "q6_easy", "opcao": "12"},
      {"pergunta_id": "q7_easy", "opcao": "9"},
      {"pergunta_id": "q8_easy", "opcao": "15"},
      {"pergunta_id": "q9_easy", "opcao": "12"},
      {"pergunta_id": "q10_easy", "opcao": "9"}
    ]
  }'
```

---

## 📝 Explicação do Código

### models/quiz.go
Define as estruturas de dados principais:
- **Question**: Representa uma pergunta com id, enunciado, opções e resposta correta
- **Level**: Representa um nível de dificuldade
- **Resposta**: Resposta do usuário para uma pergunta
- **SubmitRequest**: Requisição com todas as respostas
- **ResultadoResponse**: Resultado final do quiz

### data/questions.go
Contém:
- `GetLevels()`: Retorna os 3 níveis disponíveis
- `GetQuestionsByLevel(level)`: Retorna 10 perguntas hardcoded para cada nível

As perguntas estão divididas em 3 categorias:
- **Fácil**: Adição e subtração
- **Médio**: Multiplicação e divisão
- **Difícil**: Expressões com múltiplas operações

### handlers/quiz.go
Implementa os 3 handlers principais:

1. **GetLevels()**: 
   - Busca os níveis via `data.GetLevels()`
   - Retorna como JSON

2. **GetQuestions()**:
   - Extrai o parâmetro `level` da query string
   - Busca as perguntas do nível
   - Retorna as perguntas (incluindo a resposta correta)
   - **Nota**: Em produção, não deveria retornar a resposta aqui

3. **SubmitAnswers()**:
   - Recebe o JSON com as respostas
   - Busca as perguntas originais
   - Compara cada resposta do usuário com a resposta correta
   - Calcula: acertos, pontuação, percentual e mensagem motivacional

### routes/routes.go
Configura:
- Middleware CORS (permite requisições do frontend React)
- 4 rotas: health, levels, questions e submit

### main.go
- Inicializa o Gin
- Carrega as rotas
- Inicia o servidor na porta 8080

---

## 🎯 Lógica de Pontuação

```
Cada resposta correta = 1 acerto
Pontuação final = acertos × 10 pontos
Percentual = (acertos / total) × 100

Mensagens de feedback:
- 100%: "Perfeito! 🎉"
- 80-99%: "Excelente! 👏"
- 50-79%: "Bom trabalho! 👍"
- <50%: "Continue praticando! 💪"
```

---

## 🔄 Fluxo da Aplicação

```
1. Frontend faz GET /levels
   ↓
2. Usuário escolhe um nível (easy/medium/hard)
   ↓
3. Frontend faz GET /questions?level=easy
   ↓
4. Exibe 10 perguntas para o usuário responder
   ↓
5. Usuário submete respostas
   ↓
6. Frontend faz POST /submit com as respostas
   ↓
7. Backend calcula a pontuação
   ↓
8. Retorna resultado (acertos, pontuação, mensagem)
   ↓
9. Frontend exibe resultado
```

---

## 🚦 Próximos Passos (Roadmap)

- [ ] Adicionar banco de dados PostgreSQL
- [ ] Implementar autenticação de usuários
- [ ] Adicionar sistema de ranking/leaderboard
- [ ] Criar frontend React
- [ ] Adicionar mais níveis e perguntas
- [ ] Implementar sistema de streaks (sequências)
- [ ] Adicionar histórico de quizzes do usuário
- [ ] Deploy em produção (Docker, Heroku, etc)

---

## 🛠️ Boas Práticas Implementadas

✅ **Separação de responsabilidades**: Cada arquivo tem uma função clara
✅ **Código bem comentado**: Comentários nas partes importantes
✅ **Estrutura modular**: Fácil de expandir e manter
✅ **Tratamento de erros**: Validação de entrada nos handlers
✅ **CORS habilitado**: Pronto para frontend React
✅ **Nomes descritivos**: Variáveis e funções com nomes claros
✅ **Padrão MVC-like**: Models, Data, Handlers, Routes

---

## 📚 Referências

- [Documentação Gin](https://github.com/gin-gonic/gin)
- [Documentação Go](https://golang.org/doc/)
- [CORS com Gin](https://github.com/gin-contrib/cors)

---

## 📄 Licença

Projeto aberto para aprendizado. Sinta-se livre para usar e modificar!

---

**Criado com ❤️ para aprender Go e desenvolvimento web**

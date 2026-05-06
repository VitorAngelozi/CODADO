## 📊 Estrutura Completa do Qiabaco

```
qiabaco/
│
├── 🎯 CÓDIGO FONTE
│   ├── main.go                      # Ponto de entrada da aplicação
│   │   └─ Inicializa Gin e rotas
│   │
│   ├── 📂 models/
│   │   └── quiz.go                  # Estruturas de dados (structs)
│   │       ├─ Question
│   │       ├─ Level
│   │       ├─ Resposta
│   │       ├─ SubmitRequest
│   │       └─ ResultadoResponse
│   │
│   ├── 📂 data/
│   │   └── questions.go             # Dados mockados em memória
│   │       ├─ 10 perguntas Fácil   (+, -)
│   │       ├─ 10 perguntas Médio   (×, ÷)
│   │       └─ 10 perguntas Difícil (expressões)
│   │
│   ├── 📂 handlers/
│   │   └── quiz.go                  # Lógica de negócio dos endpoints
│   │       ├─ GetLevels()
│   │       ├─ GetQuestions()
│   │       └─ SubmitAnswers()
│   │
│   ├── 📂 routes/
│   │   └── routes.go                # Configuração de rotas e middleware
│   │       ├─ CORS habilitado
│   │       ├─ GET  /health
│   │       ├─ GET  /levels
│   │       ├─ GET  /questions?level=X
│   │       └─ POST /submit
│   │
│   ├── 🔌 go.mod                    # Dependências (Gin, UUID, etc)
│   └── 🔌 go.sum                    # Hash das dependências (autogenerado)
│
├── 📚 DOCUMENTAÇÃO
│   ├── INDEX.md                     # 👈 COMECE AQUI (índice de docs)
│   ├── README.md                    # Documentação principal completa
│   ├── QUICKSTART.md                # Instruções de 5 minutos
│   ├── ARQUITETURA.md               # Diagramas e fluxos da API
│   ├── REACT_EXAMPLES.md            # Como integrar com React
│   ├── POSTGRESQL_GUIDE.md          # Como migrar para banco
│   └── FAQ.md                       # Perguntas frequentes
│
├── 🧪 TESTES
│   ├── requests.http                # Exemplos de requisições HTTP
│   │   ├─ GET /health
│   │   ├─ GET /levels
│   │   ├─ GET /questions
│   │   └─ POST /submit (vários exemplos)
│   │
│   └── (Testes automatizados: *_test.go - TODO)
│
├── 🐳 DEPLOYMENT
│   ├── Dockerfile                   # Multi-stage build (produção)
│   ├── docker-compose.yml           # Orquestração (API + DB futuro)
│   ├── .dockerignore                # Arquivos a ignorar no Docker
│   ├── Makefile                     # Comandos úteis (make run, etc)
│   └── .gitignore                   # Arquivos a ignorar no Git
│
└── 📁 DIRETÓRIOS FUTUROS (TODO)
    ├── database/                    # Conexão com PostgreSQL
    │   ├── db.go
    │   └── schema.sql
    ├── middleware/                  # Middlewares (auth, logging)
    │   └── auth.go
    ├── tests/                       # Testes automatizados
    │   └── handlers_test.go
    ├── migrations/                  # Migrations do banco
    └── config/                      # Configurações
```

---

## 🔄 Fluxo de Dados

```
┌──────────────────────────────────────────────────────────────┐
│                   CLIENTE (React/Browser)                    │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP JSON (CORS OK)
                         ↓
┌──────────────────────────────────────────────────────────────┐
│            routes/routes.go (Roteador + Middleware)          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ GET /levels      → GetLevels()                         │  │
│  │ GET /questions   → GetQuestions()                      │  │
│  │ POST /submit     → SubmitAnswers()                     │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│        handlers/quiz.go (Lógica de Negócio)                  │
│  • Valida entrada (JSON binding)                             │
│  • Chama data.GetQuestions()                                 │
│  • Processa respostas                                        │
│  • Calcula pontuação                                         │
│  • Formata resposta JSON                                     │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│        data/questions.go (Dados em Memória)                  │
│  • GetLevels() → retorna 3 níveis                            │
│  • GetQuestionsByLevel(level) → 10 perguntas hardcoded       │
│                                                              │
│  [FUTURO: substituir por database/db.go]                    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────────┐
│        models/quiz.go (Estruturas de Dados)                  │
│  • Question, Level, Resposta, etc                            │
│  • JSON tags para serialização                               │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
                  JSON Response
                       ↓
┌──────────────────────────────────────────────────────────────┐
│                   CLIENTE (Recebe JSON)                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Dependências Instaladas

```
github.com/gin-gonic/gin          (HTTP Framework)
  └─ Roteamento, middleware, JSON binding

github.com/google/uuid            (Gerador de UUID - opcional por enquanto)
  └─ Para gerar IDs únicos (será usado com DB)

Outras dependências transitivas:
  └─ encoding/json, net/http, etc (stdlib do Go)
```

---

## 📞 Arquivos de Configuração

| Arquivo | Propósito |
|---------|-----------|
| `go.mod` | Define dependências e versão do Go |
| `go.sum` | Lock file (versões exatas das dependências) |
| `.gitignore` | Arquivos a ignorar no Git |
| `.dockerignore` | Arquivos a ignorar no Docker |
| `Dockerfile` | Build em containers |
| `docker-compose.yml` | Orquestração (API + DB) |
| `Makefile` | Atalhos de comandos |

---

## 🎯 Endpoints Disponíveis

```
┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT 1: GET /health                                     │
├─────────────────────────────────────────────────────────────┤
│ Descrição:  Health check do servidor                        │
│ Parâmetros: Nenhum                                          │
│ Resposta:   { "status": "ok" }                              │
│ Arquivo:    routes/routes.go (handler inline)              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT 2: GET /levels                                     │
├─────────────────────────────────────────────────────────────┤
│ Descrição:  Retorna os níveis disponíveis                   │
│ Parâmetros: Nenhum                                          │
│ Handler:    handlers.GetLevels()                            │
│ Resposta:   { levels: [...] }                               │
│ Arquivo:    handlers/quiz.go                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT 3: GET /questions?level=easy                       │
├─────────────────────────────────────────────────────────────┤
│ Descrição:  Retorna 10 perguntas do nível                   │
│ Parâmetros: level (easy/medium/hard)                        │
│ Handler:    handlers.GetQuestions()                         │
│ Resposta:   { level, total, perguntas: [...] }             │
│ Arquivo:    handlers/quiz.go                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT 4: POST /submit                                    │
├─────────────────────────────────────────────────────────────┤
│ Descrição:  Submete respostas e calcula resultado           │
│ Body:       { level, respostas: [...] }                     │
│ Handler:    handlers.SubmitAnswers()                        │
│ Resposta:   { acertos, total, pontuacao, percentual, ... }  │
│ Arquivo:    handlers/quiz.go                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Estatísticas do Projeto

```
Total de arquivos de código:     6
Total de linhas de código:       ~800
Total de perguntas:              30 (10 × 3 níveis)
Total de comentários:            ~150 linhas
Tempo para rodar:                <100ms
Documentação:                    ~7000 linhas
```

---

## 🎓 Conceitos de Go Utilizados

- ✅ Pacotes (packages)
- ✅ Structs e tags JSON
- ✅ Funções e receivers
- ✅ Slices e maps
- ✅ Error handling
- ✅ Imports
- ✅ Tipos primitivos e customizados

---

## 🚀 Como Começar

```bash
# 1. Entrar na pasta
cd qiabaco

# 2. Baixar dependências
go mod download

# 3. Rodar servidor
go run main.go

# 4. Testar (em outro terminal)
curl http://localhost:8080/health

# 5. Ler documentação
# Abra: INDEX.md
```

---

## 📚 Próximas Etapas

```
Atual: Dados mockados em memória ✅

Passo 1: Adicionar mais perguntas
  └─ Edite: data/questions.go

Passo 2: PostgreSQL
  └─ Crie: database/db.go
  └─ Veja: POSTGRESQL_GUIDE.md

Passo 3: Autenticação
  └─ Crie: middleware/auth.go
  └─ Veja: FAQ.md (P12)

Passo 4: Frontend React
  └─ Veja: REACT_EXAMPLES.md

Passo 5: Deploy
  └─ Use: Dockerfile ou docker-compose.yml
```

---

**Estrutura criada com ❤️ para facilitar aprendizado de Go + Gin!**


# ❓ Perguntas Frequentes e Troubleshooting

## 🚀 Instalação e Execução

### P1: "Go não está instalado. Como instalar?"
**R:** Baixe em https://golang.org/dl/ e siga as instruções para seu SO (Windows/Mac/Linux).

Verifique:
```bash
go version
```

---

### P2: "Erro: 'go: command not found'"
**R:** Go não está no PATH. Após instalar:
1. **Windows**: Reinicie o terminal (cmd/PowerShell)
2. **Mac/Linux**: Execute: `source ~/.bashrc` (ou `.zshrc`)

---

### P3: "Como rodar o projeto?"
**R:** 
```bash
cd qiabaco
go mod download
go run main.go
```

Acesse: http://localhost:8080/health

---

### P4: "Porta 8080 já está em uso. Posso mudar?"
**R:** Sim! Edite `main.go`:
```go
port := ":9090"  // Mude para 9090 ou outra porta
router.Run(port)
```

---

## 🔌 API e Endpoints

### P5: "Como testar os endpoints?"
**R:** Você tem 3 opções:

1. **Browser** (GET apenas):
   - http://localhost:8080/levels
   - http://localhost:8080/questions?level=easy

2. **cURL** (Terminal):
   ```bash
   curl http://localhost:8080/levels
   curl -X POST http://localhost:8080/submit ...
   ```

3. **Postman/Insomnia**:
   - Importe os endpoints manualmente ou use `requests.http`

---

### P6: "Posso usar requests.http no VS Code?"
**R:** Sim! Instale a extensão **"REST Client"**:
1. Abra VS Code
2. Extensões → Busque "REST Client"
3. Clique em requests.http
4. Verá botões "Send Request" acima de cada requisição

---

### P7: "GET /questions retorna a resposta correta. Isso não expõe as respostas?"
**R:** Você está correto! Para produção, deveria:

**Opção 1:** Não retornar `resposta` no GET (recomendado)
```go
type QuestionResponse struct {
    ID       string   `json:"id"`
    Enunciar string   `json:"enunciar"`
    Opcoes   []string `json:"opcoes"`
    // SEM: Resposta
}
```

**Opção 2:** Remover resposta antes de retornar
```go
for i := range questions {
    questions[i].Resposta = "" // Zera a resposta
}
```

---

### P8: "Posso chamar a API de outro domínio?"
**R:** Sim! CORS está habilitado em `routes/routes.go`:
```go
c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
```

Para restringir a um domínio:
```go
c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
```

---

## 💾 Banco de Dados

### P9: "Quando mudo para PostgreSQL, preciso reescrever tudo?"
**R:** Não! Apenas a parte de dados:
- Crie `database/db.go`
- Mude `handlers/quiz.go` para usar `database.GetQuestions()` em vez de `data.GetQuestions()`
- Tudo mais continua igual!

---

### P10: "Como começar com PostgreSQL?"
**R:** Veja o arquivo `POSTGRESQL_GUIDE.md` para:
- Exemplo de código
- Script SQL para criar tabelas
- Passo a passo de migração

---

## 🔐 Segurança

### P11: "É seguro usar esses dados em produção?"
**R:** Não, porque:
- Perguntas estão hardcoded (não escalável)
- Sem autenticação (qualquer um pode usar)
- Sem validação robusta
- Sem rate limiting

Para produção, implemente:
1. Banco de dados
2. Autenticação JWT
3. Rate limiting
4. Validação rigorosa

---

### P12: "Como adicionar autenticação?"
**R:** Exemplo básico com JWT:

```go
// middleware/auth.go
package middleware

import (
    "github.com/golang-jwt/jwt"
    "github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.JSON(401, gin.H{"erro": "Token não fornecido"})
            c.Abort()
            return
        }
        // Validar token...
        c.Next()
    }
}
```

Depois, em `routes.go`:
```go
router.POST("/submit", middleware.AuthRequired(), handlers.SubmitAnswers)
```

---

## 🧪 Testes

### P13: "Como testar o código?"
**R:** Crie um arquivo `handlers/quiz_test.go`:

```go
package handlers

import (
	"testing"
)

func TestSubmitAnswers(t *testing.T) {
	// Teste aqui
}
```

Rode:
```bash
go test ./handlers
```

---

### P14: "Como testar a API completa?"
**R:** Use `requests.http`:
1. Instale extensão REST Client
2. Abra requests.http
3. Clique "Send Request" em cada teste

---

## 🐛 Erros Comuns

### P15: "Erro: 'no required module provides package'"
**R:** Dependências não instaladas:
```bash
go mod download
go mod tidy
```

---

### P16: "Erro: 'cannot assign to field' ao modificar structs"
**R:** Em Go, você precisa acessar via ponteiro ou criar novo objeto:

```go
// ❌ Errado
question.Resposta = ""

// ✅ Correto
question := models.Question{
    ID: "q1",
    Resposta: "",
}
```

---

### P17: "Por que as perguntas são iguais toda vez?"
**R:** Porque estão hardcoded em memória. Para variar:

```go
// data/questions.go
import "math/rand"

var allQuestions = []models.Question{...}

func GetQuestionsByLevel(level string) []models.Question {
    questionsForLevel := filterByLevel(allQuestions, level)
    
    // Embaralha
    rand.Shuffle(len(questionsForLevel), 
        func(i, j int) {
            questionsForLevel[i], questionsForLevel[j] = 
                questionsForLevel[j], questionsForLevel[i]
        })
    
    return questionsForLevel[:10]
}
```

---

### P18: "Posso rodar em Docker?"
**R:** Sim! Crie `Dockerfile`:

```dockerfile
FROM golang:1.21-alpine

WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o qiabaco main.go

EXPOSE 8080

CMD ["./qiabaco"]
```

Depois:
```bash
docker build -t qiabaco .
docker run -p 8080:8080 qiabaco
```

---

## 📦 Estrutura e Organização

### P19: "Onde adiciono novas funcionalidades?"
**R:** Padrão recomendado:

```
nova-feature/
├── models/
│   └── feature.go       (estruturas de dados)
├── handlers/
│   └── feature.go       (lógica de negócio)
├── data/
│   └── feature.go       (dados/queries)
└── routes/
    └── feature.go       (novas rotas)
```

Depois adicione ao `main.go`:
```go
routes.SetupFeatureRoutes(router)
```

---

### P20: "Como organizar o código para grandes projetos?"
**R:** Estrutura sugerida:

```
qiabaco/
├── cmd/
│   └── main.go          (entrada)
├── internal/
│   ├── models/
│   ├── handlers/
│   ├── database/
│   ├── middleware/
│   └── config/
├── pkg/
│   └── utils/           (código reutilizável)
├── migrations/          (SQL para DB)
├── tests/
└── docs/
```

---

## 🎯 Performance e Otimização

### P21: "Como melhorar performance?"
**R:** Dicas:

1. **Cache perguntas em memória** (já fazemos)
2. **Usar índices no DB** (quando migrar)
3. **Compressão GZIP** (middleware)
4. **Rate limiting** (proteger API)
5. **Connection pooling** (se usar DB)

---

### P22: "Quanto tempo a API deve responder?"
**R:** Metas recomendadas:

- `/levels`: < 10ms
- `/questions`: < 50ms
- `/submit`: < 100ms

Com dados em memória, já temos isso! 🚀

---

## 📚 Aprendizado e Referências

### P23: "Como aprender Go melhor?"
**R:** Recursos recomendados:

1. [A Tour of Go](https://tour.golang.org/)
2. [Go by Example](https://gobyexample.com/)
3. [Effective Go](https://golang.org/doc/effective_go)
4. [Gin Documentation](https://github.com/gin-gonic/gin)

---

### P24: "Qual é a próxima etapa para aprender?"
**R:** Sugestões em ordem:

1. ✅ **Você está aqui**: API sem banco
2. → PostgreSQL + SQL
3. → Autenticação JWT
4. → Frontend React
5. → Deploy (Docker/Heroku)
6. → Testes automatizados
7. → CI/CD (GitHub Actions)
8. → Monitoramento/Logging

---

## 🤝 Contribuindo e Evoluindo

### P25: "Como posso expandir o projeto?"
**R:** Ideias sugeridas:

1. **Adicionar mais perguntas**
   - Crie `data/questions_advanced.go`
   - Implemente `GetAdvancedQuestions()`

2. **Novos tipos de quiz**
   - Verdadeiro/Falso
   - Preencher lacunas
   - Problemas de múltiplas etapas

3. **Gamificação**
   - Sistema de XP
   - Badges/conquistas
   - Leaderboard

4. **Analytics**
   - Rastrear progresso
   - Identificar pontos fracos
   - Relatórios

---

## 💬 Onde Pedir Ajuda

### P26: "Onde encontro mais ajuda?"
**R:** Comunidades:

- **Stack Overflow**: Tag `go` e `gin`
- **Go Community**: https://golang.org/conduct
- **GitHub**: Abra uma issue
- **Discord**: Comunidade Go Brasil

---

## 🎉 Conclusão

Se você chegou aqui e seu projeto está rodando, **PARABÉNS!** 🎊

Você agora tem:
- ✅ API REST funcional em Go
- ✅ Código bem estruturado
- ✅ Documentação completa
- ✅ Exemplo de integração React
- ✅ Roadmap para evolução

**Próximo passo:** Implemente o frontend React usando os exemplos em `REACT_EXAMPLES.md`!


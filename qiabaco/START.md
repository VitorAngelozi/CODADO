```
  ██████╗ ██╗ █████╗ ██████╗  █████╗  ██████╗ ██████╗ 
  ██╔═══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗
  ██║   ██║██║███████║██████╔╝███████║██║     ██║   ██║
  ██║▄▄██║██║██╔══██║██╔══██╗██╔══██║██║     ██║   ██║
  ╚██████╔╝██║██║  ██║██████╔╝██║  ██║╚██████╗╚██████╔╝
   ╚══▀▀═╝ ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
   
   Quiz de Matemática Style Duolingo 🎯
```

---

# 🎓 Qiabaco - MVP Backend

Um projeto educacional de **API REST em Go + Gin** para um sistema de quiz de matemática.

---

## ⚡ Quick Start (3 passos)

```bash
# 1. Instalar dependências
go mod download

# 2. Rodar servidor
go run main.go

# 3. Testar (em outro terminal)
curl http://localhost:8080/health
```

**Resposta esperada:** `{"status":"ok"}`

---

## 📊 O que você tem aqui

```
✅ Backend Go + Gin           - API REST funcional
✅ 3 Níveis de Dificuldade   - Fácil, Médio, Difícil
✅ 30 Perguntas de Matemática - 10 por nível
✅ Sistema de Pontuação       - Acertos, pontos, percentual
✅ 4 Endpoints Prontos        - GET/POST bem estruturados
✅ CORS Habilitado            - Pronto para React
✅ Dados em Memória           - Mockados (sem DB ainda)
✅ Código Bem Comentado       - Fácil de entender
✅ Documentação Completa      - 7000+ linhas
✅ Pronto para Deploy         - Docker incluído
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Verificar se servidor está rodando |
| `GET` | `/levels` | Listar 3 níveis disponíveis |
| `GET` | `/questions?level=easy` | Obter 10 perguntas do nível |
| `POST` | `/submit` | Submeter respostas e obter pontuação |

---

## 📁 Estrutura

```
qiabaco/
├── main.go                  # Entrada da aplicação
├── models/quiz.go           # Estruturas de dados
├── data/questions.go        # 30 perguntas hardcoded
├── handlers/quiz.go         # Lógica dos endpoints
├── routes/routes.go         # Configuração de rotas
├── go.mod                   # Dependências
└── 📚 DOCUMENTAÇÃO
    ├── INDEX.md             # Índice completo
    ├── README.md            # Guia completo
    ├── QUICKSTART.md        # Início rápido
    ├── ARQUITETURA.md       # Diagramas e fluxos
    ├── REACT_EXAMPLES.md    # Integração com React
    ├── POSTGRESQL_GUIDE.md  # Migração para DB
    ├── FAQ.md               # Perguntas frequentes
    └── ... (mais 5 arquivos)
```

---

## 🚀 Exemplo de Uso

### 1. Obter níveis
```bash
curl http://localhost:8080/levels
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

### 2. Obter perguntas
```bash
curl "http://localhost:8080/questions?level=easy"
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

### 3. Submeter respostas
```bash
curl -X POST http://localhost:8080/submit \
  -H "Content-Type: application/json" \
  -d '{
    "level": "easy",
    "respostas": [
      {"pergunta_id": "q1_easy", "opcao": "8"},
      ...
    ]
  }'
```

**Resposta:**
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

## 📚 Documentação

| Documento | Para quem... | Tempo |
|-----------|-------------|-------|
| **INDEX.md** | Quer saber o que existe | 3 min |
| **QUICKSTART.md** | Quer rodar AGORA | 5 min |
| **README.md** | Quer entender TUDO | 20 min |
| **ARQUITETURA.md** | Quer ver diagramas | 20 min |
| **REACT_EXAMPLES.md** | Quer usar em React | 15 min |
| **POSTGRESQL_GUIDE.md** | Quer banco de dados | 30 min |
| **FAQ.md** | Tem dúvidas | 20 min |
| **requests.http** | Quer testar API | 5 min |

---

## 🎯 Próximas Etapas

```
┌─────────────────────────────────────────┐
│ FASE 1: Você está aqui ✅               │
│ ✅ API Rest funcional                   │
│ ✅ Dados em memória                     │
│ ✅ 3 níveis                             │
│ ✅ Documentação completa                │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 2: PostgreSQL                      │
│ □ Criar banco                           │
│ □ Migrar dados                          │
│ □ Testar endpoints                      │
│ 📖 Ver: POSTGRESQL_GUIDE.md             │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 3: Frontend React                  │
│ □ Novo projeto React                    │
│ □ Componentes do quiz                   │
│ □ Integração com API                    │
│ 📖 Ver: REACT_EXAMPLES.md               │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 4: Autenticação                    │
│ □ Sistema de usuários                   │
│ □ JWT tokens                            │
│ □ Histórico por usuário                 │
│ 📖 Ver: FAQ.md (P12)                    │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ FASE 5: Deploy                          │
│ □ Docker                                │
│ □ Heroku/Railway                        │
│ □ Domínio próprio                       │
│ 📖 Ver: Dockerfile                      │
└─────────────────────────────────────────┘
```

---

## 💡 O que você vai aprender

### Go + Gin:
- ✅ Estrutura de projetos
- ✅ Roteamento HTTP
- ✅ Middleware
- ✅ JSON binding/serialization
- ✅ Tratamento de erros
- ✅ Separação de responsabilidades

### API Design:
- ✅ Endpoints RESTful
- ✅ CORS
- ✅ Request/Response patterns
- ✅ HTTP status codes
- ✅ JSON schemas

### Boas Práticas:
- ✅ Código bem comentado
- ✅ Nomes descritivos
- ✅ Documentação técnica
- ✅ Organização de pastas
- ✅ Reutilização de código

---

## 🛠️ Ferramentas

### Necessárias:
- **Go 1.21+** - [Download](https://golang.org/dl/)
- **Git** - [Download](https://git-scm.com/)

### Opcionais:
- **VS Code** - Editor
- **REST Client** - Extensão VS Code para testar API
- **Postman** - Alternativa para testar API
- **Docker** - Para containers

---

## 🧪 Como Testar

### Opção 1: cURL (Terminal)
```bash
curl http://localhost:8080/levels
```

### Opção 2: VS Code + REST Client
```
1. Instale: REST Client extension
2. Abra: requests.http
3. Clique: Send Request
```

### Opção 3: Browser (GET apenas)
```
http://localhost:8080/health
http://localhost:8080/levels
http://localhost:8080/questions?level=easy
```

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| Linhas de código | ~800 |
| Perguntas | 30 |
| Endpoints | 4 |
| Arquivos de código | 6 |
| Documentação | ~7000 linhas |
| Tempo de resposta | <100ms |

---

## ❓ Dúvidas?

- 📖 **Documentação:** Ver INDEX.md
- ❓ **Perguntas:** Ver FAQ.md
- 🏗️ **Arquitetura:** Ver ARQUITETURA.md
- ⚠️ **Problemas:** Ver CHECKLIST.md

---

## 📞 Estrutura de Suporte

```
Erro/Dúvida
    ↓
1. Consulte: FAQ.md
    ↓ Não encontrou?
2. Verifique: CHECKLIST.md
    ↓ Ainda não?
3. Releia: README.md e ARQUITETURA.md
    ↓ Ainda assim?
4. Revise o código com comentários
```

---

## 🎉 Você está pronto!

Você agora tem um **backend robusto, bem documentado e pronto para expandir**.

### Primeira coisa a fazer:
```bash
# 1. Entre na pasta
cd qiabaco

# 2. Baixe dependências
go mod download

# 3. Rode o servidor
go run main.go

# 4. Teste em outro terminal
curl http://localhost:8080/health

# 5. Leia a documentação
# Comece por: INDEX.md
```

---

## 📚 Leitura Recomendada

1. **Comece:** [QUICKSTART.md](QUICKSTART.md) - 5 min
2. **Entenda:** [README.md](README.md) - 20 min
3. **Explore:** [ARQUITETURA.md](ARQUITETURA.md) - 20 min
4. **Experimente:** [requests.http](requests.http) - 5 min
5. **Depois:** Escolha próxima fase acima

---

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  Qiabaco MVP v1.0                                        ║
║  Backend: Go + Gin ✅                                    ║
║  Documentação: Completa ✅                               ║
║  Pronto para Uso ✅                                      ║
║                                                           ║
║  Status: 🚀 PRONTO PARA RODAR                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Criado com ❤️ para facilitar seu aprendizado de Go e desenvolvimento web!**

---

*Última atualização: 2024*  
*Versão: 1.0*  
*Status: ✅ Funcional e Completo*


# 📚 Índice de Documentação do Qiabaco

Bem-vindo! Este arquivo lista toda a documentação disponível para o projeto Qiabaco.

---

## 🚀 Comece Aqui

### Para quem quer rodar AGORA:
👉 **[QUICKSTART.md](QUICKSTART.md)** 
- ⏱️ 5 minutos
- Instruções passo a passo
- Testes básicos

### Para quem quer entender TUDO:
👉 **[README.md](README.md)**
- 📖 Guia completo
- Visão geral do projeto
- Documentação de endpoints
- Explicação de boas práticas

---

## 📁 Arquivos do Projeto

```
qiabaco/
│
├── 📄 main.go                    # Ponto de entrada
├── 🔌 go.mod                     # Dependências
│
├── 📂 models/
│   └── quiz.go                   # Estruturas de dados
│
├── 📂 data/
│   └── questions.go              # 30 perguntas hardcoded
│
├── 📂 handlers/
│   └── quiz.go                   # Lógica dos endpoints
│
├── 📂 routes/
│   └── routes.go                 # Configuração de rotas + CORS
│
└── 📚 Documentação:
    ├── README.md                 # Documentação principal
    ├── QUICKSTART.md             # Início rápido
    ├── ARQUITETURA.md            # Diagramas e fluxos
    ├── REACT_EXAMPLES.md         # Como usar em React
    ├── POSTGRESQL_GUIDE.md       # Como migrar para DB
    ├── FAQ.md                    # Perguntas frequentes
    ├── requests.http             # Exemplos para testar
    └── INDEX.md                  # Este arquivo
```

---

## 📖 Documentação Detalhada

### 1. **README.md** (Leia primeiro!)
**Conteúdo:**
- 📋 Visão geral do projeto
- 🏗️ Estrutura de pastas
- 🚀 Como rodar
- 📡 Documentação de todos os 4 endpoints
- 🧪 Como testar com cURL
- 📝 Explicação do código
- 🚦 Fluxo da aplicação
- 🛠️ Boas práticas implementadas

**Tempo de leitura:** ~15 minutos

---

### 2. **QUICKSTART.md** (Para os apressados!)
**Conteúdo:**
- 1️⃣ Instalação do Go
- 2️⃣ Preparar projeto
- 3️⃣ Rodar servidor
- 4️⃣ Testar endpoints
- 5️⃣ Próximas etapas

**Tempo de leitura:** ~3 minutos

---

### 3. **ARQUITETURA.md** (Para entender como funciona)
**Conteúdo:**
- 🔄 Diagrama da arquitetura
- 📥 Fluxo de GET /levels
- 📥 Fluxo de GET /questions
- 📤 Fluxo de POST /submit
- 🔄 Fluxo completo do usuário
- 🎯 Responsabilidades de cada arquivo
- 📊 Como expandir

**Tempo de leitura:** ~20 minutos

---

### 4. **REACT_EXAMPLES.md** (Para integrar com frontend)
**Conteúdo:**
- ⚙️ Configuração da URL base
- 🔌 Função auxiliar de fetch
- 📋 Exemplo 1: Obter níveis
- ❓ Exemplo 2: Obter perguntas
- ✅ Exemplo 3: Submeter respostas
- 💅 Exemplo 4: Componente React completo
- 📦 Exemplo 5: Como usar Axios

**Tempo de leitura:** ~15 minutos
**Uso:** Copie e adapte para seu projeto React

---

### 5. **POSTGRESQL_GUIDE.md** (Para evoluir para banco de dados)
**Conteúdo:**
- 🗄️ Exemplo de database/db.go
- 📊 Script SQL para criar tabelas
- 🔧 Como usar no main.go
- 🔄 Como modificar handlers
- 📋 Passo a passo de migração
- 🌍 Variáveis de ambiente
- 🗺️ Roadmap de implementação

**Tempo de leitura:** ~25 minutos
**Uso:** Quando estiver pronto para PostgreSQL

---

### 6. **FAQ.md** (Respostas para suas perguntas)
**Conteúdo:**
- 🚀 Instalação e Execução (5 perguntas)
- 🔌 API e Endpoints (4 perguntas)
- 💾 Banco de Dados (2 perguntas)
- 🔐 Segurança (2 perguntas)
- 🧪 Testes (2 perguntas)
- 🐛 Erros Comuns (4 perguntas)
- 📦 Estrutura (2 perguntas)
- 🎯 Performance (2 perguntas)
- 📚 Aprendizado (2 perguntas)
- 🤝 Evolução (1 pergunta)

**Tempo de leitura:** ~20 minutos
**Uso:** Quando encontrar problemas

---

### 7. **requests.http** (Exemplos práticos)
**Conteúdo:**
- Health check
- GET /levels
- GET /questions (fácil/médio/difícil)
- POST /submit (várias combinações de respostas)

**Como usar:**
1. Instale extensão REST Client do VS Code
2. Clique em "Send Request" em cada exemplo
3. Veja resposta em tempo real

**Tempo de execução:** ~5 minutos

---

## 🎯 Roteiro Recomendado

### Dia 1: Aprender
```
1. Leia: QUICKSTART.md (3 min)
2. Execute: go run main.go (2 min)
3. Teste: requests.http (5 min)
4. Leia: README.md (15 min)
Total: ~25 minutos
```

### Dia 2: Entender
```
1. Leia: ARQUITETURA.md (20 min)
2. Revise: código fonte (models/, data/, handlers/) (20 min)
3. Experimente: modifique uma pergunta e rode novamente (10 min)
Total: ~50 minutos
```

### Dia 3: Criar frontend
```
1. Leia: REACT_EXAMPLES.md (15 min)
2. Crie: novo projeto React (5 min)
3. Implemente: os 3 componentes principais (60 min)
4. Teste: com backend rodando (30 min)
Total: ~110 minutos
```

### Dia 4: Evoluir
```
1. Leia: POSTGRESQL_GUIDE.md (25 min)
2. Configure: banco PostgreSQL local (20 min)
3. Implemente: database/db.go (60 min)
4. Teste: endpoints com banco (30 min)
Total: ~135 minutos
```

---

## 📊 Estrutura dos Endpoints

```
GET /levels
├─ Retorna: lista de 3 níveis
├─ Response: JSON com id, nome, desc
└─ Uso: exibir botões de seleção

GET /questions?level=easy
├─ Retorna: 10 perguntas do nível
├─ Response: JSON com perguntas e opções
└─ Uso: exibir quiz

POST /submit
├─ Recebe: respostas do usuário
├─ Response: acertos, pontuação, mensagem
└─ Uso: calcular resultado
```

---

## 🔑 Conceitos-Chave

| Conceito | Arquivo | Descrição |
|----------|---------|-----------|
| **Models** | models/quiz.go | Estruturas de dados (structs) |
| **Dados** | data/questions.go | Perguntas hardcoded em memória |
| **Lógica** | handlers/quiz.go | Processamento de requisições |
| **Rotas** | routes/routes.go | Mapeamento de endpoints |
| **CORS** | routes/routes.go | Permite chamadas do frontend |
| **Middleware** | routes/routes.go | Processadores de requisição |

---

## 🚦 Progresso do Projeto

### Fase 1: Dados Mockados ✅ (VOCÊ ESTÁ AQUI)
- ✅ API REST funcional
- ✅ 3 níveis com 10 perguntas cada
- ✅ Sistema de pontuação
- ✅ Documentação completa

### Fase 2: PostgreSQL (TODO)
- [ ] Tabelas do banco
- [ ] Integração com handlers
- [ ] Persistência de dados
- [ ] Queries otimizadas

### Fase 3: Autenticação (TODO)
- [ ] Modelo de usuários
- [ ] JWT tokens
- [ ] Proteção de endpoints
- [ ] Histórico por usuário

### Fase 4: Frontend React (TODO)
- [ ] Componente de seleção
- [ ] Quiz interativo
- [ ] Tela de resultado
- [ ] Estilo com Tailwind

### Fase 5: Deploy (TODO)
- [ ] Docker
- [ ] Heroku/Railway
- [ ] CI/CD
- [ ] Monitoramento

---

## 💡 Dicas de Uso

### Para Iniciantes em Go:
1. Leia os comentários no código (principalmente em models/ e handlers/)
2. Entenda o padrão de separação de responsabilidades
3. Experimente adicionar 5 novas perguntas

### Para Devs Experientes:
1. Analise a estrutura para grandes projetos
2. Implemente testes unitários
3. Adicione mais níveis/categorias

### Para Estudar Gin:
1. Veja como CORS é implementado
2. Estude tratamento de erros
3. Explore alternativas de middleware

---

## 🔗 Links Úteis

- [Go Official](https://golang.org/)
- [Gin Web Framework](https://github.com/gin-gonic/gin)
- [PostgreSQL](https://www.postgresql.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Resumo Rápido

| Preciso... | Vejo... |
|-----------|---------|
| Rodar rápido | QUICKSTART.md |
| Entender tudo | README.md |
| Ver diagramas | ARQUITETURA.md |
| Usar em React | REACT_EXAMPLES.md |
| Migrar para DB | POSTGRESQL_GUIDE.md |
| Resolver problemas | FAQ.md |
| Testar endpoints | requests.http |
| Encontrar algo | **Este arquivo (INDEX.md)** |

---

## 🎓 Estrutura de Aprendizado

```
Iniciante
    ↓
QUICKSTART (5 min) - Rodar projeto
    ↓
README (20 min) - Entender endpoints
    ↓
requests.http (10 min) - Testar na prática
    ↓
Intermediário
    ↓
ARQUITETURA (20 min) - Ver diagramas
    ↓
Código fonte (30 min) - Ler e comentar
    ↓
REACT_EXAMPLES (15 min) - Integrar frontend
    ↓
Avançado
    ↓
POSTGRESQL_GUIDE (30 min) - Evoluir para DB
    ↓
Adicionar recursos próprios
    ↓
Deploy em produção
```

---

## 🎉 Conclusão

Você tem tudo que precisa para:
1. ✅ Rodar a API agora
2. ✅ Entender como funciona
3. ✅ Integrar com React
4. ✅ Evoluir para produção

**Comece pelo QUICKSTART.md e divirta-se!** 🚀

---

**Versão:** 1.0  
**Atualizado:** 2024  
**Mantido por:** Qiabaco Team  


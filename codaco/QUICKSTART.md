# Guia Rápido de Inicialização

## 1️⃣ Instalação do Go

Se ainda não tiver Go instalado, baixe em: https://golang.org/dl/

Verifique a versão:
```bash
go version
```

## 2️⃣ Preparar o Projeto

```bash
# Entrar na pasta
cd qiabaco

# Baixar dependências
go mod download

# Sincronizar (recomendado)
go mod tidy
```

## 3️⃣ Rodar o Servidor

```bash
go run main.go
```

Você verá:
```
🎯 Servidor Qiabaco iniciado em http://localhost:8080
📚 Endpoints disponíveis:
  - GET  /health            - Verificar status do servidor
  - GET  /levels            - Obter níveis disponíveis
  - GET  /questions?level=easy  - Obter perguntas
  - POST /submit            - Submeter respostas
```

## 4️⃣ Testar os Endpoints

**Opção 1: Browser**
- Ir para: http://localhost:8080/health
- Ir para: http://localhost:8080/levels
- Ir para: http://localhost:8080/questions?level=easy

**Opção 2: cURL (Terminal)**

```bash
# Health check
curl http://localhost:8080/health

# Obter níveis
curl http://localhost:8080/levels

# Obter perguntas
curl "http://localhost:8080/questions?level=easy"

# Submeter respostas
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

**Opção 3: Postman/Insomnia**
- Importe os endpoints acima em seu cliente REST favorito

## 5️⃣ Próximas Etapas

1. Explore os arquivos para entender a estrutura
2. Tente adicionar novas perguntas em `data/questions.go`
3. Implemente um novo nível (ex: "expert")
4. Crie um frontend React que consome esses endpoints

---

Dúvidas? Veja o `README.md` para mais detalhes!

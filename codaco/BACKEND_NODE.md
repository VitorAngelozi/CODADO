# Backend Node.js (Express)

## Rodar localmente

```bash
npm install
npm run dev
```

Servidor padrao: `http://localhost:8080`

## Endpoints

- `GET /health`
- `GET /levels`
- `GET /questions?level=easy`
- `POST /submit`

## Formato das questoes

Cada item em `questions` contem:
- `id`
- `question`
- `code`
- `options`
- `answer` (indice correto)
- `explanation`

## Exemplo de submit (novo formato)

```json
{
  "level": "easy",
  "answers": [
    { "id": "q1_easy", "answer": 1 },
    { "id": "q2_easy", "answer": 2 }
  ]
}
```

## Compatibilidade

O backend tambem aceita o formato legado:
- `respostas[].pergunta_id`
- `respostas[].opcao`

E retorna tambem `perguntas` no formato legado, alem de `questions` no formato novo.

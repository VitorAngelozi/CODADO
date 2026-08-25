# Codado

## Banco de dados e modelagem

O CODADO utiliza PostgreSQL 16 porque precisa de um banco relacional para garantir integridade entre usuarios, sessoes, trilhas, desafios e tentativas. O servico PostgreSQL e definido no `docker-compose.yml` e usa o volume Docker `codado-postgres-data`.

### Entidades e relacionamentos

- `users`: identidade do operador. A senha e armazenada somente em `password_hash`.
- `sessions`: sessoes autenticadas. O token nunca e armazenado em texto puro; apenas seu hash SHA-256 e salvo em `token_hash`.
- `tracks`: trilhas de aprendizagem, como logica e depuracao.
- `challenges`: desafios pertencentes a uma trilha.
- `attempts`: tentativas que ligam um usuario a um desafio e registram pontuacao/status.

Um usuario possui varias sessoes e varias tentativas. Uma trilha possui varios desafios, e um desafio recebe varias tentativas. O ranking e derivado com `SUM(attempts.score)` para tentativas aprovadas, sem duplicar um dado calculavel.

O DER esta em [docs/database/der.md](docs/database/der.md). Os scripts executaveis estao em [database/sql/001_schema.sql](database/sql/001_schema.sql), [database/sql/002_seed.sql](database/sql/002_seed.sql) e [database/sql/003_crud_examples.sql](database/sql/003_crud_examples.sql).

O schema demonstra `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE` e `CHECK`. Sessoes sao removidas quando o usuario e removido (`ON DELETE CASCADE`); tentativas tambem sao removidas com o usuario, enquanto um desafio com tentativas nao pode ser removido (`ON DELETE RESTRICT`).

### Execucao dos scripts

Inicie o PostgreSQL e a API:

```bash
docker compose up -d
```

Execute os scripts no banco usado pelo Compose. No PowerShell:

```powershell
Get-Content -Raw database/sql/001_schema.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U codado -d codado
Get-Content -Raw database/sql/002_seed.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U codado -d codado
Get-Content -Raw database/sql/003_crud_examples.sql | docker compose exec -T postgres psql -v ON_ERROR_STOP=1 -U codado -d codado
```

No Bash, use a mesma sequencia trocando `Get-Content -Raw arquivo |` por `cat arquivo |`.

O backend ja cria automaticamente `users` e `sessions` durante a inicializacao para manter o login operacional. O `001_schema.sql` representa essa estrutura fielmente e adiciona as entidades de aprendizagem. Atualmente a aplicacao usa diretamente a autenticacao PostgreSQL e executa o Bug Hunt via API; os dados de trilhas, desafios e tentativas deste modelo estao preparados para a evolucao da persistencia, enquanto parte do conteudo de quiz ainda esta em memoria no frontend/backend.

### Evidencias para o relatorio

Os comandos abaixo produzem evidencias diretamente do container PostgreSQL:

```powershell
# Tabelas existentes
docker compose exec postgres psql -U codado -d codado -c "\dt"

# Estrutura completa das tabelas
docker compose exec postgres psql -U codado -d codado -c "\d+ users" -c "\d+ sessions" -c "\d+ tracks" -c "\d+ challenges" -c "\d+ attempts"

# Dados inseridos
docker compose exec postgres psql -U codado -d codado -c "SELECT * FROM users;" -c "SELECT * FROM tracks;" -c "SELECT * FROM challenges;" -c "SELECT * FROM attempts;"

# SELECT com JOIN
docker compose exec postgres psql -U codado -d codado -c "SELECT u.name AS usuario, t.name AS trilha, c.title AS desafio, a.score, a.status FROM attempts a JOIN users u ON u.id=a.user_id JOIN challenges c ON c.id=a.challenge_id JOIN tracks t ON t.id=c.track_id ORDER BY a.submitted_at;"

# UPDATE demonstrativo
docker compose exec postgres psql -U codado -d codado -c "UPDATE attempts SET score=2, status='passed' WHERE id='30000000-0000-0000-0000-000000000001' RETURNING id, score, status;"

# DELETE demonstrativo (use o id criado pelo 003_crud_examples.sql)
docker compose exec postgres psql -U codado -d codado -c "DELETE FROM attempts WHERE id='30000000-0000-0000-0000-000000000099' RETURNING id;"

# Ranking/XP derivado
docker compose exec postgres psql -U codado -d codado -c "SELECT u.name, COALESCE(SUM(CASE WHEN a.status='passed' THEN a.score ELSE 0 END),0) AS xp FROM users u LEFT JOIN attempts a ON a.user_id=u.id GROUP BY u.id, u.name ORDER BY xp DESC;"

# Historico Git
git log --oneline --decorate --graph --all -15
git log --stat --oneline -- database/sql docs/database
```

Estrutura oficial do projeto:

- `apps/backend-go/` -> backend oficial em Go com `chi`, sandbox Docker e testes
- `apps/frontend/` -> app React/Vite
- `apps/backend-go/api/openapi/backend.yaml` -> fonte de verdade do contrato HTTP
- `apps/frontend/src/api/schema.ts` -> tipos gerados a partir do OpenAPI

## Organizacao

### Backend Go
- `apps/backend-go/cmd/api` bootstrap do servidor
- `apps/backend-go/internal/httpapi` rotas, middleware e handlers
- `apps/backend-go/internal/domain` contratos e regras de negocio
- `apps/backend-go/internal/data` dados em memoria do quiz e bug hunt
- `apps/backend-go/internal/sandbox` orquestracao do runner Python via Docker
- `apps/backend-go/internal/auth` persistencia PostgreSQL de usuarios e sessoes

### Frontend
- `apps/frontend/src/components` componentes reutilizaveis
- `apps/frontend/src/pages` paginas por trilha/modo
- `apps/frontend/src/api/contracts.ts` aliases estaveis para os tipos gerados
- `apps/frontend/src/lib/api.ts` cliente Axios usando `VITE_API_BASE_URL`

## Execucao local

Monorepo (root):

```bash
npm install
npm run generate:api-types
npm run dev
npm run build
npm run typecheck
```

Servicos:

```bash
npm run dev:backend:go
npm run dev:frontend
```

Comparacao de contratos:

```bash
npm run test:contract:live
```

`test:contract:live` so faz sentido quando voce quer comparar a API atual com outra URL externa ou legado ainda em execucao.

Frontend:

```bash
cd apps/frontend
npm run generate:api-types
npm run dev
```

Runner Python sandbox (Docker):

```bash
docker build -f apps/backend-go/Dockerfile.bughunt-runner -t codado-bughunt-runner:local apps/backend-go
```

## Ambiente

- `VITE_API_BASE_URL` define a URL da API consumida pelo frontend
- `DATABASE_URL` define a conexao PostgreSQL do backend
- `FRONTEND_ORIGIN` define a origem permitida pelo CORS (necessaria para cookies)
- `AUTH_COOKIE_SECURE` deve ser `true` em HTTPS e `false` no desenvolvimento local
- `SANDBOX_HOST_PREFIX` define o caminho visivel ao Docker host para o bind mount do sandbox
- `docker-compose.yml` sobe a API Go em `8080`

## Autenticacao PostgreSQL

O ambiente local sobe PostgreSQL 16 junto com a API. O banco fica acessivel em `localhost:5432` no host:


```bash
docker compose up --build
```

O banco usa o volume Docker `codado-postgres-data`, portanto os usuarios continuam existindo depois que os containers sao reiniciados. Para apagar todos os dados locais, execute:

```bash
docker compose down -v
```

Na primeira conexao, o backend cria automaticamente as tabelas `users` e `sessions`. A tabela `users` guarda `name`, `email` e somente o hash bcrypt da senha. A tabela `sessions` guarda o hash SHA-256 de um token aleatorio, o usuario associado e a data de expiracao. O token puro fica apenas no cookie `codado_session`, marcado como `HttpOnly` e `SameSite=Lax`.

### Endpoints de autenticacao

`POST /auth/register` cria uma conta e inicia a sessao. O payload exige `name`, `email` e senha com pelo menos 8 caracteres.

`POST /auth/login` valida email e senha e retorna os dados publicos do usuario. A sessao e enviada como cookie, nunca como senha ou token no JSON.

`GET /auth/me` retorna o usuario associado ao cookie atual. O frontend usa esse endpoint ao abrir a aplicacao.

`POST /auth/logout` remove a sessao do PostgreSQL e limpa o cookie.

### Desenvolvimento

Use `docker compose up --build` para iniciar o PostgreSQL e a API. Em outro terminal, inicie o frontend com `npm run dev:frontend`; a origem padrao esperada e `http://localhost:5173`. Para conectar a outro banco, sobrescreva `DATABASE_URL`, por exemplo:

```bash
DATABASE_URL=postgres://usuario:senha@localhost:5432/codado?sslmode=disable
```

O login ainda nao associa XP, ranking ou tentativas ao usuario. Esses dados continuam em memoria no frontend; a autenticacao fornece a identidade persistente para a proxima etapa.

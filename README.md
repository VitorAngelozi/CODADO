# Codado

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

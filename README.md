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
- `SANDBOX_HOST_PREFIX` define o caminho visivel ao Docker host para o bind mount do sandbox
- `docker-compose.yml` sobe a API Go em `8080`

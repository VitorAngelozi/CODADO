# Codado

Estrutura oficial do projeto:

- `apps/backend/` -> backend Node.js (API e sandbox runner orchestration)
- `apps/frontend/` -> app React/Vite
- `apps/frontend/src/styles/design-system.css` -> tokens e base visual reutilizavel
- `docker-compose.yml` e `Makefile` -> camada de orquestracao no root

## Organizacao

### Backend
- `apps/backend/src/controllers` controladores HTTP
- `apps/backend/src/routes` rotas da API
- `apps/backend/src/data` dados dos desafios
- `apps/backend/src/services` servicos (ex.: execucao sandbox Docker)
- `apps/backend/src/middlewares` middlewares globais

### Frontend
- `apps/frontend/src/components` componentes reutilizaveis
- `apps/frontend/src/pages` paginas por trilha/modo
- `apps/frontend/src/data` dados consumidos no cliente
- `apps/frontend/src/styles` base de design (cores, tipografia, classes utilitarias)

## Execucao local

Monorepo (root):

```bash
npm install
npm run dev:backend
npm run dev:frontend
npm run build
npm run typecheck
```

Backend (direto no app):

```bash
cd apps/backend
npm install
npm run dev
```

Frontend (direto no app):

```bash
cd apps/frontend
npm install
npm run dev
```

Runner Python sandbox (Docker):

```bash
docker build -f apps/backend/Dockerfile.bughunt-runner -t codado-bughunt-runner:local apps/backend
```

## Nota sobre `frontend/` antigo

Se ainda existir `./frontend` no root, ele pode ser um resquicio travado por processo local (Windows/IDE).
A estrutura oficial agora e `apps/frontend`. Feche processos que estejam usando a pasta antiga e remova:

```powershell
cmd /c "rmdir /s /q C:\Users\insted\Documents\Codaco\frontend"
```

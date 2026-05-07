# Codado

Estrutura padronizada do projeto:

- `src/` -> backend Node.js (API e sandbox runner orchestration)
- `frontend/` -> app React/Vite
- `frontend/src/styles/design-system.css` -> tokens e base visual reutilizavel

## Organizacao

### Backend
- `src/controllers` controladores HTTP
- `src/routes` rotas da API
- `src/data` dados dos desafios
- `src/services` servicos (ex.: execucao sandbox Docker)
- `src/middlewares` middlewares globais

### Frontend
- `frontend/src/components` componentes reutilizaveis
- `frontend/src/pages` paginas por trilha/modo
- `frontend/src/data` dados consumidos no cliente
- `frontend/src/styles` base de design (cores, tipografia, classes utilitarias)

## Execucao local

Backend:

```bash
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Runner Python sandbox (Docker):

```bash
docker build -f Dockerfile.bughunt-runner -t codado-bughunt-runner:local .
```

## Observacao sobre pasta duplicada antiga

Se ainda existir a pasta `./codaco` no disco, ela e um resquicio antigo e nao faz parte da estrutura oficial.
Em alguns casos o Windows bloqueia exclusao por arquivos em uso dentro de `node_modules`.
Feche processos Node/VSCode que estejam usando essa pasta e remova:

```powershell
cmd /c "rmdir /s /q C:\Users\insted\Documents\Codaco\codaco"
```

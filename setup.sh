#!/bin/bash

# Script para setup inicial do Qiabaco
# Execute: bash setup.sh

echo "Qiabaco - Setup Inicial"
echo "======================="
echo ""

echo "1. Verificando Go..."
if ! command -v go >/dev/null 2>&1; then
    echo "Go nao esta instalado."
    exit 1
fi
echo "Go encontrado: $(go version)"
echo ""

echo "2. Verificando Node.js..."
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js nao esta instalado."
    exit 1
fi
echo "Node encontrado: $(node --version)"
echo ""

echo "3. Verificando npm..."
if ! command -v npm >/dev/null 2>&1; then
    echo "npm nao esta instalado."
    exit 1
fi
echo "npm encontrado: $(npm --version)"
echo ""

echo "4. Instalando dependencias..."
if npm install; then
    echo "Dependencias instaladas"
else
    echo "Erro ao instalar dependencias"
    exit 1
fi
echo ""

echo "5. Validando testes, tipagem e build do monorepo..."
if npm run typecheck && npm run build; then
    echo "Build concluido"
else
    echo "Falha no build"
    exit 1
fi
echo ""

echo "6. Proximos passos:"
echo "   npm run dev:backend:go"
echo "   npm run dev:frontend"
echo "   docker build -f apps/backend-go/Dockerfile.bughunt-runner -t codado-bughunt-runner:local apps/backend-go"
echo "   curl http://localhost:8080/health"

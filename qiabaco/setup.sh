#!/bin/bash

# Script para setup inicial do Qiabaco
# Execute: bash setup.sh

echo "🎯 Qiabaco - Setup Inicial"
echo "=========================="
echo ""

# Verificar Go
echo "1️⃣  Verificando Go..."
if ! command -v go &> /dev/null; then
    echo "❌ Go não está instalado!"
    echo "   Baixe em: https://golang.org/dl/"
    exit 1
fi
echo "✅ Go encontrado: $(go version)"
echo ""

# Baixar dependências
echo "2️⃣  Baixando dependências..."
if go mod download; then
    echo "✅ Dependências baixadas"
else
    echo "❌ Erro ao baixar dependências"
    exit 1
fi
echo ""

# Sincronizar dependências
echo "3️⃣  Sincronizando dependências..."
if go mod tidy; then
    echo "✅ Dependências sincronizadas"
else
    echo "❌ Erro ao sincronizar"
    exit 1
fi
echo ""

# Verificar build
echo "4️⃣  Verificando build..."
if go build -o /tmp/qiabaco-test main.go 2>/dev/null; then
    echo "✅ Build bem-sucedido"
    rm -f /tmp/qiabaco-test
else
    echo "❌ Erro no build"
    exit 1
fi
echo ""

echo "✅ Setup concluído com sucesso!"
echo ""
echo "📚 Próximos passos:"
echo "   1. Leia: INDEX.md"
echo "   2. Rode: go run main.go"
echo "   3. Teste: curl http://localhost:8080/health"
echo ""
echo "🚀 Bom desenvolvimento!"

#!/bin/bash
# Script para executar migrations no container Docker

echo "🔄 Executando migrations..."

# Inicializar o diretório de migrations (apenas na primeira vez)
if [ ! -d "migrations" ]; then
    echo "📁 Inicializando diretório de migrations..."
    flask db init
fi

# Gerar nova migration baseada nos modelos
echo "📝 Gerando migration..."
flask db migrate -m "Initial migration with User, Employee and Document tables"

# Aplicar migrations ao banco
echo "⬆️  Aplicando migrations ao banco..."
flask db upgrade

echo "✅ Migrations concluídas!"

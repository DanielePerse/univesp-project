#!/bin/bash
# Script de inicialização que executa migrations antes de iniciar a aplicação

echo "🚀 Iniciando aplicação..."

# Aguardar o banco estar disponível
echo "⏳ Aguardando banco de dados..."
while ! nc -z db 5432; do
  sleep 1
done
echo "✅ Banco de dados disponível!"

# Executar migrations
echo "🔄 Executando migrations..."

# Inicializar migrations se não existir
if [ ! -d "migrations" ]; then
    echo "📁 Inicializando migrations..."
    flask db init
fi

# Gerar e aplicar migrations
echo "📝 Gerando migrations..."
flask db migrate -m "Auto migration" || echo "⚠️  Nenhuma mudança detectada"

echo "⬆️  Aplicando migrations..."
flask db upgrade

echo "✅ Migrations concluídas!"

# Iniciar aplicação
echo "🌟 Iniciando servidor Flask..."
exec python run.py

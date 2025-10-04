# Univesp Project

Sistema de gerenciamento de funcionários e documentos desenvolvido com Flask e PostgreSQL.

## 🚀 Executando com Docker (Recomendado)

### Pré-requisitos
- Docker
- Docker Compose

### Iniciar aplicação
```bash
# Clonar o repositório
git clone <repository-url>
cd univesp-project

# Subir aplicação e banco de dados
docker-compose up --build

# Ou executar em background
docker-compose up -d --build
```

### Acessar aplicação
- **Frontend/API**: http://localhost:5000
- **Banco PostgreSQL**: localhost:5432
  - Database: `univesp`
  - Username: `postgres`
  - Password: `postgres`

### Parar aplicação
```bash
# Parar containers
docker-compose down

# Parar e remover volumes (limpa banco)
docker-compose down -v
```

## 🔧 Desenvolvimento Local (Sem Docker)

### Pré-requisitos
- Python 3.12+
- PostgreSQL

### Configuração
```bash
# Instalar dependências
pip3 install -r requirements.txt

# Configurar variáveis de ambiente
export FLASK_APP=run.py
export FLASK_ENV=development
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/univesp

# Executar migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Subir backend
flask run
```

### Frontend
```bash
# Entrar na pasta frontend
cd app/frontend

# Subir servidor estático
python3 -m http.server 8000
```

## 📊 Banco de Dados

### Modelos
- **User**: Usuários do sistema (autenticação)
- **Employee**: Funcionários da empresa
- **Document**: Documentos dos funcionários

### Migrations
As migrations são executadas automaticamente no Docker. Para desenvolvimento local:

```bash
# Gerar nova migration
flask db migrate -m "Descrição da mudança"

# Aplicar migrations
flask db upgrade

# Reverter migration
flask db downgrade
```

### Scripts úteis
```bash
# Resetar banco de dados
docker-compose exec app python manage.py reset-db

# Inserir dados de exemplo
docker-compose exec app python manage.py seed-db

# Executar migrations manualmente (se necessário)
docker-compose run --rm app flask db upgrade

# Verificar status das migrations
docker-compose run --rm app flask db current

# Listar tabelas no banco
docker-compose exec db psql -U postgres -d univesp -c "\dt"
```

## 🛠️ Estrutura do Projeto

```
univesp-project/
├── app/
│   ├── controllers/     # Controladores da API
│   ├── models/         # Modelos do banco de dados
│   ├── services/       # Lógica de negócio
│   ├── utils/          # Utilitários (auth, etc)
│   └── frontend/       # Arquivos estáticos
├── migrations/         # Migrations do banco
├── config.py          # Configurações da aplicação
├── docker-compose.yaml # Orquestração dos containers
├── Dockerfile.yaml    # Imagem da aplicação
├── requirements.txt   # Dependências Python
└── run.py            # Ponto de entrada da aplicação
```

## 🔍 Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se containers estão rodando
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar apenas o banco
docker-compose restart db
```

### Problemas com migrations
```bash
# Limpar e recriar migrations
docker-compose down -v
docker-compose up --build
```

### Tabelas não aparecem no DBeaver
Se você executou apenas `docker-compose up db` e as tabelas não aparecem:

```bash
# Opção 1: Executar migrations manualmente
docker-compose run --rm app flask db upgrade

# Opção 2: Subir aplicação completa (recomendado)
docker-compose up --build
```

**Verificar tabelas criadas:**
```bash
# Listar tabelas no banco
docker-compose exec db psql -U postgres -d univesp -c "\dt"
```

**No DBeaver:**
- Pressione F5 para refresh
- Expanda o schema `public`
- Verifique se está conectado no database `univesp`

**Tabelas esperadas:**
- `users` - Usuários do sistema
- `employees` - Funcionários da empresa  
- `documents` - Documentos dos funcionários
- `alembic_version` - Controle de migrations

## 🌐 Acesso ao Frontend

Após subir a aplicação, acesse:
- **API/Backend**: http://localhost:5000
- **Frontend**: http://localhost:8000/login.html (se rodando servidor estático separado)
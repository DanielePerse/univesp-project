# iVenceu - Sistema de Controle de Documentos SST

Sistema web para gerenciamento de funcionários e controle de vencimentos de documentos de Segurança e Saúde no Trabalho.
Desenvolvido como projeto integrador da Universidade Virtual do Estado de São Paulo (UNIVESP).

## 📋 Pré-requisitos

- **Python 3.12+** - [Download aqui](https://www.python.org/downloads/)
- **Docker & Docker Compose** - [Instalar Docker](https://docs.docker.com/get-docker/)
- **Git** - Para clonar o repositório
- **DBeaver** (opcional) - [Interface gráfica para banco de dados](https://dbeaver.io/download/)

## ⚡ Início Rápido

### 🐳 Opção 1: Docker (Recomendado)

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd univesp-project

# 2. Subir aplicação completa
docker-compose up --build

# 3. Acessar aplicação
# Frontend: http://localhost:5000
# Banco: localhost:5432
```

A aplicação estará disponível em **http://localhost:5000** com hot-reload ativado.

### 🐍 Opção 2: Desenvolvimento Local

#### 1. Preparar Ambiente Python
```bash
# Criar e ativar ambiente virtual
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Instalar dependências
pip install -r requirements.txt
```

#### 2. Configurar Banco PostgreSQL
```bash
# Opção A: Usar apenas o banco do Docker
docker-compose up db -d

# Opção B: PostgreSQL local (se instalado)
# Criar banco: createdb univesp
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/univesp
```

#### 3. Executar Migrations
```bash
# Definir variáveis de ambiente
export FLASK_APP=run.py
export FLASK_ENV=development

# Inicializar banco (primeira vez)
python manage.py init-db

# OU usar migrations (recomendado)
flask db init     # apenas primeira vez
flask db migrate -m "Initial migration"
flask db upgrade
```

#### 4. Iniciar Aplicação
```bash
# Iniciar servidor de desenvolvimento
python run.py

# Aplicação disponível em: http://localhost:5000
```

## 🎯 Funcionalidades

- ✅ **Login/Autenticação** - Sistema de usuários com JWT
- ✅ **Cadastro de Funcionários** - CPF, nome, empresa
- ✅ **Gestão de Documentos** - Nome, data de vencimento
- ✅ **Consulta e Listagem** - Visualização de todos os funcionários
- ✅ **Edição/Atualização** - Modificar dados e documentos
- ✅ **Validação de CPF** - Verificação antes do cadastro
- ✅ **Status de Vencimento** - Controle visual de documentos vencidos

## 🛠️ Stack Tecnológico

### Backend
- **Flask 2.2.1** - Framework web Python
- **SQLAlchemy 2.0.40** - ORM para banco de dados
- **Flask-Migrate 4.0.4** - Gerenciamento de migrations
- **Flask-CORS 5.0.1** - Suporte a CORS
- **PyJWT 2.10.1** - Autenticação JWT

### Frontend
- **HTML5/CSS3** - Interface web responsiva
- **JavaScript** - Interatividade do frontend
- **Bootstrap** (se aplicável) - Framework CSS

### Banco de Dados
- **PostgreSQL 13** - Banco principal
- **psycopg2-binary 2.9.10** - Driver PostgreSQL

### DevOps
- **Docker & Docker Compose** - Containerização
- **Gunicorn 21.2.0** - Servidor WSGI para produção

## 🗄️ Banco de Dados

### Conexão via DBeaver
```
Host: localhost
Porta: 5432
Database: univesp
Username: postgres
Password: postgres
```

### Estrutura das Tabelas
- **`users`** - Usuários do sistema (email, senha hash)
- **`employees`** - Funcionários (CPF, nome, empresa)
- **`documents`** - Documentos SST (nome, data vencimento, funcionário)
- **`alembic_version`** - Controle de migrations

### Comandos SQL Úteis
```sql
-- Ver todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d employees

-- Contar registros
SELECT COUNT(*) FROM employees;
```

## 🧪 Testes e Desenvolvimento

```bash
# Executar testes (se disponível)
python -m unittest discover tests -v

# Modo debug com hot-reload
export FLASK_ENV=development
python run.py

# Verificar logs da aplicação
docker-compose logs -f app

# Verificar logs do banco
docker-compose logs -f db
```

## 📝 Comandos Úteis

### Docker
```bash
# Subir apenas o banco
docker-compose up db -d

# Rebuild completo
docker-compose up --build --force-recreate

# Parar todos os serviços
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Acessar container da aplicação
docker-compose exec app bash

# Acessar PostgreSQL diretamente
docker-compose exec db psql -U postgres -d univesp
```

### Gerenciamento do Banco
```bash
# Resetar banco (apaga todos os dados)
python manage.py reset-db

# Popular com dados de exemplo
python manage.py seed-db

# Ver status das migrations
flask db current

# Criar nova migration
flask db migrate -m "Descrição da mudança"

# Aplicar migrations pendentes
flask db upgrade
```

### Desenvolvimento
```bash
# Instalar nova dependência
pip install nome-do-pacote
pip freeze > requirements.txt

# Verificar estrutura do projeto
tree -I '__pycache__|*.pyc|.git'

# Verificar portas em uso
netstat -tulpn | grep :5000
```

## 🚨 Troubleshooting

### Problemas Comuns

**Erro de conexão com banco:**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps

# Reiniciar apenas o banco
docker-compose restart db
```

**Erro de migrations:**
```bash
# Limpar migrations e recriar
rm -rf migrations/
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

**Porta 5000 ocupada:**
```bash
# Encontrar processo usando a porta
lsof -i :5000

# Matar processo (substitua PID)
kill -9 <PID>
```

**Problemas de permissão:**
```bash
# Dar permissão aos scripts
chmod +x entrypoint.sh migrate.sh
```

## 📚 Estrutura do Projeto

```
univesp-project/
├── app/
│   ├── controllers/     # Controladores (lógica de negócio)
│   ├── models/         # Modelos do banco de dados
│   ├── services/       # Serviços auxiliares
│   ├── frontend/       # Arquivos HTML/CSS/JS
│   └── __init__.py     # Factory da aplicação
├── migrations/         # Migrations do banco
├── docker-compose.yaml # Configuração Docker
├── requirements.txt    # Dependências Python
├── config.py          # Configurações da aplicação
├── manage.py          # Scripts de gerenciamento
└── run.py            # Ponto de entrada da aplicação
```

---
**Desenvolvido por**: Grupo 005_Sala 002 - Disciplina PJI240 2025
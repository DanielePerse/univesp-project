# iVenceu - Sistema de Controle de Documentos SST

Sistema web para gerenciamento de funcionários e controle de vencimentos de documentos de Segurança e Saúde no Trabalho.

## 📋 Pré-requisitos

- **Python 3.12+** - [Download aqui](https://www.python.org/downloads/)
- **Docker & Docker Compose** - [Instalar Docker](https://docs.docker.com/get-docker/)
- **DBeaver** (opcional) - [Interface gráfica para uso do banco de dados](https://dbeaver.io/download/)

## ⚡ Início Rápido

### 🐳 Com Docker (Recomendado)
```bash
# Já dentro da pasta do projeto
docker-compose up --build
```
**Acesse**: http://localhost:5000

### 🐍 Desenvolvimento Local

#### 1. Preparar Ambiente Python
```bash
# Criar ambiente virtual
python3 -m venv .venv

# Ativar ambiente virtual
source .venv/bin/activate  # Linux/Mac
# ou
.venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt
```

#### 2. Configurar Banco PostgreSQL
```bash
# Subir apenas o banco via Docker
docker-compose up db -d

# Ou configurar PostgreSQL local
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/univesp
```

#### 3. Executar Migrations e Subir Backend
```bash
flask db upgrade
python run.py
```
**Backend rodando em**: http://localhost:5000

#### 4. Acessar Frontend
O frontend está integrado ao backend. Acesse diretamente:
**http://localhost:5000** (página de login)

## 🎯 Funcionalidades

- ✅ **Login/Autenticação** - Sistema de usuários com JWT
- ✅ **Cadastro de Funcionários** - CPF, nome, empresa
- ✅ **Gestão de Documentos** - Nome, data de vencimento
- ✅ **Consulta e Listagem** - Visualização de todos os funcionários
- ✅ **Edição/Atualização** - Modificar dados e documentos
- ✅ **Validação de CPF** - Verificação antes do cadastro
- ✅ **Status de Vencimento** - Controle visual de documentos vencidos

## 🏗️ Arquitetura

```
app/
├── controllers/    # Lógica de negócio (API endpoints)
├── models/        # Modelos do banco (User, Employee, Document)
├── services/      # Serviços de negócio
├── templates/     # Templates HTML (Frontend)
├── static/        # CSS, JS, imagens
└── utils/         # Utilitários (autenticação, etc)
```

## 🛠️ Tecnologias

- **Backend**: Flask, SQLAlchemy, Flask-Migrate
- **Frontend**: HTML, CSS, JavaScript
- **Banco de Dados**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)
- **Deploy**: Docker, Docker Compose

## 🗄️ Acessar Banco de Dados (DBeaver)

### Configuração de Conexão:
- **Host**: localhost
- **Porta**: 5432
- **Database**: univesp
- **Username**: postgres
- **Password**: postgres

### Tabelas do Sistema:
- `users` - Usuários do sistema
- `employees` - Funcionários cadastrados
- `documents` - Documentos dos funcionários

## 🧪 Executar Testes

### Executar todos os testes:
```bash
python -m unittest discover tests -v
```

### Executar testes específicos:
```bash
python tests/test_models.py     # Testes básicos (CPF, senha, UUID, datas)
python tests/test_services.py   # Testes de lógica de negócio
python tests/test_utils.py      # Testes utilitários (JWT, paginação, etc)
```

### Estrutura de Testes:
```
tests/
├── test_models.py      # Funções básicas e validações
├── test_services.py    # Lógica de negócio sem banco
├── test_utils.py       # Utilitários e helpers
└── __init__.py         # Inicialização
```

**Cobertura**: 14 testes unitários sem dependências externas.

## 📝 Scripts Úteis

```bash
# Resetar banco
docker-compose exec app python manage.py reset-db

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down

# Ver tabelas criadas
docker-compose exec db psql -U postgres -d univesp -c "\dt"
```

---
**Desenvolvido por**: Grupo 005 (Sala 002 - Disciplina PJI240 - UNIVESP - Projeto Integrador II 2025) 
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
git clone git@github.com:DanielePerse/univesp-project.git
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
git clone git@github.com:DanielePerse/univesp-project.git
cd univesp-project

python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

# Instalar dependências
pip install -r requirements.txt
```

#### 2. Configurar Banco PostgreSQL
```bash
# Opção A: Usar apenas o banco do Docker
docker-compose up -d db

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
- ✅ **Cadastro de Funcionários** - CPF, nome, empresa e endereço completo
- ✅ **Integração com API ViaCEP** - Busca automática de endereços por CEP
- ✅ **Gestão de Documentos** - Nome, data de vencimento
- ✅ **Consulta e Listagem** - Visualização ordenada alfabeticamente
- ✅ **Edição/Atualização** - Modificar dados, documentos e endereços
- ✅ **Validação de CPF** - Verificação antes do cadastro
- ✅ **Status de Vencimento** - Controle visual de documentos vencidos
- ✅ **Acessibilidade** - Validação por campo (mensagens inline), foco visível, contraste de cores e navegação por teclado
- ✅ **Scripts JavaScript** - Interatividade modular (máscara de CPF/CEP, ViaCEP, validações e modais)
- ✅ **Testes** - Suporte a execução com `unittest`

## ♿ Acessibilidade

### O que foi implementado
- **Formulários acessíveis**: `aria-invalid`, `aria-describedby`, mensagens inline por campo e foco no primeiro erro (`login`, `cadastro_usuario`, `cadastro`, `detalhes`).
- **Modais acessíveis**: `role="dialog"`, `aria-modal`, foco gerenciado, trap de foco com Tab/Shift+Tab e fechamento por `Esc` (`cadastro`, `detalhes`).
- **Navegação por teclado**: elementos com `role="button"` respondem a `Enter`/`Space`.
- **Feedbacks dinâmicos**: áreas com `role="status"`/`aria-live` para CEP/CPF e mensagens gerais.
- **Máscaras**: CPF com máscara imediata no cadastro/edição; CEP com máscara e busca ViaCEP.
- **Contraste e foco visível**: reforço de `:focus-visible`, cores de botões e links ajustadas (WCAG AA).
- **Tabela acessível**: cabeçalho com `scope="col"` e cabeçalho fixo ao rolar em `consulta`.

## 🛠️ Stack Tecnológico

### Backend
- **Flask 2.2.1** - Framework web Python
- **SQLAlchemy 2.0.40** - ORM para banco de dados
- **Flask-Migrate 4.0.4** - Gerenciamento de migrations
- **Flask-CORS 5.0.1** - Suporte a CORS
- **PyJWT 2.10.1** - Autenticação JWT

### Frontend
- **HTML5/CSS3** - Interface web responsiva
- **JavaScript ES6+** - Interatividade e funcionalidades dinâmicas
- **Arquitetura modular** - Scripts organizados por funcionalidade

### APIs Externas
- **ViaCEP** - Webservice CEP e IBGE gratuito para busca de endereços

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
- **`employees`** - Funcionários (CPF, nome, empresa, endereço JSON)
- **`documents`** - Documentos SST (nome, data vencimento, funcionário)
- **`alembic_version`** - Controle de migrations

## 📍 Integração ViaCEP
O sistema integra com a **API ViaCEP** para busca automática de endereços:

### Páginas com ViaCEP
- **Cadastro de funcionários** - `/cadastro`
- **Edição de funcionários** - `/detalhes/{id}`

### API Utilizada
- **Endpoint**: `https://viacep.com.br/ws/{cep}/json/`
- **Método**: GET
- **Gratuita**: Sem necessidade de API Key
- **Documentação**: [viacep.com.br](https://viacep.com.br/)

## 🧪 Testes e Desenvolvimento

```bash
# Executar todos os testes
python -m unittest discover tests -v
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

---
**Desenvolvido por**: Grupo 005_Sala 002 - Disciplina PJI240 2025
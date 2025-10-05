#!/usr/bin/env python3
"""
Script de gerenciamento da aplicação Flask
Usado para executar migrations e outras tarefas administrativas
"""

import os
from flask.cli import FlaskGroup
from app import create_app, db
from app.models.user import User
from app.models.employee import Employee
from app.models.document import Document

app = create_app()
cli = FlaskGroup(app)

@cli.command("init-db")
def init_db():
    """Inicializa o banco de dados criando todas as tabelas"""
    db.create_all()
    print("✅ Banco de dados inicializado!")

@cli.command("reset-db")
def reset_db():
    """Remove e recria todas as tabelas"""
    db.drop_all()
    db.create_all()
    print("✅ Banco de dados resetado!")

@cli.command("seed-db")
def seed_db():
    """Popula o banco com dados de exemplo"""
    # Criar usuário de exemplo
    user = User(email="admin@example.com")
    user.set_password("admin123")
    db.session.add(user)
    
    # Criar funcionário de exemplo
    employee = Employee(
        cpf="123.456.789-00",
        employee_name="João Silva",
        company_name="Empresa Exemplo"
    )
    db.session.add(employee)
    
    db.session.commit()
    print("✅ Dados de exemplo inseridos!")

if __name__ == '__main__':
    cli()

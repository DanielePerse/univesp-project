#!/usr/bin/env python3
"""
Script para inicializar o banco de dados no Render
Este script deve ser executado como um comando de build no Render
"""

import os
import sys
from flask import Flask
from flask_migrate import upgrade
from app import create_app, db

def init_database():
    """Inicializa o banco de dados com as migrations"""
    app = create_app()
    
    with app.app_context():
        try:
            # Executar migrations
            print("Executando migrations...")
            upgrade()
            print("Migrations executadas com sucesso!")
            
            # Verificar se as tabelas foram criadas
            from app.models.user import User
            from app.models.employee import Employee
            from app.models.document import Document
            
            # Testar se consegue fazer uma query simples
            user_count = User.query.count()
            print(f"Tabela users criada. Total de usuários: {user_count}")
            
            employee_count = Employee.query.count()
            print(f"Tabela employees criada. Total de funcionários: {employee_count}")
            
            document_count = Document.query.count()
            print(f"Tabela documents criada. Total de documentos: {document_count}")
            
            print("Banco de dados inicializado com sucesso!")
            return True
            
        except Exception as e:
            print(f"Erro ao inicializar banco de dados: {str(e)}")
            return False

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)

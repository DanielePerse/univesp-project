#!/usr/bin/env python3
"""
Script para inicializar o banco de dados
Cria todas as tabelas definidas nos modelos SQLAlchemy
"""

from app import create_app, db
from app.models.user import User
from app.models.employee import Employee
from app.models.document import Document

def init_database():
    """Inicializa o banco de dados criando todas as tabelas"""
    app = create_app()
    
    with app.app_context():
        print("Criando tabelas do banco de dados...")
        
        # Cria todas as tabelas
        db.create_all()
        
        print("✅ Tabelas criadas com sucesso!")
        
        # Verifica se as tabelas foram criadas
        tables = db.engine.table_names()
        print(f"📋 Tabelas disponíveis: {tables}")

if __name__ == '__main__':
    init_database()

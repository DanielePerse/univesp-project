#!/usr/bin/env python3
"""
Script para inicializar o banco de dados no Render
Este script deve ser executado como um comando de release no Render
"""

import os
import sys
from flask_migrate import upgrade, init, migrate as flask_migrate
from sqlalchemy import text, inspect

def init_database():
    """Inicializa o banco de dados com as migrations"""
    print("=== INICIANDO SETUP DO BANCO DE DADOS ===")
    
    try:
        # Importar depois para evitar problemas de inicialização
        from app import create_app, db
        
        print("✅ Criando aplicação Flask...")
        app = create_app()
        
        with app.app_context():
            print("✅ Verificando conexão com banco...")
            
            # Testar conexão básica
            try:
                result = db.session.execute(text('SELECT version()'))
                version = result.fetchone()[0]
                print(f"✅ PostgreSQL conectado: {version[:50]}...")
            except Exception as e:
                print(f"❌ Erro de conexão: {e}")
                return False
            
            # Verificar se migrations já existem
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"📋 Tabelas existentes: {existing_tables}")
            
            # Verificar se diretório migrations existe
            if not os.path.exists('migrations'):
                print("⚠️  Diretório migrations não encontrado. Inicializando...")
                try:
                    init()
                    print("✅ Migrations inicializadas!")
                except Exception as e:
                    print(f"❌ Erro ao inicializar migrations: {e}")
            
            # Executar migrations
            print("🔄 Executando migrations...")
            try:
                upgrade()
                print("✅ Migrations executadas com sucesso!")
            except Exception as e:
                print(f"⚠️  Erro nas migrations: {e}")
                print("🔄 Tentando criar migrations automaticamente...")
                try:
                    flask_migrate(message='Auto migration for Render')
                    upgrade()
                    print("✅ Migrations criadas e executadas!")
                except Exception as e2:
                    print(f"❌ Erro crítico nas migrations: {e2}")
                    # Criar tabelas manualmente como fallback
                    print("🆘 Criando tabelas manualmente...")
                    db.create_all()
                    print("✅ Tabelas criadas manualmente!")
            
            # Verificar tabelas após migrations
            inspector = inspect(db.engine)
            final_tables = inspector.get_table_names()
            print(f"📋 Tabelas após migrations: {final_tables}")
            
            # Verificar se as tabelas principais existem
            required_tables = ['users', 'employees', 'documents']
            missing_tables = [table for table in required_tables if table not in final_tables]
            
            if missing_tables:
                print(f"⚠️  Tabelas faltando: {missing_tables}")
                print("🔄 Criando tabelas faltantes...")
                db.create_all()
                
                # Verificar novamente
                inspector = inspect(db.engine)
                final_tables = inspector.get_table_names()
                print(f"📋 Tabelas finais: {final_tables}")
            
            # Testar queries nas tabelas
            try:
                from app.models.user import User
                from app.models.employee import Employee  
                from app.models.document import Document
                
                user_count = User.query.count()
                print(f"✅ Tabela 'users' OK - Total: {user_count} usuários")
                
                employee_count = Employee.query.count()
                print(f"✅ Tabela 'employees' OK - Total: {employee_count} funcionários")
                
                document_count = Document.query.count()
                print(f"✅ Tabela 'documents' OK - Total: {document_count} documentos")
                
            except Exception as e:
                print(f"❌ Erro ao testar tabelas: {e}")
                return False
            
            print("🎉 Banco de dados configurado com sucesso!")
            return True
            
    except Exception as e:
        print(f"❌ Erro crítico: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("🚀 Iniciando configuração do banco de dados...")
    success = init_database()
    
    if success:
        print("✅ Configuração concluída com sucesso!")
        sys.exit(0)
    else:
        print("❌ Falha na configuração!")
        sys.exit(1)

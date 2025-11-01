from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
import logging
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(Config)
    
    # Configurar logging
    log_level = getattr(logging, app.config.get('LOG_LEVEL', 'INFO'))
    logging.basicConfig(level=log_level)
    app.logger.setLevel(log_level)
    
    # Log da configuração do banco
    app.logger.info(f'Conectando ao banco: {app.config["SQLALCHEMY_DATABASE_URI"][:50]}...')
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Configurar CORS para permitir requisições do frontend
    CORS(app, origins=['*'])

    # Importar modelos para que o Flask-Migrate os reconheça
    from app.models import user, employee, document

    from app.routes import bp
    app.register_blueprint(bp)
    
    # Verificar conexão e criar tabelas se necessário
    with app.app_context():
        try:
            from sqlalchemy import text, inspect
            
            # Testar conexão
            db.session.execute(text('SELECT 1'))
            app.logger.info('Conexão com banco de dados estabelecida com sucesso')
            
            # Verificar se tabelas existem
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            app.logger.info(f'Tabelas existentes: {existing_tables}')
            
            # Verificar se todas as tabelas necessárias existem
            required_tables = ['users', 'employees', 'documents']
            missing_tables = [table for table in required_tables if table not in existing_tables]
            
            if missing_tables:
                app.logger.warning(f'Tabelas faltando: {missing_tables}. Criando todas as tabelas...')
                
                # Tentar executar migrations primeiro
                try:
                    from flask_migrate import upgrade
                    upgrade()
                    app.logger.info('✅ Migrations executadas - todas as tabelas criadas!')
                except Exception as migrate_error:
                    app.logger.warning(f'Erro nas migrations: {migrate_error}')
                    app.logger.info('Criando todas as tabelas manualmente...')
                    
                    # Fallback: criar tabelas manualmente
                    db.create_all()
                    app.logger.info('✅ Todas as tabelas criadas manualmente!')
                
                # Verificar novamente todas as tabelas
                inspector = inspect(db.engine)
                final_tables = inspector.get_table_names()
                app.logger.info(f'Tabelas após criação: {final_tables}')
                
                # Verificar cada tabela individualmente
                for table in required_tables:
                    if table in final_tables:
                        app.logger.info(f'✅ Tabela {table} criada com sucesso!')
                    else:
                        app.logger.error(f'❌ Falha ao criar tabela {table}!')
            else:
                app.logger.info(f'✅ Todas as tabelas já existem: {required_tables}')
                
        except Exception as e:
            app.logger.error(f'Erro ao conectar com banco de dados: {str(e)}')

    return app

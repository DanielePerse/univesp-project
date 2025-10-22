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
    
    # Verificar conexão com banco de dados
    with app.app_context():
        try:
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            app.logger.info('Conexão com banco de dados estabelecida com sucesso')
        except Exception as e:
            app.logger.error(f'Erro ao conectar com banco de dados: {str(e)}')

    return app

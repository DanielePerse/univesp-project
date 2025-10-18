from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    """
    Factory function para criar e configurar a aplicação Flask.
    
    Returns:
        Flask: Instância configurada da aplicação Flask
    """
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    # Importar modelos para que o Flask-Migrate os reconheça
    from app.models import user, employee, document  # noqa: F401

    from app.routes import bp
    app.register_blueprint(bp)

    return app

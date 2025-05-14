from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, template_folder='frontend', static_folder='frontend')
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)

    from app.routes import bp
    app.register_blueprint(bp)

    return app

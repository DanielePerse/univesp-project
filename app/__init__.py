from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    with app.app_context():
        from app.routes import user_routes, employee_routes, document_routes
        app.register_blueprint(user_routes.bp)
        app.register_blueprint(employee_routes.bp)
        app.register_blueprint(document_routes.bp)

        db.create_all()

    return app

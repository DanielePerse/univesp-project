from flask import request, jsonify
import jwt
from datetime import datetime, timedelta

# Imports relativos para resolver problemas de importação
try:
    from ..models.user import User
    from .. import db
    from ...config import Config
except ImportError:
    # Fallback para imports absolutos
    import sys
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    sys.path.append(base_dir)
    from app.models.user import User
    from app import db
    from config import Config


def register():
    """
    Registra um novo usuário no sistema.
    
    Returns:
        JSON: Mensagem de sucesso ou erro com status HTTP correspondente
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


def login():
    """
    Autentica um usuário e retorna um token JWT.
    
    Returns:
        JSON: Token de autenticação ou mensagem de erro com status HTTP
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    payload = {
        'user_id': str(user.id),
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token}), 200

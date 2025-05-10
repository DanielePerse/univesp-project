from flask import request, jsonify
from app.models.user import User
from app import db
import jwt
from datetime import datetime, timedelta
from config import Config

def register():
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

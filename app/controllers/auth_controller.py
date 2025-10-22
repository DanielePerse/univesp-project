from flask import request, jsonify, current_app
from app.models.user import User
from app import db
import jwt
from datetime import datetime, timedelta
from config import Config
import logging

def register():
    try:
        # Validar se o request tem JSON
        if not request.is_json:
            return jsonify({'message': 'Content-Type deve ser application/json'}), 400
        
        data = request.get_json()
        
        # Validar se os dados foram enviados
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
            
        email = data.get('email')
        password = data.get('password')

        # Validar campos obrigatórios
        if not email or not password:
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400

        # Validar formato do email
        if '@' not in email or '.' not in email:
            return jsonify({'message': 'Formato de email inválido'}), 400

        # Validar tamanho da senha
        if len(password) < 6:
            return jsonify({'message': 'Senha deve ter pelo menos 6 caracteres'}), 400

        # Verificar se usuário já existe
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'Usuário já existe com este email'}), 400

        # Criar novo usuário
        user = User(email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        current_app.logger.info(f'Usuário criado com sucesso: {email}')
        return jsonify({'message': 'Usuário criado com sucesso'}), 201

    except Exception as e:
        # Rollback em caso de erro
        db.session.rollback()
        
        # Log do erro
        current_app.logger.error(f'Erro ao criar usuário: {str(e)}')
        
        # Retornar erro genérico para o cliente
        return jsonify({'message': 'Erro interno do servidor'}), 500


def login():
    try:
        # Validar se o request tem JSON
        if not request.is_json:
            return jsonify({'message': 'Content-Type deve ser application/json'}), 400
        
        data = request.get_json()
        
        # Validar se os dados foram enviados
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
            
        email = data.get('email')
        password = data.get('password')

        # Validar campos obrigatórios
        if not email or not password:
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({'message': 'Credenciais inválidas'}), 401

        payload = {
            'user_id': str(user.id),
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

        current_app.logger.info(f'Login realizado com sucesso: {email}')
        return jsonify({'token': token}), 200

    except Exception as e:
        current_app.logger.error(f'Erro no login: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500

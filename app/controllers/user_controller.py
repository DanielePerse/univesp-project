from flask import request, jsonify
from app import db
from app.services.user_service import create_user, authenticate_user

def register_user():
    data = request.get_json()
    user, error = create_user(data['email'], data['password'])

    if error:
        return jsonify({'message': error}), 400

    return jsonify({'message': 'User registered successfully'}), 201

def login_user():
    data = request.get_json()
    user, error = authenticate_user(data['email'], data['password'])

    if error:
        return jsonify({'message': error}), 401

    return jsonify({
        'message': 'Login successful',
        'userId': user.id
    }), 200

from functools import wraps
from flask import request, jsonify
import jwt
from config import Config
from uuid import UUID

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            request.user_id = UUID(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid or expired'}), 401

        return f(*args, **kwargs)

    return decorated

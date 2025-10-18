from functools import wraps
from flask import request, jsonify
import jwt
from config import Config
from uuid import UUID


def token_required(f):
    """
    Decorator para proteger rotas que requerem autenticação JWT.
    
    Args:
        f (function): Função da rota a ser protegida
        
    Returns:
        function: Função decorada que verifica a presença e validade do token
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        """
        Função interna que realiza a validação do token.
        
        Returns:
            Response: Resposta da função original se token válido,
                     erro 401 se token inválido ou ausente
        """
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            request.user_id = UUID(data['user_id'])
        except (jwt.InvalidTokenError, ValueError, KeyError):
            return jsonify({'message': 'Token is invalid or expired'}), 401

        return f(*args, **kwargs)

    return decorated

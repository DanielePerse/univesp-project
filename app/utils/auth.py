from functools import wraps
from flask import request, jsonify, current_app
import jwt
from config import Config
from uuid import UUID

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token = None
            auth_header = request.headers.get('Authorization')
            
            current_app.logger.info(f'Verificando autenticação para {request.endpoint}')
            current_app.logger.debug(f'Authorization header: {auth_header[:20] if auth_header else "None"}...')

            if auth_header:
                try:
                    # Formato esperado: "Bearer <token>"
                    parts = auth_header.split(" ")
                    if len(parts) == 2 and parts[0] == "Bearer":
                        token = parts[1]
                    else:
                        current_app.logger.warning(f'Formato de Authorization header inválido: {auth_header[:50]}')
                        return jsonify({'message': 'Formato de token inválido. Use: Bearer <token>'}), 401
                except Exception as e:
                    current_app.logger.error(f'Erro ao processar Authorization header: {str(e)}')
                    return jsonify({'message': 'Erro ao processar token'}), 401

            if not token:
                current_app.logger.warning('Token não fornecido')
                return jsonify({'message': 'Token de acesso obrigatório'}), 401

            try:
                # Decodificar token
                data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
                user_id = data.get('user_id')
                
                if not user_id:
                    current_app.logger.warning('Token não contém user_id')
                    return jsonify({'message': 'Token inválido: dados incompletos'}), 401
                
                # Validar UUID
                request.user_id = UUID(user_id)
                current_app.logger.info(f'Token válido para usuário: {user_id}')
                
            except jwt.ExpiredSignatureError:
                current_app.logger.warning('Token expirado')
                return jsonify({'message': 'Token expirado. Faça login novamente'}), 401
            except jwt.InvalidTokenError as e:
                current_app.logger.warning(f'Token inválido: {str(e)}')
                return jsonify({'message': 'Token inválido'}), 401
            except ValueError as e:
                current_app.logger.warning(f'UUID inválido no token: {str(e)}')
                return jsonify({'message': 'Token contém dados inválidos'}), 401
            except Exception as e:
                current_app.logger.error(f'Erro inesperado na validação do token: {str(e)}')
                return jsonify({'message': 'Erro interno na autenticação'}), 500

            return f(*args, **kwargs)
            
        except Exception as e:
            current_app.logger.error(f'Erro crítico no @token_required: {str(e)}')
            return jsonify({'message': 'Erro interno do servidor'}), 500

    return decorated

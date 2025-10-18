import uuid
from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    """
    Modelo para representar usuários do sistema.
    
    Attributes:
        id (str): Identificador único do usuário (UUID)
        email (str): Email único do usuário
        password_hash (str): Hash da senha do usuário
        created_at (datetime): Data/hora de criação do usuário
    """
    __tablename__ = 'users'

    id = db.Column(
        db.String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        """
        Define a senha do usuário usando hash seguro.
        
        Args:
            password (str): Senha em texto plano
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Verifica se a senha fornecida corresponde ao hash armazenado.
        
        Args:
            password (str): Senha em texto plano para verificação
            
        Returns:
            bool: True se a senha está correta, False caso contrário
        """
        return check_password_hash(self.password_hash, password)

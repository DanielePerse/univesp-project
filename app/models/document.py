from datetime import datetime
import uuid
from app import db


class Document(db.Model):
    """
    Modelo para representar documentos dos funcionários.
    
    Attributes:
        id (str): Identificador único do documento (UUID)
        employee_id (str): ID do funcionário proprietário do documento
        name (str): Nome/tipo do documento
        expiration_date (date): Data de vencimento do documento
        created_at (datetime): Data/hora de criação
        updated_at (datetime): Data/hora da última atualização
    """
    __tablename__ = 'documents'

    id = db.Column(
        db.String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    employee_id = db.Column(
        db.String, db.ForeignKey('employees.id'), nullable=False
    )
    name = db.Column(db.String, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

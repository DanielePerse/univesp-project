from datetime import datetime
import uuid
from app import db
from sqlalchemy.dialects.postgresql import JSON


class Employee(db.Model):
    """
    Modelo para representar funcionários no sistema.
    
    Attributes:
        id (str): Identificador único do funcionário (UUID)
        cpf (str): CPF único do funcionário
        employee_name (str): Nome completo do funcionário
        company_name (str): Nome da empresa do funcionário
        address (JSON): Endereço estruturado em formato JSON
        endereco (str): Endereço em formato texto simples
        created_at (datetime): Data/hora de criação
        updated_at (datetime): Data/hora da última atualização
        documents (list): Lista de documentos relacionados
    """
    __tablename__ = 'employees'

    id = db.Column(
        db.String, primary_key=True, default=lambda: str(uuid.uuid4())
    )
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    employee_name = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    address = db.Column(JSON, nullable=True)
    endereco = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    documents = db.relationship('Document', backref='employee', lazy=True)

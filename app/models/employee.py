from datetime import datetime
import uuid
from app import db
from sqlalchemy.dialects.postgresql import JSON

class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    employee_name = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    address = db.Column(JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = db.relationship('Document', backref='employee', lazy=True)

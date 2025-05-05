from datetime import datetime
import uuid
from app import db

class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    employee_name = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    #userId = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = db.relationship('Document', backref='employee', lazy=True)

# app/models/employee.py
from app import db
import uuid
from datetime import datetime

class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    companyName = db.Column(db.String(255), nullable=False)
    employeeName = db.Column(db.String(255), nullable=False)
    userId = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = db.relationship('Document', backref='employee', lazy=True)

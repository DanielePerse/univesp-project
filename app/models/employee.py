from app import db
from datetime import datetime
import uuid

class Employee(db.Model):
    __tablename__ = 'employee'
    
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cpf = db.Column(db.String, unique=True, nullable=False)
    employeeName = db.Column(db.String, nullable=False)
    companyName = db.Column(db.String, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    documents = db.relationship('Document', backref='employee', lazy=True)

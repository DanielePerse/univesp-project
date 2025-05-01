from app import db
from datetime import datetime
import uuid

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employeeId = db.Column(db.String, db.ForeignKey('employee.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    expirationDate = db.Column(db.Date, nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

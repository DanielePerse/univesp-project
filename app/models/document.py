from datetime import datetime
import uuid
from app import db

class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    employee_id = db.Column(db.String, db.ForeignKey('employees.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    expiration_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

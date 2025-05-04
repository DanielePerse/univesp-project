from app.models.user import User
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

def create_user(email, password):
    if User.query.filter_by(email=email).first():
        return None, 'User already exists'

    hashed_password = generate_password_hash(password, method='sha256')
    user = User(email=email, password=hashed_password, createdAt=datetime.utcnow())
    db.session.add(user)
    db.session.commit()

    return user, None

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return None, 'Invalid credentials'
    return user, None

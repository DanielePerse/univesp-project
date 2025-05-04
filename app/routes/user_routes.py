from flask import Blueprint
from app.controllers.user_controller import register_user, login_user

bp = Blueprint('user_routes', __name__)

@bp.route('/auth/register', methods=['POST'])
def register():
    return register_user()

@bp.route('/auth/login', methods=['POST'])
def login():
    return login_user()

from flask import Blueprint
from app.controllers.employee_controller import create_employee, list_employees

bp = Blueprint('routes', __name__)

@bp.route('/employee/register_employee', methods=['POST'])
def register_employee():
    return create_employee()

@bp.route('/employee/list', methods=['GET'])
def list():
    return list_employees()
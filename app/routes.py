from flask import Blueprint
from app.controllers.employee_controller import create_employee, list_employees, check_employee_cpf

bp = Blueprint('routes', __name__)

@bp.route('/employee/register_employee', methods=['POST'])
def register_employee():
    return create_employee()

@bp.route('/employee/list', methods=['GET'])
def list():
    return list_employees()

@bp.route('/employee/check_register', methods=['GET'])
def checkRegister():
    return check_employee_cpf()

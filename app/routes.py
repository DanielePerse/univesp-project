from flask import Blueprint
from app.controllers.employee_controller import (
    create_employee,
    list_employees,
    check_employee_cpf,
    get_employee_detail_by_id,
    update_employee_data
)
from app.controllers.auth_controller import register, login
from app.utils.auth import token_required

bp = Blueprint('routes', __name__)

@bp.route('/employee/register_employee', methods=['POST'])
@token_required
def register_employee():
    return create_employee()

@bp.route('/employee/list', methods=['GET'])
@token_required
def list():
    return list_employees()

@bp.route('/employee/check_register', methods=['GET'])
@token_required
def checkRegister():
    return check_employee_cpf()

@bp.route('/employee/<id>', methods=['GET'])
@token_required
def registerDetail(id):
    return get_employee_detail_by_id(id)

@bp.route('/employee/<id>', methods=['PUT'])
@token_required
def registerUpdate(id):
    return update_employee_data(id)

@bp.route('/auth/register', methods=['POST'])
def registerUser():
    return register()

@bp.route('/auth/login', methods=['POST'])
def loginUser():
    return login()

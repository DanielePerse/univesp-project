from flask import Blueprint
from app.controllers.employee_controller import (
    create_employee,
    list_employees,
    check_employee_cpf,
    get_employee_detail_by_id
)

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

@bp.route('/employee/<id>', methods=['GET'])
def registerDetail(id):
    return get_employee_detail_by_id(id)

# @bp.route('/employee/<employee_id>', methods=['PUT'])
# def registerUpdate():
#     return update_employee_data()

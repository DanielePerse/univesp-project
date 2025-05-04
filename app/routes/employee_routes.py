from flask import Blueprint
from app.controllers.employee_controller import (
    check_employee_cpf,
    create_employee,
    get_employee_detail_by_id,
    update_employee_data
)

bp = Blueprint('employee_routes', __name__)

@bp.route('/employee/check_register', methods=['GET'])
def checkRegister():
    return check_employee_cpf()

@bp.route('/employee/register', methods=['POST'])
def register():
    return create_employee()

@bp.route('/employee/<employee_id>', methods=['GET'])
def registerDetail():
    return get_employee_detail_by_id()

@bp.route('/employee/<employee_id>', methods=['PUT'])
def registerUpdate():
    return update_employee_data()

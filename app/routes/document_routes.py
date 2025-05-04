from flask import Blueprint
from app.controllers.employee_controller import get_all_employees_with_status

bp = Blueprint('document_routes', __name__)

@bp.route('/employee/list', methods=['GET'])
def list():
    return get_all_employees_with_status()
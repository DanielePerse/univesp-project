from app.services.employee_service import list_employees_with_status
from flask import jsonify

def get_all_employees_with_status():
    employees = list_employees_with_status()
    return jsonify(employees), 200


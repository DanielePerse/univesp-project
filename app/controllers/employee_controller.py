from flask import request, jsonify
from app.services.employee_service import check_cpf_exists, create_employee_with_documents


def check_employee_cpf():
    data = request.get_json()
    cpf = data.get('cpf')

    if not cpf:
        return jsonify({'message': 'CPF is required'}), 400

    exists = check_cpf_exists(cpf)
    return jsonify({'exists': exists}), 200

def create_employee():
    data = request.get_json()

    cpf = data.get('cpf')
    company_name = data.get('companyName')
    employee_name = data.get('employeeName')
    user_id = data.get('userId')  # Quem está criando
    documents = data.get('documents', [])

    if not all([cpf, company_name, employee_name, user_id]):
        return jsonify({'message': 'Missing required fields'}), 400

    employee, error = create_employee_with_documents(cpf, company_name, employee_name, user_id, documents)

    if error:
        return jsonify({'message': error}), 400

    return jsonify({'message': 'Employee created successfully', 'employeeId': employee.id}), 201

from app.services.employee_service import get_employee_detail

def get_employee_detail_by_id(employee_id):
    employee_data, error = get_employee_detail(employee_id)

    if error:
        return jsonify({'message': error}), 404

    return jsonify(employee_data), 200

from flask import request
from app.services.employee_service import update_employee

def update_employee_data(employee_id):
    data = request.get_json()
    updated_employee, error = update_employee(employee_id, data)

    if error:
        return jsonify({'message': error}), 404

    return jsonify({'message': 'Employee updated successfully'}), 200

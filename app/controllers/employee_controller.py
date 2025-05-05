from flask import request, jsonify
from app.services.employee_service import (
    create_employee_with_documents,
    list_employees_with_document_status,
    check_cpf_exists
)

def create_employee():
    data = request.get_json()

    cpf = data.get('cpf')
    employee_name = data.get('employeeName')
    company_name = data.get('companyName')
    #user_id = data.get('userId')  # Quem está criando
    documents = data.get('documents', [])

    if not all([cpf, company_name, employee_name]):
        return jsonify({'message': 'Missing required fields'}, 400)
    
    employee, error = create_employee_with_documents(cpf, employee_name, company_name, documents)

    if error:
        return jsonify({'message': error}), 400
    
    return jsonify({'message': 'Employee created successfully', 'employeeId': employee.id}), 201

def list_employees():
    employees = list_employees_with_document_status()
    return jsonify(employees), 200

def check_employee_cpf():
    data = request.get_json()
    cpf = data.get('cpf')

    if not cpf:
        return jsonify({'message': 'CPF is required'}), 400

    if check_cpf_exists(cpf):
        return jsonify({'message': 'Employee already registered'}), 409
    else:
        return jsonify({'message': 'CPF is available'}), 200

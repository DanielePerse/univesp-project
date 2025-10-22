from flask import request, jsonify, current_app
from app.services.employee_service import (
    create_employee_with_documents,
    list_employees_with_document_status,
    check_cpf_exists,
    get_employee_detail,
    update_employee
)

def create_employee():
    try:
        # Validar se o request tem JSON
        if not request.is_json:
            return jsonify({'message': 'Content-Type deve ser application/json'}), 400
        
        data = request.get_json()
        
        # Validar se os dados foram enviados
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400

        cpf = data.get('cpf')
        employee_name = data.get('employee_name')
        company_name = data.get('company_name')
        documents = data.get('documents', [])
        address = data.get('address')

        # Validar campos obrigatórios
        if not all([cpf, company_name, employee_name]):
            return jsonify({'message': 'Campos obrigatórios: cpf, company_name, employee_name'}), 400
        
        # Validar endereço se fornecido
        if address and not _validate_address(address):
            return jsonify({'message': 'Formato de endereço inválido'}), 400
        
        # Criar funcionário
        employee, error = create_employee_with_documents(cpf, employee_name, company_name, documents, address)

        if error:
            return jsonify({'message': error}), 400
        
        current_app.logger.info(f'Funcionário criado com sucesso: {employee_name} (CPF: {cpf})')
        return jsonify({'message': 'Funcionário criado com sucesso', 'employeeId': employee.id}), 201
        
    except Exception as e:
        current_app.logger.error(f'Erro ao criar funcionário: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500

def list_employees():
    try:
        current_app.logger.info('Listando funcionários...')
        employees = list_employees_with_document_status()
        current_app.logger.info(f'Encontrados {len(employees)} funcionários')
        return jsonify(employees), 200
        
    except Exception as e:
        current_app.logger.error(f'Erro ao listar funcionários: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500

def check_employee_cpf(cpf):
    try:
        if not cpf:
            return jsonify({'message': 'CPF é obrigatório'}), 400

        current_app.logger.info(f'Verificando CPF: {cpf}')
        
        if check_cpf_exists(cpf):
            return jsonify({'message': 'Funcionário já cadastrado'}), 409
        else:
            return jsonify({'message': 'CPF disponível'}), 200
            
    except Exception as e:
        current_app.logger.error(f'Erro ao verificar CPF {cpf}: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500
    
def get_employee_detail_by_id(id):
    try:
        if not id:
            return jsonify({'message': 'ID é obrigatório'}), 400
            
        current_app.logger.info(f'Buscando detalhes do funcionário: {id}')
        employee_data, error = get_employee_detail(id)

        if error:
            return jsonify({'message': error}), 404

        return jsonify(employee_data), 200
        
    except Exception as e:
        current_app.logger.error(f'Erro ao buscar funcionário {id}: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500

def update_employee_data(id):
    try:
        # Validar se o request tem JSON
        if not request.is_json:
            return jsonify({'message': 'Content-Type deve ser application/json'}), 400
        
        data = request.get_json()
        
        # Validar se os dados foram enviados
        if not data:
            return jsonify({'message': 'Dados não fornecidos'}), 400
            
        if not id:
            return jsonify({'message': 'ID é obrigatório'}), 400
            
        current_app.logger.info(f'Atualizando funcionário: {id}')
        updated, error = update_employee(id, data)

        if error:
            return jsonify({'message': error}), 404

        current_app.logger.info(f'Funcionário {id} atualizado com sucesso')
        return jsonify({'message': 'Funcionário atualizado com sucesso', 'employee': updated}), 200
        
    except Exception as e:
        current_app.logger.error(f'Erro ao atualizar funcionário {id}: {str(e)}')
        return jsonify({'message': 'Erro interno do servidor'}), 500

def _validate_address(address):
    """Valida a estrutura do endereço JSON"""
    if not isinstance(address, dict):
        return False
    
    valid_fields = {'street', 'number', 'neighborhood', 'city', 'complement', 'zip_code'}
    
    for field in address.keys():
        if field not in valid_fields:
            return False
    
    for key, value in address.items():
        if value is not None and not isinstance(value, str):
            return False
    
    return True

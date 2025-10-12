from datetime import datetime, timedelta
import uuid
from app import db
from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload


def check_cpf_exists(cpf):
    employee = Employee.query.filter_by(cpf=cpf).first()
    return employee is not None


def create_employee_with_documents(cpf, employee_name, company_name,
                                   documents):
    employee = Employee(
        id=str(uuid.uuid4()),
        cpf=cpf,
        company_name=company_name,
        employee_name=employee_name,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(employee)
    db.session.flush()

    for doc in documents:
        document = Document(
            id=str(uuid.uuid4()),
            employee_id=employee.id,
            name=doc['name'],
            expiration_date=datetime.strptime(
                doc['expiration_date'], '%Y-%m-%d'
            ),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.session.add(document)

    db.session.commit()
    return employee, None


def list_employees_with_document_status():
    employees = Employee.query.options(joinedload(Employee.documents)).all()
    result = []

    for emp in employees:
        documents = emp.documents
        current_date = datetime.utcnow().date()
        
        # Verifica se algum documento está vencido
        has_expired = any(
            doc.expiration_date < current_date for doc in documents
        )

        # Verifica se algum documento vence nos próximos 30 dias
        thirty_days_ahead = current_date + timedelta(days=30)
        has_expiring = any(
            current_date <= doc.expiration_date <= thirty_days_ahead
            for doc in documents
        )
        
        # Define o status baseado na prioridade: vencido > a vencer > vigente
        if has_expired:
            status = 'expired'
        elif has_expiring:
            status = 'expiring'
        else:
            status = 'valid'

        result.append({
            'id': emp.id,
            'employee_name': emp.employee_name,
            'company_name': emp.company_name,
            'cpf': emp.cpf,
            'status': status
        })

    return result


def get_employee_detail(employee_id):
    employee = Employee.query.options(
        joinedload(Employee.documents)
    ).filter_by(id=employee_id).first()

    if not employee:
        return None, 'Employee not found'

    result = {
        'id': employee.id,
        'employee_name': employee.employee_name,
        'company_name': employee.company_name,
        'cpf': employee.cpf,
        'documents': [
            {
                'id': doc.id,
                'name': doc.name,
                'expiration_date': doc.expiration_date.strftime('%Y-%m-%d')
            } for doc in employee.documents
        ]
    }

    return result, None


def update_employee(employee_id, data):
    employee = Employee.query.get(employee_id)
    if not employee:
        return None, 'Employee not found'

    # Atualiza os dados do empregado
    employee.employee_name = data.get('employee_name', employee.employee_name)
    employee.company_name = data.get('company_name', employee.company_name)
    employee.updated_at = datetime.utcnow()

    # Atualiza ou adiciona documentos
    documents_data = data.get('documents', [])

    for doc_data in documents_data:
        doc_id = doc_data.get('id')

        if doc_id:
            # Buscar o documento existente
            document = Document.query.filter_by(
                id=doc_id, employee_id=employee.id
            ).first()
            if document:
                # Atualiza apenas os campos enviados
                document.name = doc_data.get('name', document.name)
                if 'expiration_date' in doc_data:
                    document.expiration_date = datetime.strptime(
                        doc_data['expiration_date'], '%Y-%m-%d'
                    ).date()
                document.updated_at = datetime.utcnow()
            else:
                return (
                    None,
                    f'Document with ID {doc_id} not found for this employee'
                )
        else:
            # Cria um novo documento, validando os campos obrigatórios
            if 'name' in doc_data and 'expiration_date' in doc_data:
                new_doc = Document(
                    id=str(uuid.uuid4()),
                    name=doc_data['name'],
                    expiration_date=datetime.strptime(
                        doc_data['expiration_date'], '%Y-%m-%d'
                    ).date(),
                    employee_id=employee.id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.session.add(new_doc)
            else:
                return None, 'Missing name or expirationDate for new document'

    db.session.commit()
    
    employee_data = {
        'id': employee.id,
        'employee_name': employee.employee_name,
        'company_name': employee.company_name,
        'cpf': employee.cpf,
        'documents': [
            {
                'id': doc.id,
                'name': doc.name,
                'expiration_date': doc.expiration_date.strftime('%Y-%m-%d')
            } for doc in employee.documents
        ]
    }

    return employee_data, None


def delete_employee(employee_id):
    """
    Deleta um funcionário e todos os seus documentos associados
    """
    try:
        employee = Employee.query.get(employee_id)
        
        if not employee:
            return False, "Funcionário não encontrado"
        
        # Deletar todos os documentos associados primeiro
        Document.query.filter_by(employee_id=employee_id).delete()
        
        # Deletar o funcionário
        db.session.delete(employee)
        db.session.commit()
        
        return True, None
        
    except ValueError as e:
        db.session.rollback()
        return False, f"Erro ao deletar funcionário: {str(e)}"

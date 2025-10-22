from datetime import datetime, timedelta
import uuid
from app import db
from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload

def check_cpf_exists(cpf):
    try:
        employee = Employee.query.filter_by(cpf=cpf).first()
        return employee is not None
    except Exception as e:
        print(f"Erro ao verificar CPF: {e}")
        raise e

def create_employee_with_documents(cpf, employee_name, company_name, documents, address=None):
    try:
        # Verificar se CPF já existe
        if check_cpf_exists(cpf):
            return None, "CPF já cadastrado"
        
        employee = Employee(
            id=str(uuid.uuid4()),
            cpf=cpf,
            company_name=company_name,
            employee_name=employee_name,
            address=address,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.session.add(employee)
        db.session.flush()

        for doc in documents:
            try:
                document = Document(
                    id=str(uuid.uuid4()),
                    employee_id=employee.id,
                    name=doc['name'],
                    expiration_date=datetime.strptime(doc['expiration_date'], '%Y-%m-%d'),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.session.add(document)
            except KeyError as e:
                db.session.rollback()
                return None, f"Campo obrigatório do documento: {str(e)}"
            except ValueError as e:
                db.session.rollback()
                return None, f"Data inválida no documento: {str(e)}"

        db.session.commit()
        return employee, None
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar funcionário: {e}")
        return None, "Erro interno ao criar funcionário"

def list_employees_with_document_status():
    try:
        employees = Employee.query.options(joinedload(Employee.documents)).order_by(Employee.employee_name.asc()).all()
        result = []
        
        today = datetime.utcnow().date()
        expiring_threshold = today + timedelta(days=30)

        for emp in employees:
            try:
                documents = emp.documents
                
                has_expired = any(doc.expiration_date < today for doc in documents)
                
                has_expiring = any(today <= doc.expiration_date <= expiring_threshold for doc in documents)
                
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
            except Exception as e:
                print(f"Erro ao processar funcionário {emp.id}: {e}")
                # Continua processando outros funcionários

        return result
        
    except Exception as e:
        print(f"Erro ao listar funcionários: {e}")
        raise e

def get_employee_detail(id):
    try:
        employee = Employee.query.options(joinedload(Employee.documents)).filter_by(id=id).first()

        if not employee:
            return None, 'Funcionário não encontrado'

        result = {
            'id': employee.id,
            'employee_name': employee.employee_name,
            'company_name': employee.company_name,
            'cpf': employee.cpf,
            'address': employee.address,
            'documents': [
                {
                    'id': doc.id,
                    'name': doc.name,
                    'expiration_date': doc.expiration_date.strftime('%Y-%m-%d')
                } for doc in employee.documents
            ]
        }

        return result, None
        
    except Exception as e:
        print(f"Erro ao buscar funcionário {id}: {e}")
        return None, "Erro interno ao buscar funcionário"

def update_employee(id, data):
    try:
        employee = Employee.query.get(id)
        if not employee:
            return None, 'Funcionário não encontrado'

        employee.employee_name = data.get('employee_name', employee.employee_name)
        employee.company_name = data.get('company_name', employee.company_name)
        if 'address' in data:
            employee.address = data.get('address')
        employee.updated_at = datetime.utcnow()

        documents_data = data.get('documents', [])

        for doc_data in documents_data:
            try:
                doc_id = doc_data.get('id')

                if doc_id:
                    document = Document.query.filter_by(id=doc_id, employee_id=employee.id).first()
                    if document:
                        document.name = doc_data.get('name', document.name)
                        if 'expiration_date' in doc_data:
                            document.expiration_date = datetime.strptime(doc_data['expiration_date'], '%Y-%m-%d').date()
                        document.updated_at = datetime.utcnow()
                    else:
                        return None, f'Documento com ID {doc_id} não encontrado para este funcionário'
                else:
                    if 'name' in doc_data and 'expiration_date' in doc_data:
                        new_doc = Document(
                            id=str(uuid.uuid4()),
                            name=doc_data['name'],
                            expiration_date=datetime.strptime(doc_data['expiration_date'], '%Y-%m-%d').date(),
                            employee_id=employee.id,
                            created_at=datetime.utcnow(),
                            updated_at=datetime.utcnow()
                        )
                        db.session.add(new_doc)
                    else:
                        return None, 'Nome e data de expiração são obrigatórios para novo documento'
            except ValueError as e:
                db.session.rollback()
                return None, f'Data inválida no documento: {str(e)}'

        db.session.commit()
        
        # Recarregar funcionário com documentos atualizados
        employee = Employee.query.options(joinedload(Employee.documents)).filter_by(id=id).first()
        
        employee_data = {
            'id': employee.id,
            'employee_name': employee.employee_name,
            'company_name': employee.company_name,
            'cpf': employee.cpf,
            'address': employee.address,
            'documents': [
                {
                    'id': doc.id,
                    'name': doc.name,
                    'expiration_date': doc.expiration_date.strftime('%Y-%m-%d')
                } for doc in employee.documents
            ]
        }

        return employee_data, None
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao atualizar funcionário {id}: {e}")
        return None, "Erro interno ao atualizar funcionário"

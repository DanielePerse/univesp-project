from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload
from app import db
from datetime import datetime
import uuid

def check_cpf_exists(cpf):
    return Employee.query.filter_by(cpf=cpf).first() is not None

def create_employee_with_documents(cpf, company_name, employee_name, user_id, documents_data):
    if check_cpf_exists(cpf):
        return None, 'Employee with this CPF already exists'

    employee = Employee(
        id=str(uuid.uuid4()),
        cpf=cpf,
        companyName=company_name,
        employeeName=employee_name,
        user=user_id,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow()
    )

    db.session.add(employee)
    db.session.flush()

    for doc in documents_data:
        document = Document(
            id=str(uuid.uuid4()),
            employeeId=employee.id,
            name=doc['name'],
            expirationDate=datetime.strptime(doc['expirationDate'], '%Y-%m-%d'),
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )
        db.session.add(document)

    db.session.commit()
    return employee, None

from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload

def get_employee_detail(employee_id):
    employee = Employee.query.options(joinedload(Employee.documents)).filter_by(id=employee_id).first()

    if not employee:
        return None, 'Employee not found'

    has_expired = any(doc.expirationDate < datetime.utcnow().date() for doc in employee.documents)
    status = 'expired' if has_expired else 'valid'

    result = {
        'id': employee.id,
        'employeeName': employee.employeeName,
        'companyName': employee.companyName,
        'cpf': employee.cpf,
        'status': status,
        'documents': [
            {
                'id': doc.id,
                'name': doc.name,
                'expirationDate': doc.expirationDate.strftime('%Y-%m-%d')
            } for doc in employee.documents
        ]
    }

    return result, None

from app.extensions import db
from app.models.document import Document

def update_employee(employee_id, data):
    employee = Employee.query.get(employee_id)
    if not employee:
        return None, 'Employee not found'

    employee.employeeName = data.get('employeeName', employee.employeeName)
    employee.companyName = data.get('companyName', employee.companyName)
    employee.updatedAt = datetime.utcnow()

    # Deleta documentos antigos
    Document.query.filter_by(employeeId=employee.id).delete()

    # Adiciona documentos novos
    documents = data.get('documents', [])
    for doc in documents:
        new_doc = Document(
            name=doc['name'],
            expirationDate=datetime.strptime(doc['expirationDate'], '%Y-%m-%d').date(),
            employeeId=employee.id
        )
        db.session.add(new_doc)

    db.session.commit()
    return employee, None



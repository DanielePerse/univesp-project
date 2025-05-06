from datetime import datetime
import uuid
from app import db
from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload


def check_cpf_exists(cpf):
    employee = Employee.query.filter_by(cpf=cpf).first()
    return employee is not None

def create_employee_with_documents(cpf, employee_name, company_name, documents):
    employee = Employee(
        id=str(uuid.uuid4()),
        cpf=cpf,
        company_name=company_name,
        employee_name=employee_name,
        #user=user_id,
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
            expiration_date=datetime.strptime(doc['expirationDate'], '%Y-%m-%d'),
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
        has_expired = any(doc.expiration_date < datetime.utcnow().date() for doc in documents)

        status = 'expired' if has_expired else 'valid'

        result.append({
            'id': emp.id,
            'employee_name': emp.employee_name,
            'company_name': emp.company_name,
            'cpf': emp.cpf,
            'status': status
        })

    return result

def get_employee_detail(id):
    employee = Employee.query.options(joinedload(Employee.documents)).filter_by(id=id).first()

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

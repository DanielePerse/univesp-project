from datetime import datetime
import uuid
from app import db
from app.models.employee import Employee
from app.models.document import Document
from sqlalchemy.orm import joinedload


def check_cpf_exists(cpf):
    return Employee.query.filter_by(cpf=cpf).first() is not None

def create_employee_with_documents(cpf, company_name, employee_name, documents):
    if check_cpf_exists(cpf):
        return None, 'Employee with this CPF already exists'

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

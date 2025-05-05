from datetime import datetime
import uuid
from app import db
from app.models.employee import Employee
from app.models.document import Document


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

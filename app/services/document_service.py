from app.models.employee import Employee
from sqlalchemy.orm import joinedload
from datetime import datetime

def list_employees_with_status():
    employees = Employee.query.options(joinedload(Employee.documents)).all()
    result = []

    for emp in employees:
        documents = emp.documents
        has_expired = any(doc.expirationDate < datetime.utcnow().date() for doc in documents)

        status = 'expired' if has_expired else 'valid'

        result.append({
            'id': emp.id,
            'employeeName': emp.employeeName,
            'companyName': emp.companyName,
            'cpf': emp.cpf,
            'status': status
        })

    return result

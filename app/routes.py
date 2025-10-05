from flask import Blueprint, render_template
from app.controllers.employee_controller import (
    create_employee,
    list_employees,
    check_employee_cpf,
    get_employee_detail_by_id,
    update_employee_data
)
from app.controllers.auth_controller import register, login
from app.utils.auth import token_required

bp = Blueprint('routes', __name__)

# Rotas para páginas HTML
@bp.route('/')
def index():
    return render_template('login.html')

@bp.route('/home')
def home():
    return render_template('home.html')

@bp.route('/cadastro')
def cadastro():
    return render_template('cadastro.html')

@bp.route('/consulta')
def consulta():
    return render_template('consulta.html')

@bp.route('/detalhes')
def detalhes():
    return render_template('detalhes.html')

@bp.route('/verifica_cpf')
def verifica_cpf():
    return render_template('verifica_cpf.html')

# Rotas da API
@bp.route('/employee/register_employee', methods=['POST'])
@token_required
def register_employee():
    return create_employee()

@bp.route('/employee/list', methods=['GET'])
@token_required
def list():
    return list_employees()

@bp.route('/employee/check_register/<cpf>', methods=['GET'])
@token_required
def checkRegister(cpf):
    return check_employee_cpf(cpf)

@bp.route('/employee/<id>', methods=['GET'])
@token_required
def registerDetail(id):
    return get_employee_detail_by_id(id)

@bp.route('/employee/<id>', methods=['PUT'])
@token_required
def registerUpdate(id):
    return update_employee_data(id)

@bp.route('/auth/register', methods=['POST'])
def registerUser():
    return register()

@bp.route('/auth/login', methods=['POST'])
def loginUser():
    return login()

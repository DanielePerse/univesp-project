
from flask import Blueprint, render_template
try:
    from .controllers.employee_controller import (
        create_employee,
        list_employees,
        check_employee_cpf,
        get_employee_detail_by_id,
        update_employee_data
    )
    from .controllers.auth_controller import register, login
    from .utils.auth import token_required
except ImportError:
    import sys
    import os
    base_dir = os.path.dirname(os.path.dirname(__file__))
    sys.path.append(base_dir)
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
    """Renderiza a página de login."""
    return render_template('login.html')


@bp.route('/home')
def home():
    """Renderiza a página inicial/home."""
    return render_template('home.html')


@bp.route('/cadastro')
def cadastro():
    """Renderiza a página de cadastro de funcionário."""
    return render_template('cadastro.html')


@bp.route('/consulta')
def consulta():
    """Renderiza a página de consulta de funcionários."""
    return render_template('consulta.html')


@bp.route('/detalhes/<employee_id>')
def detalhes_funcionario(employee_id):
    """Renderiza a página de detalhes de um funcionário específico."""
    return render_template('detalhes.html', employee_id=employee_id)


@bp.route('/verifica_cpf')
def verifica_cpf():
    """Renderiza a página de verificação de CPF."""
    return render_template('verifica_cpf.html')


@bp.route('/cadastro_usuario')
def cadastro_usuario():
    """Renderiza a página de cadastro de usuário."""
    return render_template('cadastro_usuario.html')


# Rotas da API
@bp.route('/employee/register_employee', methods=['POST'])
@token_required
def register_employee():
    """Endpoint para registrar um novo funcionário."""
    return create_employee()


@bp.route('/employee/list', methods=['GET'])
@token_required
def list_all_employees():
    """Endpoint para listar todos os funcionários."""
    return list_employees()


@bp.route('/employee/check_register/<cpf>', methods=['GET'])
@token_required
def checkRegister(cpf):
    """Endpoint para verificar se um CPF já está registrado."""
    return check_employee_cpf(cpf)


@bp.route('/employee/<employee_id>', methods=['GET'])
@token_required
def registerDetail(employee_id):
    """Endpoint para obter detalhes de um funcionário específico."""
    return get_employee_detail_by_id(employee_id)


@bp.route('/employee/<employee_id>', methods=['PUT'])
@token_required
def registerUpdate(employee_id):
    """Endpoint para atualizar dados de um funcionário."""
    return update_employee_data(employee_id)


@bp.route('/auth/register', methods=['POST'])
def registerUser():
    """Endpoint para registrar um novo usuário."""
    return register()


@bp.route('/auth/login', methods=['POST'])
def loginUser():
    """Endpoint para autenticar um usuário."""
    return login()

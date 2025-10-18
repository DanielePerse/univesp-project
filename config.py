import os


class Config:
    """
    Classe de configuração da aplicação.
    
    Attributes:
        SQLALCHEMY_DATABASE_URI (str): URI de conexão com o banco de dados
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): Controle de modificações do
            SQLAlchemy
        SECRET_KEY (str): Chave secreta para JWT e sessões
    """
    # Configuração para Docker Compose (usa o nome do serviço 'db' como host)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/univesp'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')

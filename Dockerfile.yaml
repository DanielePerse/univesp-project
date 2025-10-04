FROM python:3.12

WORKDIR /app

# Instalar netcat para verificar disponibilidade do banco
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache -r requirements.txt

COPY . .

# Variáveis de ambiente para Flask-Migrate
ENV FLASK_APP=run.py
ENV FLASK_ENV=development

# Tornar o entrypoint executável
RUN chmod +x entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]
from app import app

@app.route('/hello', methods=['GET'])
def hello():
    return '', 201

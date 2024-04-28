import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import socket
from werkzeug.security import check_password_hash

app = Flask(__name__)

app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost/creatink'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Clients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(100))
    date = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__ (self, name, password, email):
        self.name = name
        self.password = password
        self.email = email

class ClientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'password', 'email', 'date')


client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)


@app.route("/getAllClients", methods = ['GET'])
def get_clients():
    all_clients = Clients.query.all()
    results = clients_schema.dump(all_clients)
    return jsonify(results)


@app.route("/getClient/<id>", methods = ['GET'])
def get_client(id):
    client = Clients.query.get(id)
    return client_schema.jsonify(client)


@app.route("/addClient", methods = ['POST'])
def add_client():
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']

    clients = Clients(name, password, email)
    db.session.add(clients)
    db.session.commit()
    return client_schema.jsonify(clients)



@app.route("/login", methods=['POST'])
def login_client():
    # Kullanıcıdan e-posta ve şifre alınır
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"message": "Invalid request, email and password are required"}), 400

    # Veritabanında e-posta adresine sahip kullanıcı aranır
    client = Clients.query.filter_by(email=email).first()

    #if client is not None:
    if client.password == password:
        # Kullanıcı var ve parola doğru
        # Başarılı giriş durumu için bir yanıt döndür
        # Not: Gerçek bir uygulamada, kullanıcının oturumunu yönetmek için JWT tokenleri gibi mekanizmalar kullanılabilir
        return jsonify({"message": "successful", "client_id": client.id})
    else:
        # Parola yanlış
        return jsonify({"message": "invalid password"}), 401
 



@app.route("/updateClient/<id>", methods = ['PUT'])
def update_client(id):
    client = Clients.query.get(id)
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']

    client.name = name
    client.password = password
    client.email = email

    db.session.commit()
    return client_schema.jsonify(client)

@app.route("/deleteClient/<id>", methods = ['DELETE'])
def delete_client(id):
    client = Clients.query.get(id)
    db.session.delete(client)
    db.session.commit()

    return client_schema.jsonify(client)

if __name__ == "__main__":
    app.run(host = '0.0.0.0', port=5000, debug=True)

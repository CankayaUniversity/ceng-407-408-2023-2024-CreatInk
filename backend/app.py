import datetime
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)

app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost/creatink'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Clients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    phone = db.Column(db.String(100))
    email = db.Column(db.String(100))
    date = db.Column(db.DateTime, default = datetime.datetime.now)

    def __init__ (self, name, phone, email):
        self.name = name
        self.phone = phone
        self.email = email

class ClientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'phone', 'email', 'date')


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
    phone = request.json['phone']
    email = request.json['email']

    clients = Clients(name, phone, email)
    db.session.add(clients)
    db.session.commit()
    return client_schema.jsonify(clients)


@app.route("/updateClient/<id>", methods = ['PUT'])
def update_client(id):
    client = Clients.query.get(id)
    name = request.json['name']
    phone = request.json['phone']
    email = request.json['email']

    client.name = name
    client.phone = phone
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
    app.run(host = '192.168.1.38', port=5000, debug=True)

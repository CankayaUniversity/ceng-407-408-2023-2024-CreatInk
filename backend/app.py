import datetime
import io
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import cv2
import numpy as np
import base64
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@localhost/creatink'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Clients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(100))
    date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, name, password, email):
        self.name = name
        self.password = password
        self.email = email

class ClientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'password', 'email', 'date')

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)

def process_image(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted_gray_image = 255 - gray_image
    blur_inverted_gray_image = cv2.GaussianBlur(inverted_gray_image, (111, 111), 0)
    inverted_blur = 255 - blur_inverted_gray_image
    final_photo = cv2.divide(gray_image, inverted_blur, scale=256)
    return final_photo

def sharpen_image(image):
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    lab[:, :, 0] = clahe.apply(lab[:, :, 0])
    image_clahe = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    blurred = cv2.GaussianBlur(image_clahe, (9, 9), 10.0)
    image_unsharp = cv2.addWeighted(image_clahe, 1.5, blurred, -0.5, 0)
    return image_unsharp

@app.route("/processImage", methods=['POST'])
def process_image_endpoint():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        result_image = process_image(image)
        _, buffer = cv2.imencode(".jpg", result_image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')
        return jsonify({"image": encoded_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/sharpenImage", methods=['POST'])
def sharpen_image_endpoint():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        result_image = sharpen_image(image)
        _, buffer = cv2.imencode('.jpg', result_image)
        encoded_image = base64.b64encode(buffer).decode('utf-8')
        return jsonify({"image": encoded_image})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/getAllClients", methods=['GET'])
def get_clients():
    all_clients = Clients.query.all()
    results = clients_schema.dump(all_clients)
    return jsonify(results)

@app.route("/getClient/<id>", methods=['GET'])
def get_client(id):
    client = Clients.query.get(id)
    return client_schema.jsonify(client)

@app.route("/addClient", methods=['POST'])
def add_client():
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']

    client = Clients(name, password, email)
    db.session.add(client)
    db.session.commit()
    return client_schema.jsonify(client)

@app.route("/login", methods=['POST'])
def login_client():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"message": "Invalid request, email and password are required"}), 400

    client = Clients.query.filter_by(email=email).first()

    if not client:
        return jsonify({"message": "email_not_found"}), 401

    if client.password == password:
        return jsonify({"message": "successful", "client_id": client.id})
    else:
        return jsonify({"message": "invalid password"}), 401

@app.route("/updateClient/<id>", methods=['PUT'])
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

@app.route("/deleteClient/<id>", methods=['DELETE'])
def delete_client(id):
    client = Clients.query.get(id)
    db.session.delete(client)
    db.session.commit()

    return client_schema.jsonify(client)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

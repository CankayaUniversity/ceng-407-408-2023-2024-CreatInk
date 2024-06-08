import datetime
import io
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import cv2
import numpy as np
import base64
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)
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
    date = db.Column(db.DateTime, default=datetime.datetime.now)

    def _init_(self, name, password, email):
        self.name = name
        self.password = password
        self.email = email


class Photos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    tattoos = db.Column(db.Text)  # Veya dosya yolu için db.Column(db.String(200))

    def _init_(self, client_id, tattoos=None):
        self.client_id = client_id
        self.tattoos = tattoos

class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    name = db.Column(db.String(100))
    tattooNum = db.Column(db.Integer)

    def _init_(self, client_id, name, tattooNum):
        self.client_id = client_id
        self.name = name
        self.tattooNum = tattooNum
class ClientSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'password', 'email', 'date', 'saved_images')


class PhotosSchema(ma.Schema):
    class Meta:
        fields = ('id', 'client_id', 'tattoos')

class CustomersSchema(ma.Schema):
    class Meta:
        fields = ('id', 'client_id', 'name', 'tattooNum')

client_schema = ClientSchema()
clients_schema = ClientSchema(many=True)
photos_schema = PhotosSchema()
photos_schema = PhotosSchema(many=True)
customers_schema = CustomersSchema()
customers_schema = CustomersSchema(many = True)
import base64

@app.route('/getClientPhotos/<client_id>', methods=['GET'])
def get_client_photos(client_id):
    try:
        photos = Photos.query.filter_by(client_id=client_id).all()
        if not photos:
            return jsonify({"message": "No photos found for client"}), 404

        photos_list = []
        for photo in photos:
            photo_data = {
                "photo_id": photo.id,
                "client_id": photo.client_id,
                "tattoos": photo.tattoos  # no need to decode
                # Other fields if needed
            }
            photos_list.append(photo_data)

        return jsonify(photos_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
@app.route('/deletePhoto/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    try:
        photo = Photos.query.filter_by(id=photo_id).first()
        if not photo:
            return jsonify({"error": "Photo not found"}), 404
        
        db.session.delete(photo)
        db.session.commit()

        return jsonify({"message": "Photo deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/addCustomer', methods=['POST'])
def add_customer():
    data = request.get_json()

    client_id = data.get('client_id')
    name = data.get('name')
    tattoo_num = data.get('tattooNum')

    if not client_id or not name:
        return jsonify({"error": "Missing client_id or name data"}), 400

    try:
        new_customer = Customers(client_id=client_id, name=name, tattooNum=tattoo_num)
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"message": "Customer added successfully", "customer_id": new_customer.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@app.route('/getCustomers/<client_id>', methods=['GET'])
def get_customers(client_id):
    try:
        customers = Customers.query.filter_by(client_id=client_id).all()
        if not customers:
            return jsonify({"message": "No customers found for client_id {}".format(client_id)}), 404
        
        # prepare response data
        customers_data = []
        for customer in customers:
            customer_data = {
                "customer_id": customer.id,
                "client_id": customer.client_id,
                "name": customer.name,
                "tattooNum": customer.tattooNum
            }
            customers_data.append(customer_data)

        return jsonify({"customers": customers_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@app.route('/updateCustomer/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    data = request.get_json()

    try:
        customer = Customers.query.filter_by(id=customer_id).first()
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
        
        # Update customer fields
        if 'client_id' in data:
            customer.client_id = data['client_id']
        if 'name' in data:
            customer.name = data['name']
        if 'tattooNum' in data:
            customer.tattooNum = data['tattooNum']

        db.session.commit()

        return jsonify({"message": "Customer updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/deleteCustomer/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    try:
        customer = Customers.query.filter_by(id=customer_id).first()
        if not customer:
            return jsonify({"error": "Customer not found"}), 404
        
        db.session.delete(customer)
        db.session.commit()

        return jsonify({"message": "Customer deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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
    
@app.route("/extractEdges", methods=['POST'])
def extract_edges_endpoint():
    if 'image' not in request.files:
        print("No image part in the request")
        return "No image part", 400

    file = request.files['image']
    if file.filename == '':
        print("No selected file")
        return "No selected file", 400

    try:
        print("Received image for edge detection")

        # Convert image file to OpenCV format
        np_img = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        print("Image converted to OpenCV format")

        # Apply Canny edge detection
        edged = cv2.Canny(image, 10, 250)
        print("Applied Canny edge detection")

        # Encode the image to base64
        _, buffer = cv2.imencode('.jpg', edged)
        image_base64 = base64.b64encode(buffer).decode('utf-8')
        print("Encoded edge-detected image to base64")

        return jsonify({"image": image_base64})

    except Exception as e:
        print(f"Error processing image: {e}")
        return f"Error processing image: {e}", 500   
    
@app.route('/addPhotos', methods=['POST'])
def add_photo():
    data = request.get_json()

    client_id = data.get('client_id')
    tattoos = data.get('tattoos')  # BLOB formatında ikili veri

    if not client_id or not tattoos:
        return jsonify({"error": "Missing client_id or tattoos data"}), 400

    try:
        new_photo = Photos(client_id=client_id, tattoos=tattoos)
        db.session.add(new_photo)
        db.session.commit()

        return jsonify({"message": "Photo added successfully", "photo_id": new_photo.id}), 201
    except Exception as e:
        db.session.rollback()
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

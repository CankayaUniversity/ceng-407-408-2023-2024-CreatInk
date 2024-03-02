import datetime
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.app_context().push()

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:111852@localhost/creatink'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

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



@app.route("/")
def get_articles():
    return jsonify({"Hello":"World!"})

if __name__ == "__main__":
    app.run(debug=True)

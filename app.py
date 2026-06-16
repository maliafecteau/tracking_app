from flask import Flask
from flask_jwt_extended import JWTManager
from models import db
from blueprints.auth import auth_bp
from blueprints.expenses import expenses_bp
from blueprints.income import income_bp
from blueprints.bills import bills_bp
from blueprints.savings import savings_bp
from blueprints.bank import bank_bp
from blueprints.auth.api import auth_api_bp
from utils import login_required
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
   
    app.secret_key = os.environ.get("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "jwt_secret_key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False # add expiry later dude

    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(income_bp)
    app.register_blueprint(bills_bp)
    app.register_blueprint(savings_bp)
    app.register_blueprint(bank_bp)
    app.register_blueprint(auth_api_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()#create database tables if they don't exist
    app.run(debug=True)
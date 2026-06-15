from flask import Flask
from models import db
from blueprints.auth import auth_bp
from blueprints.expenses import expenses_bp
from blueprints.income import income_bp
from blueprints.bills import bills_bp
from blueprints.savings import savings_bp
from utils import login_required
import os

def create_app():
    app = Flask(__name__)
    app.secret_key = "warnalia"

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(income_bp)
    app.register_blueprint(bills_bp)
    app.register_blueprint(savings_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()#create database tables if they don't exist
    app.run(debug=True)
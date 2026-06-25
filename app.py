from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
load_dotenv()

from models import db
from blueprints.auth import auth_bp
from blueprints.expenses import expenses_bp
from blueprints.income import income_bp
from blueprints.bills import bills_bp
from blueprints.savings import savings_bp
from blueprints.bank import bank_bp
from blueprints.auth.api import auth_api_bp
from blueprints.expenses.api import expenses_api_bp
from blueprints.income.api import income_api_bp
from blueprints.bills.api import bills_api_bp
from blueprints.savings.api import savings_api_bp
from blueprints.bank.api import bank_api_bp
from blueprints.advice import advice_api_bp
from blueprints.categories import categories_api_bp
from utils import login_required
import os


def seed_categories():
    from models import Category
    from blueprints.categories.api import SYSTEM_CATEGORIES
    for cat in SYSTEM_CATEGORIES:
        exists = Category.query.filter_by(name=cat["name"], user_id=None).first()
        if not exists:
            category = Category(name=cat["name"], color=cat["color"], user_id=None)
            db.session.add(category)
        elif exists.color != cat["color"]:
            exists.color = cat["color"]
    db.session.commit()


def create_app():
    app = Flask(__name__)

    app.secret_key = os.environ.get("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(expenses_bp)
    app.register_blueprint(income_bp)
    app.register_blueprint(bills_bp)
    app.register_blueprint(savings_bp)
    app.register_blueprint(bank_bp)
    app.register_blueprint(auth_api_bp)
    app.register_blueprint(expenses_api_bp)
    app.register_blueprint(income_api_bp)
    app.register_blueprint(bills_api_bp)
    app.register_blueprint(savings_api_bp)
    app.register_blueprint(bank_api_bp)
    app.register_blueprint(advice_api_bp)
    app.register_blueprint(categories_api_bp)

    with app.app_context():
        db.create_all()
        seed_categories()

    return app



if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
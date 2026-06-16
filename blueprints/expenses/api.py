from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db , Expense

expenses_api_bp = Blueprint("expenses_api", __name__)

@expenses_api_bp.route("/api/expenses", methods=["GET"])
@jwt_required()
def api_get_expenes():
    user_id = get_jwt_identity()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id"
    }])
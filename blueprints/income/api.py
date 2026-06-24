from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Income

income_api_bp = Blueprint("income_api", __name__)

@income_api_bp.route("/api/income", methods=["GET"])
@jwt_required()
def api_get_income():
    user_id = int(get_jwt_identity())
    incomes = Income.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": i.income_id,
        "amount": i.amount,
        "date": i.date,
        "source": i.source,
        "description": i.description or "Income"
    } for i in incomes])


@income_api_bp.route("/api/income", methods=["POST"])
@jwt_required()
def api_create_income():
    user_id = get_jwt_identity()
    data = request.get_json()

    amount = data.get("amount")
    date = data.get("date", "").strip()

    if amount is None or not date:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    income = Income(amount=amount_value, date=date, user_id=user_id)
    db.session.add(income)
    db.session.commit()

    return jsonify({"id": income.income_id, "amount": income.amount, "date": income.date}), 201


@income_api_bp.route("/api/income/<int:income_id>", methods=["PUT"])
@jwt_required()
def api_update_income(income_id):
    user_id = int(get_jwt_identity())
    income = Income.query.filter_by(income_id=income_id, user_id=user_id).first()

    if not income:
        return jsonify({"error": "Income not found"}), 404

    data = request.get_json()
    amount = data.get("amount")
    date = data.get("date", "").strip()

    if amount is None or not date:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    income.amount = amount_value
    income.date = date
    db.session.commit()

    return jsonify({"id": income.income_id, "amount": income.amount, "date": income.date})


@income_api_bp.route("/api/income/<int:income_id>", methods=["DELETE"])
@jwt_required()
def api_delete_income(income_id):
    user_id = int(get_jwt_identity())
    income = Income.query.filter_by(income_id=income_id, user_id=user_id).first()

    if not income:
        return jsonify({"error": "Income not found"}), 404

    db.session.delete(income)
    db.session.commit()
    return jsonify({"message": "Income deleted"}), 200
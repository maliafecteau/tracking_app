from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db , Expense

expenses_api_bp = Blueprint("expenses_api", __name__)

@expenses_api_bp.route("/api/expenses", methods=["GET"])
@jwt_required()
def api_get_expenes():
    user_id = int(get_jwt_identity())
    expenses = Expense.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": e.ex_id,
        "description": e.description,
        "amount": e.amount,
        "source": e.source,
    } for e in expenses])

@expenses_api_bp.route("/api/expenses", methods=["POST"])
@jwt_required()
def api_create_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    description = data.get("description", "").strip()
    amount = data.get("amount")
    date = data.get("date", "").strip()

    if not description or amount is None or not date:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    expense = Expense(description=description, amount=amount_value, date=date, user_id=user_id)
    db.session.add(expense)
    db.session.commit()

    return jsonify({"id": expense.ex_id, "description": expense.description, "amount": expense.amount, "date": expense.date}), 201

@expenses_api_bp.route("/api/expenses/<int:expense_id>", methods=["PUT"])
@jwt_required()
def api_update_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json()
    description = data.get("description", "").strip()
    amount = data.get("amount")
    date = data.get("date", "").strip()

    if not description or amount is None or not date:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    expense.description = description
    expense.amount = amount_value
    expense.date = date
    db.session.commit()

    return jsonify({"id": expense.ex_id, "description": expense.description, "amount": expense.amount, "date": expense.date})


@expenses_api_bp.route("/api/expenses/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def api_delete_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message": "Expense deleted"}), 200


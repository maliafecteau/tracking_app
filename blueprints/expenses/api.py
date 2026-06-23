from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db , Expense
from sqlalchemy import func
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
        "category": e.category
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

@expenses_api_bp.route("/api/expenses/summary", methods=["GET"]) # summary endpoint to create charts for later
@jwt_required()
def api_expenses_summary():
    user_id = int(get_jwt_identity())
     #optional fate range filter
    from_date = request.args.get("from")
    to_date = request.args.get("to")

    query = (
        db.session.query(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == user_id)
    )

    if from_date:
        query = query.filter(Expense.date >= from_date)
    if to_date:
        query = query.filter(Expense.date <= to_date)
    
    results = query.group_by(Expense.category).all()

    # format for rechart array of catergorty total
    summary = sorted([
        {
            "category": row.category or "Other",
            "total": round(float(row.total), 2)
        }
        for row in results
    ], key=lambda x: x["total"], reverse=True)

    return jsonify({
        "summary": summary,
        "total_spent": round(sum(item["total"] for item in summary), 2),
        "from": from_date,
        "to": to_date,
    })

@expenses_api_bp.route("/api/expenses/monthly", methods=["GET"]) # monthly breakdwn endpoint
@jwt_required()
def api_expenses_monthly():
    user_id = int(get_jwt_identity())

    # SQLite substring to extract YYYY-MM from date string
    month = func.substr(Expense.date, 1, 7)

    results = (
        db.session.query(
            month.label("month"),
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == user_id)
        .group_by(month)
        .order_by(month)
        .all()
    )

    return jsonify([
        {
            "month": row.month,
            "total": round(float(row.total), 2)
        }
        for row in results
    ])
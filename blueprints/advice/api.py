from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Income, Expense, Bill
from services.advice_service import generate_advice
from blueprints.savings.api import get_savings_data

advice_api_bp = Blueprint("advice_api", __name__)

@advice_api_bp.route("/api/advice", methods=["GET"])
@jwt_required()
def api_get_advice():
    user_id = int(get_jwt_identity())

    # reuse existing savings summary function
    savings_data = get_savings_data(user_id)

    # get expense summary by category
    from models import db
    from sqlalchemy import func
    results = (
        db.session.query(Expense.category, func.sum(Expense.amount).label("total"))
        .filter(Expense.user_id == user_id)
        .group_by(Expense.category)
        .all()
    )
    expense_summary = [{"category": r.category, "total": float(r.total)} for r in results]

    # get bills with status
    from datetime import datetime
    today = datetime.today().day
    bills = Bill.query.filter_by(user_id=user_id).all()
    bills_data = []
    for b in bills:
        days_until = b.day_due - today
        status = "overdue" if days_until < 0 else "upcoming" if days_until <= 7 else "ok"
        bills_data.append({"title": b.title, "amount": b.amount, "status": status})

    advice = generate_advice(savings_data, expense_summary, bills_data)
    return jsonify(advice)
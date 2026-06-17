from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Income, Expense, Bill, SavingsGoal

savings_api_bp = Blueprint("savings_api", __name__)

def get_savings_data(user_id):
    incomes = Income.query.filter_by(user_id=user_id).all()
    expenses = Expense.query.filter_by(user_id=user_id).all()
    bills = Bill.query.filter_by(user_id=user_id).all()

    total_income = sum(i.amount for i in incomes)
    total_expenses = sum(e.amount for e in expenses)
    total_bills = sum(b.amount for b in bills)
    total_outgoings = total_expenses + total_bills
    savings = total_income - total_outgoings
    savings_rate = (savings / total_income * 100) if total_income > 0 else 0

    return {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "total_bills": round(total_bills, 2),
        "total_outgoings": round(total_outgoings, 2),
        "savings": round(savings, 2),
        "savings_rate": round(savings_rate, 1),
    }


@savings_api_bp.route("/api/savings", methods=["GET"])
@jwt_required()
def api_get_savings():
    user_id = get_jwt_identity()
    data = get_savings_data(user_id)
    goals = SavingsGoal.query.filter_by(user_id=user_id).all()

    goals_data = []
    for goal in goals:
        progress = min(round((goal.current_amount / goal.target_amount) * 100, 1), 100) if goal.target_amount > 0 else 0
        goals_data.append({
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": goal.current_amount,
            "deadline": goal.deadline,
            "progress": progress
        })

    return jsonify({**data, "goals": goals_data})


@savings_api_bp.route("/api/savings/goals", methods=["POST"])
@jwt_required()
def api_create_goal():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title", "").strip()
    target_amount = data.get("target_amount")
    deadline = data.get("deadline", "").strip()

    if not title or target_amount is None:
        return jsonify({"error": "Title and target amount are required"}), 400

    try:
        target_value = float(target_amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Target amount must be a valid number"}), 400

    goal = SavingsGoal(title=title, target_amount=target_value, deadline=deadline or None, user_id=user_id)
    db.session.add(goal)
    db.session.commit()

    return jsonify({"id": goal.goal_id, "title": goal.title, "target_amount": goal.target_amount}), 201


@savings_api_bp.route("/api/savings/goals/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def api_delete_goal(goal_id):
    user_id = get_jwt_identity()
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted"}), 200
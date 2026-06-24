from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text, func
from datetime import datetime, timedelta
from models import db, Income, Expense, Bill, SavingsGoal

savings_api_bp = Blueprint("savings_api", __name__)


def ensure_extra_columns():
    columns = db.session.execute(text("PRAGMA table_info(savings_goal)")).mappings().all()
    column_names = {c["name"] for c in columns}

    if "current_amount" not in column_names:
        db.session.execute(text("ALTER TABLE savings_goal ADD COLUMN current_amount FLOAT DEFAULT 0"))
        db.session.commit()

    if "is_completed" not in column_names:
        db.session.execute(text("ALTER TABLE savings_goal ADD COLUMN is_completed INTEGER DEFAULT 0"))
        db.session.commit()


# Keep old name as alias so existing call sites still work
ensure_current_amount_column = ensure_extra_columns


def get_goal_data_map(goal_ids):
    if not goal_ids:
        return {}

    ensure_extra_columns()
    placeholders = ",".join([f":goal_id_{index}" for index, _ in enumerate(goal_ids)])
    params = {f"goal_id_{index}": goal_id for index, goal_id in enumerate(goal_ids)}
    rows = db.session.execute(
        text(
            f"SELECT goal_id,"
            f" COALESCE(current_amount, 0) AS current_amount,"
            f" COALESCE(is_completed, 0) AS is_completed"
            f" FROM savings_goal WHERE goal_id IN ({placeholders})"
        ),
        params,
    ).mappings().all()

    return {
        int(row["goal_id"]): {
            "current_amount": float(row["current_amount"] or 0),
            "is_completed": bool(row["is_completed"]),
        }
        for row in rows
    }


def get_current_amount_map(goal_ids):
    data = get_goal_data_map(goal_ids)
    return {gid: v["current_amount"] for gid, v in data.items()}

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


@savings_api_bp.route("/api/savings/monthly-summary", methods=["GET"])
@jwt_required()
def api_monthly_savings_summary():
    user_id = int(get_jwt_identity())
    period_end = datetime.utcnow().date()
    period_start = period_end - timedelta(days=30)
    from_date = period_start.isoformat()
    to_date = period_end.isoformat()

    income_total = (
        db.session.query(func.coalesce(func.sum(Income.amount), 0))
        .filter(Income.user_id == user_id)
        .filter(Income.date >= from_date)
        .filter(Income.date <= to_date)
        .scalar()
    )
    income_total = round(float(income_total or 0), 2)

    expense_rows = (
        db.session.query(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .filter(Expense.user_id == user_id)
        .filter(Expense.date >= from_date)
        .filter(Expense.date <= to_date)
        .group_by(Expense.category)
        .all()
    )

    summary = sorted(
        [
            {
                "category": row.category or "Other",
                "total": round(float(row.total or 0), 2),
            }
            for row in expense_rows
        ],
        key=lambda item: item["total"],
        reverse=True,
    )

    total_spent = round(sum(item["total"] for item in summary), 2)
    savings_total = round(income_total - total_spent, 2)

    return jsonify(
        {
            "summary": summary,
            "income_total": income_total,
            "total_spent": total_spent,
            "savings_total": savings_total,
            "from": from_date,
            "to": to_date,
        }
    )


@savings_api_bp.route("/api/savings", methods=["GET"])
@jwt_required()
def api_get_savings():
    user_id = int(get_jwt_identity())
    data = get_savings_data(user_id)
    goals = SavingsGoal.query.filter_by(user_id=user_id).all()
    goal_data_map = get_goal_data_map([goal.goal_id for goal in goals])

    goals_data = []
    for goal in goals:
        gd = goal_data_map.get(goal.goal_id, {"current_amount": 0, "is_completed": False})
        current_amount = gd["current_amount"]
        progress = min(round((current_amount / goal.target_amount) * 100, 1), 100) if goal.target_amount > 0 else 0
        goals_data.append({
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": current_amount,
            "is_completed": gd["is_completed"],
            "deadline": goal.deadline,
            "progress": progress,
        })

    return jsonify({**data, "goals": goals_data})


@savings_api_bp.route("/api/savings/goals", methods=["GET"])
@jwt_required()
def api_get_goals():
    user_id = int(get_jwt_identity())
    goals = SavingsGoal.query.filter_by(user_id=user_id).order_by(SavingsGoal.goal_id.asc()).all()
    goal_data_map = get_goal_data_map([goal.goal_id for goal in goals])

    goals_data = []
    for goal in goals:
        gd = goal_data_map.get(goal.goal_id, {"current_amount": 0, "is_completed": False})
        current_amount = gd["current_amount"]
        progress = min(round((current_amount / goal.target_amount) * 100, 1), 100) if goal.target_amount > 0 else 0
        goals_data.append({
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": current_amount,
            "is_completed": gd["is_completed"],
            "deadline": goal.deadline,
            "progress": progress,
        })

    return jsonify({"goals": goals_data}), 200


@savings_api_bp.route("/api/savings/goals", methods=["POST"])
@jwt_required()
def api_create_goal():
    user_id = int(get_jwt_identity())
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

    ensure_current_amount_column()
    db.session.execute(
        text("UPDATE savings_goal SET current_amount = 0 WHERE goal_id = :goal_id"),
        {"goal_id": goal.goal_id},
    )
    db.session.commit()

    return jsonify(
        {
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": 0,
            "deadline": goal.deadline,
            "progress": 0,
        }
    ), 201


@savings_api_bp.route("/api/savings/goals/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def api_delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted"}), 200


@savings_api_bp.route("/api/savings/goals/<int:goal_id>/complete", methods=["POST"])
@jwt_required()
def api_complete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    ensure_extra_columns()
    db.session.execute(
        text("UPDATE savings_goal SET is_completed = 1 WHERE goal_id = :goal_id AND user_id = :user_id"),
        {"goal_id": goal_id, "user_id": user_id},
    )
    db.session.commit()
    return jsonify({"message": "Goal marked as completed"}), 200


@savings_api_bp.route("/api/savings/goals/<int:goal_id>/fund", methods=["POST"])
@jwt_required()
def api_add_fund(goal_id):
    user_id = int(get_jwt_identity())
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json() or {}
    amount = data.get("amount")

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    if amount_value <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400

    ensure_current_amount_column()
    db.session.execute(
        text(
            """
            UPDATE savings_goal
            SET current_amount = ROUND(COALESCE(current_amount, 0) + :amount, 2)
            WHERE goal_id = :goal_id AND user_id = :user_id
            """
        ),
        {"amount": amount_value, "goal_id": goal_id, "user_id": user_id},
    )
    db.session.commit()

    current_amount = db.session.execute(
        text("SELECT COALESCE(current_amount, 0) AS current_amount FROM savings_goal WHERE goal_id = :goal_id"),
        {"goal_id": goal_id},
    ).mappings().first()["current_amount"]
    progress = min(round((float(current_amount) / goal.target_amount) * 100, 1), 100) if goal.target_amount > 0 else 0

    return jsonify(
        {
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": float(current_amount),
            "deadline": goal.deadline,
            "progress": progress,
        }
    ), 200


@savings_api_bp.route("/api/savings/goals/<int:goal_id>/remove-fund", methods=["POST"])
@jwt_required()
def api_remove_fund(goal_id):
    user_id = int(get_jwt_identity())
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=user_id).first()

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json() or {}
    amount = data.get("amount")

    try:
        amount_value = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a valid number"}), 400

    if amount_value <= 0:
        return jsonify({"error": "Amount must be greater than zero"}), 400

    ensure_current_amount_column()
    
    # Get current amount to check if there's enough to remove
    current_amount_row = db.session.execute(
        text("SELECT COALESCE(current_amount, 0) AS current_amount FROM savings_goal WHERE goal_id = :goal_id"),
        {"goal_id": goal_id},
    ).mappings().first()
    current_amount = float(current_amount_row["current_amount"])
    
    if amount_value > current_amount:
        return jsonify({"error": f"Cannot remove more than the current amount ({current_amount})"}), 400
    
    db.session.execute(
        text(
            """
            UPDATE savings_goal
            SET current_amount = ROUND(COALESCE(current_amount, 0) - :amount, 2)
            WHERE goal_id = :goal_id AND user_id = :user_id
            """
        ),
        {"amount": amount_value, "goal_id": goal_id, "user_id": user_id},
    )
    db.session.commit()

    current_amount = db.session.execute(
        text("SELECT COALESCE(current_amount, 0) AS current_amount FROM savings_goal WHERE goal_id = :goal_id"),
        {"goal_id": goal_id},
    ).mappings().first()["current_amount"]
    progress = min(round((float(current_amount) / goal.target_amount) * 100, 1), 100) if goal.target_amount > 0 else 0

    return jsonify(
        {
            "id": goal.goal_id,
            "title": goal.title,
            "target_amount": goal.target_amount,
            "current_amount": float(current_amount),
            "deadline": goal.deadline,
            "progress": progress,
        }
    ), 200
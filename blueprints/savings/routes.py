from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Income, Expense, Bill, SavingsGoal
from utils import login_required

savings_bp = Blueprint("savings", __name__)

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

@savings_bp.route("/savings", methods=["GET", "POST"])
@login_required
def savings_view():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        target_amount = request.form.get("target_amount", "").strip()
        deadline = request.form.get("deadline", "").strip()

        if not title or not target_amount:
            flash("Title and target amount are required.", "error")
            return redirect(url_for("savings.savings_view"))

        try:
            target_value = float(target_amount)
        except ValueError:
            flash("Target amount must be a valid number.", "error")
            return redirect(url_for("savings.savings_view"))

        goal = SavingsGoal(
            title=title,
            target_amount=target_value,
            deadline=deadline or None,
            user_id=session["user_id"]
        )
        db.session.add(goal)
        db.session.commit()
        flash("Savings goal added.", "success")
        return redirect(url_for("savings.savings_view"))

    data = get_savings_data(session["user_id"])
    goals = SavingsGoal.query.filter_by(user_id=session["user_id"]).all()

    # calculate progress toward each goal
    for goal in goals:
        if data["savings"] > 0:
            goal.progress = min(round((data["savings"] / goal.target_amount) * 100, 1), 100)
        else:
            goal.progress = 0

    return render_template("savings.html", **data, goals=goals)


@savings_bp.route("/savings/delete/<int:goal_id>", methods=["POST"])
@login_required
def delete_goal(goal_id):
    goal = SavingsGoal.query.filter_by(goal_id=goal_id, user_id=session["user_id"]).first()
    if goal:
        db.session.delete(goal)
        db.session.commit()
        flash("Goal deleted.", "success")
    return redirect(url_for("savings.savings_view"))
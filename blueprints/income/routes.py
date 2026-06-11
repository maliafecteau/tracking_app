from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Income
from utils import login_required

income_bp = Blueprint("income", __name__)

@income_bp.route("/income", methods=["GET", "POST"])#route for the income page, allows both GET and POST requests, requires login
@login_required
def income_view():
    if request.method == "POST":
        amount = request.form.get("amount", "").strip()
        date = request.form.get('date', "").strip()

        if not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("income.income_view"))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("income.income_view"))

        income = Income(
            amount=amount_value,
            date=date,
            user_id=session["user_id"],
        )
        db.session.add(income)
        db.session.commit()

        flash("Income added successfully.", "success")
        return redirect(url_for("income.income_view"))

    incomes = Income.query.filter_by(user_id=session["user_id"]).all()
    return render_template("income.html", incomes=incomes)

@income_bp.route("/income/edit/<int:income_id>", methods=["GET", "POST"])
@login_required
def edit_income(income_id):
    income = Income.query.filter_by(income_id=income_id, user_id=session["user_id"]).first()
    if not income:
        flash("Income not found.", "error")
        return redirect(url_for("income.income_view"))
    
    if request.method == "POST":
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("income.edit_income", income_id=income_id))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("income.edit_income", income_id=income_id))
        
        income.amount = amount_value
        income.date = date
        db.session.commit()
        flash("Income updated successfully.", "success")
        return redirect(url_for("income.income_view"))
    incomes = Income.query.filter_by(user_id=session["user_id"]).all()
    return render_template("income.html", incomes=incomes, edit_income=income)

@income_bp.route("/income/delete/<int:income_id>", methods=["POST"])
@login_required
def delete_income(income_id):
    income = Income.query.filter_by(income_id=income_id, user_id=session["user_id"]).first()
    if income:
        db.session.delete(income)
        db.session.commit()
        flash("Income deleted successfully.", "success")
    return redirect(url_for("income.income_view"))
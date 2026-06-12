from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Expense
from utils import login_required

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("/expenses", methods=["GET", "POST"])#route for the expenses page, allows both GET and POST requests, requires login
@login_required
def expenses_view():
    if request.method == "POST":
        description = request.form.get("description", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not description or not amount or not date:#validate that all fields are filled out, if not show error message and redirect back to expenses page
            flash("All fields are required.", "error")
            return redirect(url_for("expenses.expenses_view"))

        try:
            amount_value = float(amount)#validate that amount is a valid number, if not show error message and redirect back to expenses page
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("expenses.expenses_view"))

        expense = Expense(
            description=description,
            amount=amount_value,
            date=date,
            user_id=session["user_id"]#associate the expense with the currently logged in user
        )
        db.session.add(expense)
        db.session.commit()#save the new expense to the database

        flash("Expense added successfully.", "success") # show success message and redirect back to expenses page
        return redirect(url_for("expenses.expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and no expense being edited

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()
    return render_template("expenses.html", expenses=expenses, edit_expense=None)#fetch all expenses for the current user and render the expenses page with the list of expenses and no expense being edited

@expenses_bp.route("/expenses/edit/<int:expense_id>", methods=["GET", "POST"])#route for editing an expense, allows both GET and POST requests, requires login
@login_required
def edit_expense(expense_id):
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=session["user_id"]).first()
    if not expense:
        flash("Expense not found.", "error")
        return redirect(url_for("expenses.expenses_view"))

    if request.method == "POST":
        description = request.form.get("description", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not description or not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("expenses.edit_expense", expense_id=expense_id))

        try:
            amount_value = float(amount)#
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("expenses.edit_expense", expense_id=expense_id))#validate that amount is a valid number, if not show error message and redirect back to edit expense page

        expense.description = description
        expense.amount = amount_value
        expense.date = date
        db.session.commit()
        flash("Expense updated successfully.", "success")
        return redirect(url_for("expenses.expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and the edited expense being passed to the template for pre-filling the form fields

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()
    return render_template("expenses.html", expenses=expenses, edit_expense=expense)

@expenses_bp.route("/expenses/delete/<int:expense_id>", methods=["POST"])#route for deleting an expense, allows only POST requests, requires login
@login_required
def delete_expense(expense_id):
    global expenses
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=session["user_id"]).first()#fetch the expense to be deleted, ensuring it belongs to the current user
    if not expense:
        flash("Expense not found.", "error")
        return redirect(url_for("expenses.expenses_view"))
    if expense:
        db.session.delete(expense)
        db.session.commit()
        flash("Expense deleted successfully.", "success")
    return redirect(url_for("expenses.  expenses_view"))# after deleting the expense, redirect back to the expenses page to show the updated list of expenses

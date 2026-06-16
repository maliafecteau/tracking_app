from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Expense, Bill
from utils import login_required
from datetime import datetime

expenses_bp = Blueprint("expenses", __name__)

@expenses_bp.route("/expenses", methods=["GET"])
@login_required
def expenses_view():
    expenses = Expense.query.filter_by(user_id=session["user_id"]).all() # fetch all expenses for the current user from the database using user id
    bills = Bill.query.filter_by(user_id=session["user_id"]).all() # fetch all bills for the current user from the database using user id

    merged = []
    for item in expenses:
        merged.append({
            "type": "expense",
            "id": item.ex_id,
            "description": item.description,
            "amount": item.amount,
            "date": item.date,
        })
    for item in bills:
        merged.append({
            "type": "bill",
            "id": item.bill_id,
            "description": item.title,
            "amount": item.amount,
            "date": item.day_due,
        })

    return render_template( # render the expenses page and fills in the variables for expenses, bills, and merged with the user's data from database
        "expenses.html",
        expenses=expenses,
        bills=bills,
        merged=merged,
        edit_expense=None, # no expense is being edited, so this is set to None
        edit_bill=None, # no bill is being edited, so this is set to None
    )

@expenses_bp.route("/expenses/add-expense", methods=["POST"]) # route for adding a new expense, only accepts POST requests
@login_required # login is required
def add_expense():
    description = request.form.get("description", "").strip()
    amount = request.form.get("amount", "").strip()
    date = request.form.get("date", "").strip()

    if not description or not amount or not date:
        flash("All fields are required.", "error")
        return redirect(url_for("expenses.expenses_view"))

    try:
        amount_value = float(amount) # validate that the amount is a valid number
        date_value = datetime.strptime(date, "%Y-%m-%d") # validate that the date is a valid date
    except ValueError:
        flash("Amount must be a valid number and date must be in YYYY-MM-DD format.", "error") # if not show error message and redirect back to expenses page
        return redirect(url_for("expenses.expenses_view"))

    expense = Expense(
        description=description,
        amount=amount_value,
        date=date_value,
        user_id=session["user_id"]#associate the expense with the currently logged in user
    )
    db.session.add(expense)
    db.session.commit()#save the new expense to the database

    flash("Expense added successfully.", "success") # show success message and redirect back to expenses page
    return redirect(url_for("expenses.expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and no expense being edited

@expenses_bp.route("/expenses/edit-expense/<int:expense_id>", methods=["GET", "POST"])
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
            amount_value = float(amount)
            date_value = datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            flash("Amount must be a valid number and date must be in YYYY-MM-DD format.", "error")
            return redirect(url_for("expenses.edit_expense", expense_id=expense_id))#validate that amount is a valid number and date is in correct format, if not show error message and redirect back to edit expense page

        expense.description = description
        expense.amount = amount_value
        expense.date = date_value
        db.session.commit()
        flash("Expense updated successfully.", "success")
        return redirect(url_for("expenses.expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and the edited expense being passed to the template for pre-filling the form fields

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all() 
    bills = Bill.query.filter_by(user_id=session["user_id"]).all()

    merged = []
    for item in expenses:
        merged.append({
            "type": "expense",
            "id": item.ex_id,
            "description": item.description,
            "amount": item.amount,
            "date": item.date,
        })
    for item in bills:
        merged.append({
            "type": "bill",
            "id": item.bill_id,
            "description": item.title,
            "amount": item.amount,
            "date": item.day_due,
        })

    return render_template(
        "expenses.html",
        expenses=expenses,
        bills=bills,
        merged=merged,
        edit_expense=expense,
        edit_bill=None,
    )

@expenses_bp.route("/expenses/delete-expense/<int:expense_id>", methods=["POST"])
@login_required
def delete_expense(expense_id):
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=session["user_id"]).first() # fetch the expense to be deleted, ensuring it belongs to the current user for security reasons
    if not expense:
        flash("Expense not found.", "error")
        return redirect(url_for("expenses.expenses_view"))
    
    db.session.delete(expense)
    db.session.commit()
    flash("Expense deleted successfully.", "success")
    return redirect(url_for("expenses.expenses_view"))

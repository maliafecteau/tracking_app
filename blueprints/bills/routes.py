from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Bill, Expense
from utils import login_required
from datetime import datetime

bills_bp = Blueprint("bills", __name__)

@bills_bp.route("/bills", methods=["GET", "POST"])# route for the bills page, allows both GET and POST requests, requires login
@login_required
def bills_view():
    # Redirect to expenses page where bills are now managed
    return redirect(url_for("expenses.expenses_view"))

@bills_bp.route("/bills/add-bill", methods=["POST"]) # route for adding a new bill, only eccepts POST requests
@login_required # requires login
def add_bill():
    title = request.form.get("title", "").strip()
    amount = request.form.get("amount", "").strip()
    day_due = request.form.get("day_due", "").strip()
    is_recurring = request.form.get("is_recurring") == "on" # checkbox returns "on" if checked, otherwise it will be None or empty string

    if not title or not amount or not day_due: # if missing any required fields, show error message
        flash("All fields are required.", "error")
        return redirect(url_for("expenses.expenses_view")) # and redirect back to expenses page where bills are now managed

    try:
        amount_value = float(amount) # validate that money amount is a valid number
        day_due_value = datetime.strptime(day_due, "%Y-%m-%d").date() # validate that the day due is a valid date
    except ValueError:
        flash("Amount must be a valid number and day due must be a valid date (YYYY-MM-DD).", "error")
        return redirect(url_for("expenses.expenses_view"))

    bill = Bill(
        title=title,
        amount=amount_value,
        day_due=day_due_value,
        is_recurring=is_recurring,
        user_id=session["user_id"]
    )
    db.session.add(bill)
    db.session.commit()

    flash("Bill added successfully.", "success")
    return redirect(url_for("expenses.expenses_view"))

@bills_bp.route("/bills/edit-bill/<int:bill_id>", methods=["GET", "POST"]) # route for editing an existing bill, accepts both GET and POST requests, requires login
@login_required
def edit_bill(bill_id):
    bill = Bill.query.filter_by(bill_id=bill_id, user_id=session["user_id"]).first() # query the database for the bill with the given bill_id that belongs to the current user, if not found it will return None
    if not bill:
        flash("Bill not found.", "error")
        return redirect(url_for("expenses.expenses_view"))
    
    if request.method == "POST": # if the request method is POST, it means the user has submitted the form to update the bill, so we need to process the form data and update the bill in the database
        title = request.form.get("title", "").strip()
        amount = request.form.get("amount", "").strip()
        day_due = request.form.get("day_due", "").strip()
        is_recurring = request.form.get("is_recurring") == "on"

        if not title or not amount or not day_due:
            flash("All fields are required.", "error")
            return redirect(url_for("bills.edit_bill", bill_id=bill_id))
        try:
            amount_value = float(amount)
            day_due_value = datetime.strptime(day_due, "%Y-%m-%d").date()# validate that the day due is a valid date
        except ValueError:
            flash("Amount must be a valid number and day due must be a valid date (YYYY-MM-DD).", "error")# if validation fails, show error message and redirect back to the edit bill page for the same bill
            return redirect(url_for("bills.edit_bill", bill_id=bill_id))

        bill.title = title
        bill.amount = amount_value
        bill.day_due = day_due_value
        bill.is_recurring = is_recurring
        db.session.commit()
        flash("Bill updated successfully.", "success")
        return redirect(url_for("expenses.expenses_view"))# after successfully updating the bill, redirect back to the expenses page where bills are now managed
    
    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()# query the database for all expenses that belong to the current user, we will merge them together with the bills into a single list so we can display them in chronological order on the expenses page, we will also pass the bill we are currently editing to the template so it can pre-fill the form with the existing bill data
    bills = Bill.query.filter_by(user_id=session["user_id"]).all()# query the database for all expenses and bills that belong to the current user, then we will merge them together into a single list so we can display them in chronological order on the expenses page, we will also pass the bill we are currently editing to the template so it can pre-fill the form with the existing bill data

    merged = []# create an empty list to hold the merged expenses and bills, we will add a "type" field to each item so the template can tell them apart when displaying them in chronological order on the expenses page, we will also pass the bill we are currently editing to the template so it can pre-fill the form with the existing bill data
    for expense in expenses:
        merged.append({
            "type": "expense",
            "id": expense.ex_id,
            "description": expense.description,
            "amount": expense.amount,
            "date": expense.date,
        })
    for bill_item in bills:# we use bill_item as the loop variable name instead of bill to avoid confusion with the bill variable that holds the bill we are currently editing, we will add a "type" field to each item so the template can tell them apart when displaying them in chronological order on the expenses page, we will also pass the bill we are currently editing to the template so it can pre-fill the form with the existing bill data
        merged.append({
            "type": "bill",
            "id": bill_item.bill_id,
            "description": bill_item.title,
            "amount": bill_item.amount,
            "date": bill_item.day_due,
        })

    return render_template( # render the expenses.html template and pass in the merged list of expenses and bills, as well as the bill we are currently editing so it can pre-fill the form with the existing bill data
        "expenses.html",
        expenses=expenses,
        bills=bills,
        merged=merged,
        edit_expense=None,
        edit_bill=bill,
    )
    
@bills_bp.route("/bills/delete-bill/<int:bill_id>", methods=["POST"])# route for deleting a bill, only accepts POST requests, requires login, only allows deleting non-recurring bills for safety reasons, if the bill is recurring we will show an error message and not delete it, if the bill is not found we will also show an error message, after successfully deleting the bill we will redirect back to the expenses page where bills are now managed
@login_required
def delete_bill(bill_id):
    bill = Bill.query.filter_by(bill_id=bill_id, is_recurring=False, user_id=session["user_id"]).first()
    if not bill:
        flash("Bill not found or cannot be deleted because it is recurring.", "error")
        return redirect(url_for("expenses.expenses_view"))
    
    db.session.delete(bill)
    db.session.commit()
    flash("Bill deleted successfully.", "success")
    return redirect(url_for("expenses.expenses_view"))
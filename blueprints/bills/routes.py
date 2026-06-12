from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Bill
from utils import login_required
from datetime import datetime

bills_bp = Blueprint("bills", __name__)

bills_bp.route("/bills", methods=["GET", "POST"])#route for the bills page, allows both GET and POST requests, requires login
@login_required
def bills_view():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        amount = request.form.get("amount", "").strip()
        day_due = request.form.get("day_due", "").strip()
        is_recurring = request.form.get("is_recurring") == "on"

        if not title or not amount or not day_due:
            flash("All fields are required.", "error")
            return redirect(url_for("bills.bills_view"))
        
        try:
            amount_value = float(amount)
            day_due_value = int(day_due)
            if day_due_value < 1 or day_due_value > 31:
                raise ValueError("Day due must be between 1 and 31.")
        except ValueError:
            flash("Amount must be a valid number and day due must be an integer between 1 and 31.", "error")
            return redirect(url_for("bills.bills_view"))
        
        expense = Bill(
            title=title,
            amount=amount_value,
            day_due=day_due_value,
            is_recurring=is_recurring,
            user_id=session["user_id"]
        )
        db.session.add(expense)
        db.session.commit()

        flash("Bill added successfully.", "success")
        return redirect(url_for("bills.bills_view"))
    
    bills = Bill.query.filter_by(user_id=session["user_id"]).all()
    return render_template("bills.html", bills=bills, edit_bill=None)

@bills_bp.route("/bills/edit/<int:bill_id>", methods=["GET", "POST"])#route for editing a bill, allows both GET and POST requests, requires login
@login_required
def edit_bill(bill_id):
    bill = Bill.query.filter_by(bill_id=bill_id, user_id=session["user_id"]).first()
    if not bill:
        flash("Bill not found.", "error")
        return redirect(url_for("bills.bills_view"))
    
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        amount = request.form.get("amount", "").strip()
        day_due = request.form.get("day_due", "").strip()
        is_recurring = request.form.get("is_recurring") == "on"

        if not title or not amount or not day_due:
            flash("All fields are required.", "error")
            return redirect(url_for("bills.edit_bill", bill_id=bill_id))
        try:
            amount_value = float(amount)
            day_due_value = int(day_due)
            if day_due_value < 1 or day_due_value > 31:
                raise ValueError("Day due must be between 1 and 31.")
        except ValueError:
            flash("Amount must be a valid number and day due must be an integer between 1 and 31.", "error")
            return redirect(url_for("bills.edit_bill", bill_id=bill_id))

        bill.title = title
        bill.amount = amount_value
        bill.day_due = day_due_value
        bill.is_recurring = is_recurring
        db.session.commit()
        flash("Bill updated successfully.", "success")
        return redirect(url_for("bills.bills_view"))
    bills = Bill.query.filter_by(user_id=session["user_id"]).all()
    return render_template("bills.html", bills=bills, edit_bill=bill)
    
@bills_bp.route("/bills/delete/<int:bill_id>", methods=["POST"])#route for deleting a bill, allows only POST requests, requires login
@login_required
def delete_bill(bill_id):
    bill = Bill.query.filter_by(bill_id=bill_id, is_recurring=False, user_id=session["user_id"]).first()
    if not bill:
        flash("Bill not found or cannot be deleted because it is recurring.", "error")
        return redirect(url_for("bills.bills_view"))
    if bill:
        db.session.delete(bill)
        db.session.commit()
        flash("Bill deleted successfully.", "success")
    return redirect(url_for("bills.bills_view"))
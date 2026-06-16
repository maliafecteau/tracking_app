from flask import Blueprint, render_template, redirect, url_for, session, flash
from services.bank_service import get_accounts, get_transactions, categorise_transaction
from models import db, Income, Expense
from utils import login_required
from datetime import datetime

bank_bp = Blueprint("bank", __name__)

@bank_bp.route("/bank",)
@login_required
def bank_view():
    accounts = get_accounts()
    transactions = get_transactions()

    for t in transactions:
        t["type"] = categorise_transaction(t)

    return render_template("bank.html", accounts=accounts, transactions=transactions)

@bank_bp.route("/bank/import", methods=["POST"]) #
@login_required
def import_transactions():#
    transactions = get_transactions()
    imported = 0
    skipped = 0 

    for t in transactions:
        amount = t.get("amount", 0)
        date = t.get("date", "")[:10]
        external_id = t.get("_id")

        if amount > 0:
            #cheking for duplicates
            exists = Income.query.filter_by(external_id=external_id).first()
            if not exists:
                income = Income(
                    amount=amount,
                    date=date,
                    user_id=session["user_id"],
                    source="bank_api",
                    external_id=external_id 
                )
                db.session.add(income)
                imported += 1
            else:
                skipped += 1
        else:
            exists = Expense.query.filter_by(external_id=external_id).first()
            if not exists:
                expense = Expense(
                    description=t.get("description", "Bank transaction"),
                    amount=abs(amount),
                    date=date,
                    user_id=session["user_id"],
                    source="bank_api",
                    external_id=external_id
                )
                db.session.add(expense)
                imported += 1
            else:
                skipped += 1
    
    db.session.commit()
    flash(f"{imported} transactions imported, {skipped} already existed", "success")
    return redirect(url_for("bank.bank_view"))
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.bank_service import get_accounts, get_transactions, categorise_transaction
from models import db, Income, Expense

bank_api_bp = Blueprint("bank_api", __name__)

@bank_api_bp.route("/api/bank/accounts", methods=["GET"])
@jwt_required()
def api_get_accounts():
    accounts = get_accounts()
    return jsonify(accounts)


@bank_api_bp.route("/api/bank/transactions", methods=["GET"])
@jwt_required()
def api_get_transactions():
    transactions = get_transactions()
    for t in transactions:
        t["type"] = categorise_transaction(t)
    return jsonify(transactions)


@bank_api_bp.route("/api/bank/import", methods=["POST"])
@jwt_required()
def api_import_transactions():
    user_id = get_jwt_identity()
    transactions = get_transactions()
    imported = 0
    skipped = 0

    with db.session.no_autoflush:
        for t in transactions:
            amount = t.get("amount", 0)
            date = t.get("date", "")[:10]
            external_id = t.get("_id")

            if amount > 0:
                exists = Income.query.filter_by(external_id=external_id).first()
                if not exists:
                    income = Income(amount=amount, date=date, user_id=user_id, source="bank_api", external_id=external_id)
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
                        user_id=user_id,
                        source="bank_api",
                        external_id=external_id
                    )
                    db.session.add(expense)
                    imported += 1
                else:
                    skipped += 1

    db.session.commit()
    return jsonify({"imported": imported, "skipped": skipped}), 200
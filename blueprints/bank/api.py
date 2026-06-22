from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.bank_service import get_accounts, get_transactions, categorise_transaction, clean_description, get_akahu_category
from models import db, Income, Expense
from models import db, Income, Expense

bank_api_bp = Blueprint("bank_api", __name__)

@bank_api_bp.route("/api/bank/accounts", methods=["GET"])
@jwt_required()
def api_get_accounts():
    try:
        accounts = get_accounts()
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    return jsonify(accounts)


@bank_api_bp.route("/api/bank/transactions", methods=["GET"])
@jwt_required()
def api_get_transactions():
    try:
        transactions = get_transactions()
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500

    for t in transactions:
        t["type"] = categorise_transaction(t)
        t["clean_description"] = clean_description(t)
        t["category"] = get_akahu_category(t)
    return jsonify(transactions)


@bank_api_bp.route("/api/bank/import", methods=["POST"])
@jwt_required()
def api_import_transactions():
    user_id = int(get_jwt_identity())
    try:
        transactions = get_transactions()
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
    imported = 0
    skipped = 0

    with db.session.no_autoflush:
        for t in transactions:
            amount = t.get("amount", 0)
            date = t.get("date", "")[:10]
            external_id = t.get("_id")
            description = clean_description(t)

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
                    category = get_akahu_category(t)
                    expense = Expense(
                        description=description,
                        amount=abs(amount),
                        date=date,
                        user_id=user_id,
                        source="bank_api",
                        external_id=external_id,
                        category=category
                    )
                    db.session.add(expense)
                    imported += 1
                else:
                    skipped += 1

    db.session.commit()
    return jsonify({"imported": imported, "skipped": skipped}), 200
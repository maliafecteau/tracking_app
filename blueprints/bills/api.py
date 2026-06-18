from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Bill
from datetime import datetime

bills_api_bp = Blueprint("bills_api", __name__)

@bills_api_bp.route("/api/bills", methods=["GET"])
@jwt_required()
def api_get_bills():
    user_id = get_jwt_identity()
    bills = Bill.query.filter_by(user_id=user_id).all()
    today = datetime.today().day

    result = []
    for bill in bills:
        days_until = bill.day_due - today
        if days_until < 0:
            status = "overdue"
        elif days_until <= 7:
            status = "upcoming"
        else:
            status = "ok"

        result.append({
            "id": bill.bill_id,
            "title": bill.title,
            "amount": bill.amount,
            "day_due": bill.day_due,
            "is_recurring": bill.is_recurring,
            "status": status
        })

    return jsonify(result)


@bills_api_bp.route("/api/bills", methods=["POST"])
@jwt_required()
def api_create_bill():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get("title", "").strip()
    amount = data.get("amount")
    day_due = data.get("day_due")
    is_recurring = data.get("is_recurring", True)

    if not title or amount is None or day_due is None:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
        day_due_value = int(day_due)
        if not 1 <= day_due_value <= 31:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid amount or due day"}), 400

    bill = Bill(title=title, amount=amount_value, day_due=day_due_value, is_recurring=is_recurring, user_id=user_id)
    db.session.add(bill)
    db.session.commit()

    return jsonify({"id": bill.bill_id, "title": bill.title, "amount": bill.amount, "day_due": bill.day_due}), 201


@bills_api_bp.route("/api/bills/<int:bill_id>", methods=["PUT"])
@jwt_required()
def api_update_bill(bill_id):
    user_id = get_jwt_identity()
    bill = Bill.query.filter_by(bill_id=bill_id, user_id=user_id).first()

    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    data = request.get_json()
    title = data.get("title", "").strip()
    amount = data.get("amount")
    day_due = data.get("day_due")
    is_recurring = data.get("is_recurring", True)

    if not title or amount is None or day_due is None:
        return jsonify({"error": "All fields are required"}), 400

    try:
        amount_value = float(amount)
        day_due_value = int(day_due)
        if not 1 <= day_due_value <= 31:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid amount or due day"}), 400

    bill.title = title
    bill.amount = amount_value
    bill.day_due = day_due_value
    bill.is_recurring = is_recurring
    db.session.commit()

    return jsonify({"id": bill.bill_id, "title": bill.title, "amount": bill.amount, "day_due": bill.day_due})


@bills_api_bp.route("/api/bills/<int:bill_id>", methods=["DELETE"])
@jwt_required()
def api_delete_bill(bill_id):
    user_id = get_jwt_identity()
    bill = Bill.query.filter_by(bill_id=bill_id, user_id=user_id).first()

    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    db.session.delete(bill)
    db.session.commit()
    return jsonify({"message": "Bill deleted"}), 200
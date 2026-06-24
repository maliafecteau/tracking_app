from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category, Expense

categories_api_bp = Blueprint("categories_api", __name__)

# default system categories seeded for every user

SYSTEM_CATEGORIES = [
    {"name": "Food", "color": "#FF6B6B"},
    {"name": "Transport", "color": "#4ECDC4"},
    {"name": "Lifestyle", "color": "#45B7D1"},
    {"name": "Household", "color": "#96CEB4"},
    {"name": "Health", "color": "#88D8B0"},
    {"name": "Education", "color": "#FFEAA7"},
    {"name": "Entertainment", "color": "#DDA0DD"},
    {"name": "Shopping", "color": "#F0E68C"},
    {"name": "Other", "color": "#D3D3D3"},
]

@categories_api_bp.route("/api/categories", methods=["GET"])
@jwt_required()
def api_get_categories():
    user_id = int(get_jwt_identity())

    system = Category.query.filter_by(user_id=None).all()
    custom = Category.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": c.category_id,
        "name": c.name,
        "color": c.color,
        "is_custom": c.user_id is not None
    } for c in system + custom])

@categories_api_bp.route("/api/categories", methods=["POST"])
@jwt_required()
def api_create_category():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    name = data.get("name", "").strip()
    color = data.get("color", "#D3D3D3").strip()

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    existing = Category.query.filter_by(name=name, user_id=user_id).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 400

    category = Category(name=name, color=color, user_id=user_id)
    db.session.add(category)
    db.session.commit()

    return jsonify({
        "id": category.category_id,
        "name": category.name,
        "color": category.color,
        "is_custom": True
    }), 201


@categories_api_bp.route("/api/categories/<int:category_id>", methods=["DELETE"])
@jwt_required()
def api_delete_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(category_id=category_id, user_id=user_id).first()

    if not category:
        return jsonify({"error": "Category not found or cannot delete system category"}), 404

    Expense.query.filter_by(
        user_id=user_id,
        category=category.name
    ).update({"category": "Other"})

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200


@categories_api_bp.route("/api/expenses/<int:expense_id>/category", methods=["PUT"])
@jwt_required()
def api_update_expense_category(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=user_id).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    category_name = data.get("category", "").strip()
    if not category_name:
        return jsonify({"error": "Category name is required"}), 400

    expense.category = category_name
    db.session.commit()
    return jsonify({"id": expense.ex_id, "category": expense.category}), 200


@categories_api_bp.route("/api/categories/seed", methods=["POST"])
@jwt_required()
def api_seed_system_categories():
    for cat in SYSTEM_CATEGORIES:
        exists = Category.query.filter_by(name=cat["name"], user_id=None).first()
        if not exists:
            category = Category(
                name=cat["name"],
                color=cat["color"],
                user_id=None
            )
            db.session.add(category)
    db.session.commit()
    return jsonify({"message": "System categories seeded"}), 200
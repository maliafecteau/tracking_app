from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_api_bp = Blueprint("auth_api", __name__)

@auth_api_bp.route("/api/auth/register", methods=["POST"])
def api_register():
    print("Raw data:", request.data)
    print("Content type:", request.content_type)
    data = request.get_json(silent=True)
    print("Parsed JSON:", data)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400
   
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already associated with an account"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    
    user = User(name=name, email=email, password=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}),201

@auth_api_bp.route("/api/auth/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400
    
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"error": "All fields are required"}), 400

    user = User.query.filter(or_(User.name == username, User.email == username)).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}), 200
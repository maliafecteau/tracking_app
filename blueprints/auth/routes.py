from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/")#route for the index page
def index():
    if "user_id" in session:
        return redirect(url_for("auth.home"))
    return render_template("splashpage.html")#if user is not logged in, show splash page, otherwise redirect to home page


@auth_bp.route("/home")#route for the home page, requires login
def home():
    if "user_id" not in session:
        return redirect(url_for("auth.login"))
    return render_template("home.html")

@auth_bp.route("/login", methods=["GET", "POST"])#route for the login page, allows both GET and POST requests
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(name=username).first()# Query the database for a user with the provided username. If a user is found, it checks if the password matches. If the credentials are valid, it stores the user's ID in the session and redirects to the home page. If the credentials are invalid, it returns an error message.
        if user and check_password_hash(user.password, password):   
            session["user_id"] = user.id
            return redirect(url_for("auth.home"))#validate the user's credentials, if valid log the user in by storing their user ID in the session and redirect to the home page, if not valid show error message
        flash("Invalid username or password", "error")
        return redirect(url_for("auth.login"))
    return render_template("login.html")#if the request method is GET, render the login page

@auth_bp.route("/register", methods=["GET", "POST"])#route for the registration page, allows both GET and POST requests
def register():
    if request.method == "POST":# When a POST request is made to the register route, it retrieves the name, email, and password from the form data. It then checks if the email or username is already registered in the database and if the password meets the minimum length requirement. If any of these conditions are not met, it returns an appropriate error message. If all validations pass, it creates a new user, adds it to the database, commits the changes, stores the user's ID in the session, and redirects to the home page.
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if User.query.filter_by(email=email).first():# Check if the email is already registered in the database. If a user with the provided email exists, it returns an error message indicating that the email is already registered.
            flash("Email already registered", "error")
            return redirect(url_for("auth.register"))
        if User.query.filter_by(name=name).first():# Check if the username is already taken in the database. If a user with the provided username exists, it returns an error message indicating that the username is already taken.
            flash("Username already taken", "error")
            return redirect(url_for("auth.register"))
        if len(password) < 6:
            return "Password must be at least 6 characters long"#validate the registration form data, check if the email is already registered, if the username is already taken, and if the password meets the minimum length requirement, if any validation fails show an appropriate error message, if all validations pass create a new user account and log the user in by storing their user ID in the session and redirecting to the home page

        user = User(name=name, email=email, password=generate_password_hash(password)) # Create a new user instance with the provided name, email, and a hashed version of the password for security. The generate_password_hash function is used to hash the password before storing it in the database.
        db.session.add(user)
        db.session.commit()#save the new user to the database, log the user in by storing their user ID in the session and redirect to the home page

        session["user_id"] = user.id
        return redirect(url_for("auth.home"))

    return render_template("register.html")

@auth_bp.route("/logout")#route for logging out the user, allows only GET requests
def logout():
    session.pop("user_id", None)
    return redirect(url_for("auth.login"))

@auth_bp.route("/splashpage")
def splashpage():
    return render_template("splashpage.html")
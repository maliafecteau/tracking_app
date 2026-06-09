from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = "warnalia"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy()
db.init_app(app)


class User(db.Model):# User model for authentication
    id = db.Column(db.Integer, primary_key=True)# Unique identifier for each user
    name = db.Column(db.String(100), unique=True, nullable=False)#` Username of the user, must be unique and cannot be null`
    email = db.Column(db.String(120), unique=True, nullable=False)# Email of the user, must be unique and cannot be null
    password = db.Column(db.String(200), nullable=False)# Password of the user, cannot be null


def login_required(view):# Decorator to ensure that a user is logged in before accessing certain routes
    @wraps(view)
    def wrapped_view(*args, **kwargs):# Check if the user is logged in by verifying if "user_id" is in the session
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)# If the user is logged in, proceed to the original view function

    return wrapped_view


@app.route("/")
def index():# If the user is already logged in, redirect to the home page; otherwise, render the splash page
    if "user_id" in session:
        return redirect(url_for("home"))
    return render_template("splashpage.html")


@app.route("/home")
@login_required# The home route is protected by the login_required decorator, meaning only logged-in users can access it
def home():
    return render_template("home.html")


@app.route("/wishlist")# The wishlist route is also protected by the login_required decorator, ensuring that only authenticated users can access it
@login_required
def wishlist():
    return render_template("wishlist.html")


@app.route("/expenses")
@login_required# The expenses route is protected by the login_required decorator, ensuring that only authenticated users can access it
def expenses():
    return render_template("expenses.html")


@app.route("/login", methods=["GET", "POST"])
def login():# The login route handles both GET and POST requests. If the request method is POST, it processes the login form data; otherwise, it renders the login page
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(name=username).first()# Query the database for a user with the provided username. If a user is found, it checks if the password matches. If the credentials are valid, it stores the user's ID in the session and redirects to the home page. If the credentials are invalid, it returns an error message.
        if user and user.password == password:
            session["user_id"] = user.id
            return redirect(url_for("home"))

        return "Invalid username or password"

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])# The register route handles both GET and POST requests. If the request method is POST, it processes the registration form data; otherwise, it renders the registration page
def register():
    if request.method == "POST":# When a POST request is made to the register route, it retrieves the name, email, and password from the form data. It then checks if the email or username is already registered in the database and if the password meets the minimum length requirement. If any of these conditions are not met, it returns an appropriate error message. If all validations pass, it creates a new user, adds it to the database, commits the changes, stores the user's ID in the session, and redirects to the home page.
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if User.query.filter_by(email=email).first():# Check if the email is already registered in the database. If a user with the provided email exists, it returns an error message indicating that the email is already registered.
            return "Email already registered"
        if User.query.filter_by(name=name).first():# Check if the username is already taken in the database. If a user with the provided username exists, it returns an error message indicating that the username is already taken.
            return "Username already taken"
        if len(password) < 6:
            return "Password must be at least 6 characters long"

        user = User(name=name, email=email, password=password)
        db.session.add(user)
        db.session.commit()

        session["user_id"] = user.id
        return redirect(url_for("home"))

    return render_template("register.html")


@app.route("/logout")
def logout():# The logout route simply removes the "user_id" from the session, effectively logging the user out, and then redirects to the login page.
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/splashpage")
def splashpage():# The splashpage route renders the splash page template, which is likely the landing page for the application that provides an introduction or overview of the app's features and functionality.
    return render_template("splashpage.html")


if __name__ == "__main__":
    with app.app_context():# This line ensures that the application context is available when creating the database tables. It allows the `db.create_all()` function to access the necessary configuration and context to create the tables in the database.
        db.create_all()
    app.run(debug=True)
    
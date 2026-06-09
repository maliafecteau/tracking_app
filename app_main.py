from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = "warnalia"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    return wrapped_view


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("home"))
    return render_template("splashpage.html")


@app.route("/home")
@login_required
def home():
    return render_template("home.html")


@app.route("/wishlist")
@login_required
def wishlist():
    return render_template("wishlist.html")


@app.route("/expenses")
@login_required
def expenses():
    return render_template("expenses.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(name=username).first()
        if user and user.password == password:
            session["user_id"] = user.id
            return redirect(url_for("home"))

        return "Invalid username or password"

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        if User.query.filter_by(email=email).first():
            return "Email already registered"
        if User.query.filter_by(name=name).first():
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
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/splashpage")
def splashpage():
    return render_template("splashpage.html")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
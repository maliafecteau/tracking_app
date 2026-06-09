from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session, flash
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
    expenses = db.relationship("expenses", backref="user", lazy=True)

class Expense(db.Model):
    ex_id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

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


@app.route("/expenses", methods=["GET", "POST"])
@login_required
def expenses_view():
    if request.method == "POST":
        description = request.form.get("description", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not description or not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("expenses_view"))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("expenses_view"))

        expense = Expense(
            description=description,
            amount=amount_value,
            date=date,
            user_id=session["user_id"]
        )
        db.session.add(expense)
        db.session.commit()

        flash("Expense added successfully.", "success")
        return redirect(url_for("expenses_view"))

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()
    return render_template("expenses.html", expenses=expenses, edit_expense=None)


@app.route("/expenses/edit/<int:expense_id>", methods=["GET", "POST"])
@login_required
def edit_expense(expense_id):
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=session["user_id"]).first()
    if not expense:
        flash("Expense not found.", "error")
        return redirect(url_for("expenses_view"))

    if request.method == "POST":
        description = request.form.get("description", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not description or not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("edit_expense", expense_id=expense_id))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("edit_expense", expense_id=expense_id))

        expense.description = description
        expense.amount = amount_value
        expense.date = date
        db.session.commit()
        flash("Expense updated successfully.", "success")
        return redirect(url_for("expenses_view"))

    return render_template("expenses.html", expenses=expenses, edit_expense=expense)


@app.route("/expenses/delete/<int:expense_id>", methods=["POST"])
@login_required
def delete_expense(expense_id):
    global expenses
    expense = Expense.query.filter_by(id=expense_id, user_id=session["user_id"]).first()
    if expense:
        db.session.delete(expense)
        db.session.commit()
        flash("Expense deleted successfully.", "success")
    return redirect(url_for("expenses_view"))


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
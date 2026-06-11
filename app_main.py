from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
import traceback
import logging

app = Flask(__name__)
app.secret_key = "warnalia"

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tracking_app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy()
db.init_app(app)

class Income(db.Model): #database model for Income
    income_id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class Expense(db.Model): #db model for expense
    ex_id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class User(db.Model):#db model for user
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    expenses = db.relationship("Expense", backref="user", lazy=True)
    income = db.relationship('Income', backref="user", lazy=True)



def login_required(view):#decorator to ensure user is logged in before accessing certain routes
    @wraps(view)
    def wrapped_view(*args, **kwargs):#check if user_id is in session, if not redirect to login page
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)#if user is logged in, proceed to the requested view

    return wrapped_view


@app.route("/")#route for the index page
def index():
    if "user_id" in session:
        return redirect(url_for("home"))
    return render_template("splashpage.html")#if user is not logged in, show splash page, otherwise redirect to home page


@app.route("/home")#route for the home page, requires login
@login_required
def home():
    return render_template("home.html")


@app.route("/wishlist")#route for the wishlist page, requires login
@login_required
def wishlist():
    return render_template("wishlist.html")


@app.route("/expenses", methods=["GET", "POST"])#route for the expenses page, allows both GET and POST requests, requires login
@login_required
def expenses_view():
    if request.method == "POST":
        description = request.form.get("description", "").strip()
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not description or not amount or not date:#validate that all fields are filled out, if not show error message and redirect back to expenses page
            flash("All fields are required.", "error")
            return redirect(url_for("expenses_view"))

        try:
            amount_value = float(amount)#validate that amount is a valid number, if not show error message and redirect back to expenses page
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("expenses_view"))

        expense = Expense(
            description=description,
            amount=amount_value,
            date=date,
            user_id=session["user_id"]#associate the expense with the currently logged in user
        )
        db.session.add(expense)
        db.session.commit()#save the new expense to the database

        flash("Expense added successfully.", "success") # show success message and redirect back to expenses page
        return redirect(url_for("expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and no expense being edited

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()
    return render_template("expenses.html", expenses=expenses, edit_expense=None)#fetch all expenses for the current user and render the expenses page with the list of expenses and no expense being edited


@app.route("/expenses/edit/<int:expense_id>", methods=["GET", "POST"])#route for editing an expense, allows both GET and POST requests, requires login
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
            amount_value = float(amount)#
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("edit_expense", expense_id=expense_id))#validate that amount is a valid number, if not show error message and redirect back to edit expense page

        expense.description = description
        expense.amount = amount_value
        expense.date = date
        db.session.commit()
        flash("Expense updated successfully.", "success")
        return redirect(url_for("expenses_view"))# after handling POST request, fetch all expenses for the current user and render the expenses page with the list of expenses and the edited expense being passed to the template for pre-filling the form fields

    expenses = Expense.query.filter_by(user_id=session["user_id"]).all()
    return render_template("expenses.html", expenses=expenses, edit_expense=expense)


@app.route("/expenses/delete/<int:expense_id>", methods=["POST"])#route for deleting an expense, allows only POST requests, requires login
@login_required
def delete_expense(expense_id):
    global expenses
    expense = Expense.query.filter_by(ex_id=expense_id, user_id=session["user_id"]).first()#fetch the expense to be deleted, ensuring it belongs to the current user
    if expense:
        db.session.delete(expense)
        db.session.commit()
        flash("Expense deleted successfully.", "success")
    return redirect(url_for("expenses_view"))# after deleting the expense, redirect back to the expenses page to show the updated list of expenses

@app.route("/income", methods=["GET", "POST"])
@login_required
def income_view():
    if request.method == "POST":
        amount = request.form.get("amount", "").strip()
        date = request.form.get('date', "").strip()

        if not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("income_view"))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("income_view"))

        income = Income(
            amount=amount_value,
            date=date,
            user_id=session["user_id"],
        )
        db.session.add(income)
        db.session.commit()

        flash("Income added successfully.", "success")
        return redirect(url_for("income_view"))

    incomes = Income.query.filter_by(user_id=session["user_id"]).all()
    return render_template("income.html", incomes=incomes)

@app.route("/income/edit/<int:income_id>", methods=["GET", "POST"])
@login_required
def edit_income(income_id):
    income = Income.query.filter_by(income_id=income_id, user_id=session["user_id"]).first()
    if not income:
        flash("Income not found.", "error")
        return redirect(url_for("income_view"))
    
    if request.method == "POST":
        amount = request.form.get("amount", "").strip()
        date = request.form.get("date", "").strip()

        if not amount or not date:
            flash("All fields are required.", "error")
            return redirect(url_for("edit_income", income_id=income_id))

        try:
            amount_value = float(amount)
        except ValueError:
            flash("Amount must be a valid number.", "error")
            return redirect(url_for("edit_income", income_id=income_id))
        
        income.amount = amount_value
        income.date = date
        db.session.commit()
        flash("Income updated successfully.", "success")
        return redirect(url_for("income_view"))
    return render_template("edit_income.html", income=income)


@app.route("/income/delete/<int:income_id>", methods=["POST"])
@login_required
def delete_income(income_id):
    income = Income.query.filter_by(income_id=income_id, user_id=session["user_id"]).first()
    if income:
        db.session.delete(income)
        db.session.commit()
        flash("Income deleted successfully.", "success")
    return redirect(url_for("income_view"))

@app.route("/login", methods=["GET", "POST"])#route for the login page, allows both GET and POST requests
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = User.query.filter_by(name=username).first()# Query the database for a user with the provided username. If a user is found, it checks if the password matches. If the credentials are valid, it stores the user's ID in the session and redirects to the home page. If the credentials are invalid, it returns an error message.
        if user and user.password == password:
            session["user_id"] = user.id
            return redirect(url_for("home"))#validate the user's credentials, if valid log the user in by storing their user ID in the session and redirect to the home page, if not valid show error message
        return "Invalid username or password"

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])#route for the registration page, allows both GET and POST requests
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
            return "Password must be at least 6 characters long"#validate the registration form data, check if the email is already registered, if the username is already taken, and if the password meets the minimum length requirement, if any validation fails show an appropriate error message, if all validations pass create a new user account and log the user in by storing their user ID in the session and redirecting to the home page

        user = User(name=name, email=email, password=password)
        db.session.add(user)
        db.session.commit()#save the new user to the database, log the user in by storing their user ID in the session and redirect to the home page

        session["user_id"] = user.id
        return redirect(url_for("home"))

    return render_template("register.html")


@app.route("/logout")#route for logging out the user, allows only GET requests
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/splashpage")#route for the splash page, allows only GET requests
def splashpage():
    return render_template("splashpage.html")


if __name__ == "__main__":# when the application is run directly, create the database tables if they don't exist and start the Flask development server in debug mode
    with app.app_context():
        db.create_all()
    # Add a global exception handler to log tracebacks for debugging without debug mode
 #   @app.errorhandler(Exception)#
#    def handle_exception(e):
#        tb = traceback.format_exc()
#        logging.basicConfig(filename='error.log', level=logging.ERROR)
#        logging.error('Unhandled exception:\n%s', tb)
#        print('Unhandled exception logged to error.log')# log the full traceback of any unhandled exceptions to a file named error.log for debugging purposes, and print a message to the console indicating that the exception has been logged, then return a generic 500 Internal Server Error page to the user without exposing sensitive details about the error.
#        # return generic 500 page
#        return render_template('500.html'), 500

    app.run(debug=True)
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy() 

class Bill(db.Model): #database model for Bill
    bill_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    day_due = db.Column(db.Date, nullable=False)
    is_recurring = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class Income(db.Model): #database model for Income
    income_id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class Expense(db.Model): #db model for expense
    ex_id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

class User(db.Model):#db model for user
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    expenses = db.relationship("Expense", backref="user", lazy=True)
    income = db.relationship('Income', backref="user", lazy=True)
    bills = db.relationship('Bill', backref="user", lazy=True)
    savings_goals = db.relationship("SavingsGoal", backref="user", lazy=True)


class SavingsGoal(db.Model):
    goal_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    target_amount = db.Column(db.Float, nullable=False)
    deadline = db.Column(db.Date, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
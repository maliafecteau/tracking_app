from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy 

app = Flask(__name__)
app.secret_key = "warnalia"

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tracking_app.db'# Using SQLite for simplicity; change to your preferred database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False# Disable track modifications to save resources

db = SQLAlchemy(app)

class User(db.Model): #user model for registration and login
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

@app.route('/')
def index():
    if 'user_id' in session:
        return render_template('home.html')# If the user is logged in, show the home page
    return redirect(url_for('login'))# If the user is not logged in, redirect to the login page

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/wishlist')
def wishlist():
    return render_template('wishlist.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(name=username).first()# Check if the user exists in the database
        if user and user.password == password:# Verify the password
            session['user_id'] = user.id# Store the user's ID in the session to keep them logged in
            return redirect(url_for('home'))# Redirect to the home page after successful login
       
        return 'Invalid username or password' # Return an error message if login fails
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        if User.query.filter_by(email=email).first():
            return 'Email already registered' #email must be unique
        if User.query.filter_by(name=name).first():
            return 'Username already taken' #
        if len(password) < 6:
            return 'Password must be at least 6 characters long' #ensuring password strength
    
        user = User(name=name, email=email, password=password)# Create a new user instance with the provided data
        db.session.add(user)# Add the new user to the database session
        db.session.commit()# Save the new user to the database

        session['user_id'] = user.id# Store the user's ID in the session to keep them logged in
        return redirect(url_for('home'))# Redirect to the home page after successful registration
    
        # Process registration
        return f'Account created for {name}'
    return render_template('register.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
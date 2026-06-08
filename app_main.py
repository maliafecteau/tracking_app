from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

logged_in = False

if logged_in:
    @app.route('/')
    def home():
        return render_template('home.html')
else:
    @app.route('/')
    def splash():
        return render_template('splashpage.html')

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
        # Process login
        return f'Logged in as {username}'
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        # Process registration
        return f'Account created for {name}'
    return render_template('register.html')

@app.route('/logout')
def logout():
    global logged_in
    logged_in = False
    return redirect(url_for('login'))

@app.route('/expenses')
def expenses():
    return render_template('expenses.html')

@app.route('/splashpage')
def splashpage():
    return render_template('splashpage.html')

if __name__ == '__main__':
    app.run(debug=True)
    
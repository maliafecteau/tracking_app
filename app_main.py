from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

logged_in = False

if logged_in:
    @app.route('/')
    def home():
        return render_template('home.html')
else:
    @app.route('/')
    def login_redirect():
        return redirect(url_for('login'))

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

if __name__ == '__main__':
    app.run(debug=True)
    
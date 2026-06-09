from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.config["SECRET_KEY"] = "ChangeToBeMoreSecureInProductionPleaseFromFelix"
logged_in = False
expenses = []
next_expense_id = 1

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


@app.route('/expenses', methods=['GET', 'POST'])
def expenses_view():
    global next_expense_id

    if request.method == 'POST':
        description = request.form.get('description', '').strip()
        amount = request.form.get('amount', '').strip()
        date = request.form.get('date', '').strip()

        if not description or not amount or not date:
            flash('All fields are required.', 'error')
            return redirect(url_for('expenses_view'))

        try:
            amount_value = float(amount)
        except ValueError:
            flash('Amount must be a valid number.', 'error')
            return redirect(url_for('expenses_view'))

        expenses.append({
            'id': next_expense_id,
            'description': description,
            'amount': f'{amount_value:.2f}',
            'date': date,
        })
        next_expense_id += 1
        flash('Expense added successfully.', 'success')
        return redirect(url_for('expenses_view'))

    return render_template('expenses.html', expenses=expenses, edit_expense=None)


@app.route('/expenses/edit/<int:expense_id>', methods=['GET', 'POST'])
def edit_expense(expense_id):
    expense = next((item for item in expenses if item['id'] == expense_id), None)
    if not expense:
        flash('Expense not found.', 'error')
        return redirect(url_for('expenses_view'))

    if request.method == 'POST':
        description = request.form.get('description', '').strip()
        amount = request.form.get('amount', '').strip()
        date = request.form.get('date', '').strip()

        if not description or not amount or not date:
            flash('All fields are required.', 'error')
            return redirect(url_for('edit_expense', expense_id=expense_id))

        try:
            amount_value = float(amount)
        except ValueError:
            flash('Amount must be a valid number.', 'error')
            return redirect(url_for('edit_expense', expense_id=expense_id))

        expense['description'] = description
        expense['amount'] = f'{amount_value:.2f}'
        expense['date'] = date
        flash('Expense updated successfully.', 'success')
        return redirect(url_for('expenses_view'))

    return render_template('expenses.html', expenses=expenses, edit_expense=expense)


@app.route('/expenses/delete/<int:expense_id>', methods=['POST'])
def delete_expense(expense_id):
    global expenses
    expenses = [item for item in expenses if item['id'] != expense_id]
    flash('Expense deleted successfully.', 'success')
    return redirect(url_for('expenses_view'))


if __name__ == '__main__':
    app.run(debug=True)
    
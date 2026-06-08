# tracking_app

A Flask expense tracking app.

## Setup

1. Create a virtual environment:

   ```powershell
   python -m venv venv
   ```

2. Activate the virtual environment:

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. Upgrade pip and install dependencies:

   ```powershell
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

4. Run the app:

   ```powershell
   python app_main.py
   ```

## Notes

- The `requirements.txt` file lists the packages needed for this project.
- Do not commit the local `venv/` folder into version control.

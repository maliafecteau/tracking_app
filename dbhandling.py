from app import create_app
from models import db

app = create_app()
with app.app_context():
    with db.engine.connect() as conn:
        try:
            conn.execute(db.text("ALTER TABLE expense ADD COLUMN category VARCHAR(50) DEFAULT 'Other'"))
            conn.commit()
            print("Added category column to expense table.")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("Column already exists, skipping.")
            else:
                raise

open in vs code

requires a .env file to be made
akahu entries require a real token and api key provided by akahu
we cannot supply ours as it is connected to our real bank data
you may generate your own secret keys for log in purposes though

AKAHU_APP_TOKEN=
AKAHU_USER_TOKEN= 
SECRET_KEY=
JWT_SECRET_KEY=

Terminal 1:
pip install -r requirements.txt
app.py


Terminal 2:

cd frontend
npm install
npm run dev
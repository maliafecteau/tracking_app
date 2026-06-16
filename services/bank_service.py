import os
from wsgiref import headers 
import requests

AKAHU_BASE_URL = "https://api.akahu.io/v1"
APP_TOKEN = os.environ.get("AKAHU_APP_TOKEN")# we will use this to authenticate our requests to the Akahu API, we will store it in an environment variable for security reasons, you can set it in a .env file in the root of your project with the name AKAHU_APP_TOKEN and the value of your app token, then we can load it using the python-dotenv library, make sure to install it with pip install python-dotenv and import load_dotenv from dotenv at the top of this file, then call load_dotenv() before trying to access the environment variable, this will allow us to keep our app token secret and not hardcode it in our code
USER_TOKEN = os.environ.get("AKAHU_USER_TOKEN") #

def get_headers():# function to get the headers for our requests to the Akahu API, we need to include the app token and user token in the headers for authentication, we will use this function whenever we make a request to the Akahu API to ensure we have the correct headers
    return {
        "Authorization": f"Bearer {USER_TOKEN}",
        "X-AKAHU-ID": APP_TOKEN,
    }

def get_accounts(): # function to get the user's accounts from the Akahu API, we will use this to display the accounts on the dashboard and also to calculate the total income for the savings page
        response = requests.get(f"{AKAHU_BASE_URL}/accounts", headers=get_headers())
        if response.status_code == 200:
            return response.json().get("items", [])
        return []

def get_transactions():# function to get the user's transactions from the Akahu API, we will use this to display the transactions on the dashboard and also to calculate the total income and expenses for the savings page, we will also use the categorise_transaction function to categorise each transaction as either income or expense based on the amount, if the amount is greater than 0 it is income, otherwise it is an expense
     response = requests.get(f"{AKAHU_BASE_URL}/transactions", headers=get_headers())
     if response.status_code == 200:
         return response.json().get("items", [])    
     return []

def categorise_transaction(transactions): # function to categorise a transaction as either income or expense based on the amount, if the amount is greater than 0 it is income, otherwise it is an expense, we will use this function to help us calculate the total income and expenses for the savings page
    amount = transactions.get("amount", 0)
    if amount > 0:
         return "income"
    return "expense"


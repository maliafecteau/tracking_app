import os
import requests
import re

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
    raise RuntimeError(f"akahu accounts error {response.status_code}: {response.text}")

def get_transactions():# function to get the user's transactions from the Akahu API, we will use this to display the transactions on the dashboard and also to calculate the total income and expenses for the savings page, we will also use the categorise_transaction function to categorise each transaction as either income or expense based on the amount, if the amount is greater than 0 it is income, otherwise it is an expense
    response = requests.get(f"{AKAHU_BASE_URL}/transactions", headers=get_headers())
    if response.status_code == 200:
        return response.json().get("items", [])
    raise RuntimeError(f"akahu transactions error {response.status_code}: {response.text}")

def categorise_transaction(transactions): # function to categorise a transaction as either income or expense based on the amount, if the amount is greater than 0 it is income, otherwise it is an expense, we will use this function to help us calculate the total income and expenses for the savings page
    amount = transactions.get("amount", 0)
    if amount > 0:
         return "income"
    return "expense"


def clean_description(transaction): #cleaning up akahu transactions so they appear cleaner in the database
    #akahu also provides merchant infromation which can be cleaner than jsut the retailer
    #we prefere the merchant name if available
    merchant = transaction.get("merchant", {})
    if merchant and merchant.get("name"):
        return merchant["name"]

    #fall back on to cleaning the description if unavailable
    raw = transaction.get("description", "Unknown transaction")

    # strip card numbers 
    raw = re.sub(r"Card [Nn]umber:?\s*[\d\s\*]+", "", raw, flags=re.IGNORECASE)

    # strip currency converesion notes
    raw = re.sub(r"converted at.*", "", raw, flags=re.IGNORECASE)
    raw = re.sub(r"This includes a currency conversion.*", "", raw, flags=re.IGNORECASE)

    #collapse extra white space
    raw = re.sub(r"\s+"," ",raw).strip()

    #truncate if still too long
    if len(raw) > 60:
        raw = raw[:57] + "..."
        
    return raw or "Unknown transaction"

def get_akahu_category(transaction):
    category = transaction.get("category", {})
    if not category:
        return "Other"
    
    # prefer the personal_finance group name as it's cleaner
    groups = category.get("groups", {})
    personal_finance = groups.get("personal_finance", {})
    group_name = personal_finance.get("name")
    
    if group_name:
        return group_name
    
    # fall back to the raw category name if no group
    return category.get("name", "Other")

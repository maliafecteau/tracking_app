from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import db, Bill
from utils import login_required
from datetime import datetime

bills_bp = Blueprint("bills", __name__)
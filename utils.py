from functools import wraps
from flask import session, redirect, url_for
from flask_jwt_extended import verify_jwt_in_request , get_jwt_header , get_jwt_identity


def login_required(view):#decorator to ensure user is logged in before accessing certain routes
    @wraps(view)
    def wrapped_view(*args, **kwargs):#check if user_id is in session, if not redirect to login page
        if "user_id" not in session:
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)#if user is logged in, proceed to the requested view

    return wrapped_view

def jwt_required_custom(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            return{"error": "Unauthorized", "message": str(e)}, 401
        return view (*args, **kwargs)
    return wrapped_view
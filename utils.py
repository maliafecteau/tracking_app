from functools import wraps
from flask import session, redirect, url_for

def login_required(view):#decorator to ensure user is logged in before accessing certain routes
    @wraps(view)
    def wrapped_view(*args, **kwargs):#check if user_id is in session, if not redirect to login page
        if "user_id" not in session:
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)#if user is logged in, proceed to the requested view

    return wrapped_view
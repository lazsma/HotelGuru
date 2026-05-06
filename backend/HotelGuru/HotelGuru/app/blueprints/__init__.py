from apiflask import APIBlueprint
bp = APIBlueprint('main', __name__, tag="main")
from app.extensions import auth
from flask import current_app
from authlib.jose import jwt
from datetime import datetime
from apiflask import HTTPError
from functools import wraps

bp = APIBlueprint('main', __name__, tag="main")

@auth.verify_token
def verify_token(token):
    try:
        data = jwt.decode(
            token.encode('ascii'),
           
            current_app.config['SECRET_KEY'],
        )
        if data["exp"] < int(datetime.now().timestamp()):
            return None
        return data
    except Exception as ex:
        return None
    
def role_required(roles):
    @wraps(roles)
    def wrapper(fn):
        @wraps(fn)
        def decorated_function(*args, **kwargs):
            user_roles = [item["name"] for item in auth.current_user.get("roles")]
            for role in roles:
                if role in user_roles:
                    return fn(*args, **kwargs)        
            raise HTTPError(message="Access denied", status_code=403)
        return decorated_function
    return wrapper

# Register user
from app.blueprints.user import bp as bp_user
bp.register_blueprint(bp_user, url_prefix='/user')

# Register hotel
from app.blueprints.hotel import bp as bp_hotel
bp.register_blueprint(bp_hotel, url_prefix='/hotel')

# Register resevartion
from app.blueprints.reservation import bp as bp_reservation
bp.register_blueprint(bp_reservation, url_prefix='/reservation')

# Register room
from app.blueprints.room import bp as bp_room
bp.register_blueprint(bp_room, url_prefix='/room')

# Register admin
from app.blueprints.admin import bp as bp_admin
bp.register_blueprint(bp_admin, url_prefix='/admin')

# Register receptionist
from app.blueprints.receptionist import receptionist_bp
bp.register_blueprint(receptionist_bp, url_prefix='/receptionist')

from app.models import *
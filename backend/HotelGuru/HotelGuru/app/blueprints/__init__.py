from apiflask import APIBlueprint
bp = APIBlueprint('main', __name__, tag="main")

@bp.route('/')
def index():
    return 'This is The Main Blueprint'

# Register address

# Register hotel

# Register resevartion
from app.blueprints.reservation import bp as bp_reservation
bp.register_blueprint(bp_reservation, url_prefix='/reservation')

# Register role

# Register room

# Register user

from app.models import *
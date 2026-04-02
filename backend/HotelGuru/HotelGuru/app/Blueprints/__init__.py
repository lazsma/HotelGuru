from apiflask import APIBlueprint

 

bp = APIBlueprint('main', __name__, tag="main")

 

@bp.route('/')

def index():

    return 'This is The Main Blueprint'

 

#Registrate blueprints here...

 

from app.models import *
from apiflask import APIBlueprint

bp = APIBlueprint('hotel', __name__, tag="hotel")

from app.blueprints.hotel import routes
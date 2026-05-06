from apiflask import APIBlueprint

bp = APIBlueprint('admin', __name__)

from app.blueprints.admin import routes
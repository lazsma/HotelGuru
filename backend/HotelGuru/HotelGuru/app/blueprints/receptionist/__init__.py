from apiflask import APIBlueprint

# Letrehozzuk az APIBlueprint-et a recepcios reszhez
receptionist_bp = APIBlueprint('receptionist', __name__)


from app.blueprints.receptionist import routes
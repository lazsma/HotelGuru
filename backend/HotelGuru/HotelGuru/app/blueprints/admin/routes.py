from apiflask import APIBlueprint as Blueprint

from app.blueprints.admin import bp
from app.models.room import Room
from app.extensions import db

@bp.patch('/room/<int:room_id>/equipment')
def update_room_equipment(room_id):
    """Szoba felszereltsegenek frissitese"""
    return {"message": f"A(z) {room_id} szoba felszereltsege naprakesz"}

@bp.patch('/room/<int:room_id>/status')
def set_room_status(room_id):
    """Szoba foglalasi allapotanak modositasa (pl. karbantartas)"""
    return {"message": f"A(z) {room_id} szoba allapota modositva (pl. Nem foglalhato)"}
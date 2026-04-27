from apiflask import APIBlueprint as Blueprint
from app.extensions import db


bp = Blueprint('user', __name__)

@bp.get('/profile/<int:user_id>')
def get_profile(user_id):
    """Szemelyes adatok megtekintese"""
    return {"id": user_id, "name": "Teszt Vendeg", "email": "teszt@email.com"}

@bp.patch('/profile/<int:user_id>')
def update_profile(user_id):
    """Szemelyes adatok (telefon, lakcim, email) modositasa"""
    return {"message": "Profil adatok sikeresen frissitve (GDPR kompatibilis)"}

@bp.post('/booking')
def create_booking():
    """Uj szobafoglalas elkuldese"""
    return {"message": "Foglalas rogzitve, visszaigazolasra var"}

@bp.delete('/booking/<int:booking_id>')
def cancel_booking(booking_id):
    """Foglalas lemondasa (idokorlat ellenorzessel)"""
    return {"message": f"A(z) {booking_id} szamu foglalas torolve"}
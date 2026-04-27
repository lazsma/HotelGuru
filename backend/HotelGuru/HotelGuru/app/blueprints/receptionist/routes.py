from apiflask import APIBlueprint as Blueprint

bp = Blueprint('receptionist', __name__)

@bp.post('/confirm/<int:booking_id>')
def confirm_booking(booking_id):
    """Foglalas visszaigazolasa a recepcios altal"""
    return {"message": f"Foglalas {booking_id} visszaigazolva"}

@bp.post('/check-in/<int:booking_id>')
def check_in(booking_id):
    """Vendeg beleptetese (Check-in)"""
    return {"message": "Vendeg sikeresen beleptetve a szobaba"}

@bp.get('/billing/<int:booking_id>')
def generate_bill(booking_id):
    """Szamla kiallitasa (szallas + extra szolgaltatasok)"""
    return {
        "booking_id": booking_id,
        "base_price": 45000,
        "extras": 12000,
        "total": 57000,
        "currency": "HUF"
    }
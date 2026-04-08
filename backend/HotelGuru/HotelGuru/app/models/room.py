from __future__ import annotations
from app.extensions import db
from sqlalchemy import ForeignKey, Boolean, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String, Integer

class Room(db.Model):
    __tablename__ = "rooms"
    
    id: Mapped[int] = mapped_column(primary_key=True)

    # Kiadható?
    is_available: Mapped[bool] = mapped_column(Boolean, default=True) 

    # Állapot
    status: Mapped[str] = mapped_column(String(50), nullable=True) 
    
    # Megjegyzés
    note: Mapped[str] = mapped_column(Text, nullable=True)      
    
    # helye (pl. 1. emelet)
    location: Mapped[str] = mapped_column(String(100), nullable=True) 

    # Szobaszám
    room_number: Mapped[str] = mapped_column(String(10), unique=True)
    
    # Ár
    price: Mapped[float] = mapped_column(Float)                      

    # Típus
    room_type: Mapped[str] = mapped_column(String(50))               

    # Kapcsolat a Hotellel
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"), nullable=False)

    def __repr__(self) -> str:
        return f"Room(id={self.id}, number={self.room_number!r}, type={self.room_type!r})"

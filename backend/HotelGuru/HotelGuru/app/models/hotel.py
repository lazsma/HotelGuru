from __future__ import annotations
from app.extensions import db
from sqlalchemy import ForeignKey  
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String, Integer

class Hotel(db.Model):
    __tablename__ = "hotels"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    
    # Külső kulcs az Address táblára
    address_id: Mapped[int] = mapped_column(ForeignKey("addresses.id"), nullable=False)
    
    # A kapcsolat 
    address: Mapped["Address"] = relationship(back_populates="hotel")
    
    # TODO: Ha a User modell kész, ide jön a kapcsolat
    # users: Mapped[list["User"]] = relationship(back_populates="hotel")

    def __repr__(self) -> str:
        return f"Hotel(id={self.id}, name={self.name!r})"
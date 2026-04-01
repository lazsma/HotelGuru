from __future__ import annotations
from app.extensions import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String, Integer

class Address(db.Model):
    __tablename__ = "addresses"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str] = mapped_column(String(100))
    postalcode: Mapped[int] = mapped_column(Integer)
    
    # Kapcsolatok (hogy az Address felől is lássuk, ki lakik ott)
    # Itt back_populates-t használunk, hogy oda-vissza működjön a dolog
    user: Mapped["User"] = relationship(back_populates="address", uselist=False)
    hotel: Mapped["Hotel"] = relationship(back_populates="address", uselist=False)

    def __repr__(self) -> str:
        return f"Address(id={self.id}, city={self.city!r}, street={self.street!r})"
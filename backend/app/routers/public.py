from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.slot import Slot
from app.schemas.booking import BookingCreate, BookingRead
from app.schemas.slot import SlotRead

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/slots", response_model=list[SlotRead])
def get_available_slots(db: Session = Depends(get_db)):
    """Return all available time slots."""
    return db.query(Slot).filter(Slot.is_available == True).all()  # noqa: E712


@router.post("/bookings", response_model=BookingRead, status_code=201)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    """Submit a booking for a given slot."""
    slot = db.query(Slot).filter(Slot.id == payload.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if not slot.is_available:
        raise HTTPException(status_code=409, detail="Slot is no longer available")

    booking = Booking(**payload.model_dump())
    db.add(booking)
    db.flush()  # apply to session so count includes the new booking

    booking_count = db.query(Booking).filter(Booking.slot_id == slot.id).count()
    if booking_count >= slot.max_students:
        slot.is_available = False

    db.commit()
    db.refresh(booking)
    return booking

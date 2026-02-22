import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.booking import Booking
from app.models.slot import Slot
from app.schemas.booking import BookingRead
from app.schemas.slot import SlotCreate, SlotRead

router = APIRouter(prefix="/api/admin", tags=["admin"])
security = HTTPBasic()


def require_admin(credentials: HTTPBasicCredentials = Depends(security)) -> None:
    """Validate the admin secret via HTTP Basic Auth (username is ignored)."""
    is_valid = secrets.compare_digest(
        credentials.password.encode(), settings.admin_secret.encode()
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Unauthorized")


# ── Slots ──────────────────────────────────────────────────────────────────────


@router.get(
    "/slots", response_model=list[SlotRead], dependencies=[Depends(require_admin)]
)
def list_all_slots(db: Session = Depends(get_db)):
    """List all slots (available and unavailable)."""
    return db.query(Slot).order_by(Slot.start_time).all()


@router.post(
    "/slots",
    response_model=SlotRead,
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def create_slot(payload: SlotCreate, db: Session = Depends(get_db)):
    """Create a new time slot."""
    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=422, detail="end_time must be after start_time")

    overlapping = (
        db.query(Slot)
        .filter(
            Slot.start_time < payload.end_time,
            Slot.end_time > payload.start_time,
        )
        .first()
    )
    if overlapping:
        raise HTTPException(
            status_code=409,
            detail=(
                f"Slot overlaps with an existing slot "
                f"({overlapping.start_time.isoformat()} – {overlapping.end_time.isoformat()})"
            ),
        )

    slot = Slot(**payload.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.delete(
    "/slots/{slot_id}", status_code=204, dependencies=[Depends(require_admin)]
)
def delete_slot(slot_id: int, db: Session = Depends(get_db)):
    """Delete a time slot. Fails if a booking is associated with it."""
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")

    booking = db.query(Booking).filter(Booking.slot_id == slot_id).first()
    if booking:
        raise HTTPException(
            status_code=409,
            detail=f"Slot has an existing booking (ref: {booking.booking_reference}). Delete the booking first.",
        )

    db.delete(slot)
    db.commit()


# ── Bookings ───────────────────────────────────────────────────────────────────


@router.get(
    "/bookings", response_model=list[BookingRead], dependencies=[Depends(require_admin)]
)
def list_bookings(db: Session = Depends(get_db)):
    """List all bookings."""
    return db.query(Booking).order_by(Booking.created_at.desc()).all()


@router.delete(
    "/bookings/{booking_id}", status_code=204, dependencies=[Depends(require_admin)]
)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """Delete a booking and mark the corresponding slot as available again."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    slot = db.query(Slot).filter(Slot.id == booking.slot_id).first()
    if slot:
        slot.is_available = True

    db.delete(booking)
    db.commit()

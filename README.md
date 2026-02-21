# English Teacher

A landing page for an English teacher, allowing students to book classes online — no sign-up required.

## Features

- 📅 **Class Booking Calendar** — Browse available time slots and select one directly from the landing page
- 📝 **Booking Form** — After selecting a slot, fill in your name, phone number, and email
- 💳 **Payment Options** — Pay via **Mercado Pago** (for students in Argentina) or **PayPal** (for international students)
- 🌍 **Single Landing Page** — Everything happens on one page, clean and simple

## Tech Stack

See each folder's README for details:
- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)

## Project Structure

```
english_teacher/
├── frontend/   # React + Vite app
├── backend/    # FastAPI app
└── README.md
```

## Getting Started

> Setup instructions coming soon.

## Notes

- No authentication is required to book a class
- Payment method is selected by the student based on their location (Argentina → Mercado Pago, abroad → PayPal)
- Basic rate limiting is applied on the backend to prevent spam bookings

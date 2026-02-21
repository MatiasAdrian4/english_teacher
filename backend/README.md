# Backend

The backend is a REST API that handles available time slots, booking submissions, and payment integrations.

## Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python web framework with automatic Swagger docs
- [SQLAlchemy](https://www.sqlalchemy.org/) + SQLite — ORM and database (SQLite for simplicity; easy to migrate to PostgreSQL)
- [Mercado Pago Python SDK](https://github.com/mercadopago/sdk-python) — Payment integration for students in Argentina
- [PayPal REST API](https://developer.paypal.com/api/rest/) — Payment integration for international students

## API Overview

| Scope | Description |
|-------|-------------|
| Public | Endpoints for fetching available slots and submitting bookings |
| Admin (protected) | Endpoints for managing slot availability, viewing and managing bookings |

Admin endpoints are protected via a simple authentication mechanism (e.g. HTTP Basic Auth or a static secret token) since only one user (the teacher) needs access.

## Getting Started

> Setup instructions coming soon.

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

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and set a strong value for `ADMIN_SECRET`.

### 5. Run the development server

```bash
uvicorn app.main:app --reload --reload-dir app
```

> `--reload-dir app` restricts the file watcher to the `app/` folder only,
> preventing constant restarts caused by changes inside `.venv/`.

The API will be available at <http://localhost:8000>.
Interactive docs (Swagger UI) at <http://localhost:8000/docs>.

### 6. (Optional) Run on a custom port

```bash
uvicorn app.main:app --reload --reload-dir app --port 8080
```

## API Overview

| Scope | Description |
|-------|-------------|
| `GET /api/slots` | List all available time slots |
| `POST /api/bookings` | Submit a booking |
| `GET /admin/slots` | List all slots (admin) |
| `POST /admin/slots` | Create a slot (admin) |
| `PATCH /admin/slots/{id}/availability` | Toggle slot availability (admin) |
| `DELETE /admin/slots/{id}` | Delete a slot (admin) |
| `GET /admin/bookings` | List all bookings (admin) |
| `DELETE /admin/bookings/{id}` | Delete a booking (admin) |
| `GET /health` | Health check |

Admin endpoints use **HTTP Basic Auth** — any username, password = `ADMIN_SECRET` from `.env`.

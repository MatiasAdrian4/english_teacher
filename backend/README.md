# Backend

The backend is a REST API that handles available time slots, booking submissions, and payment integrations.

## Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) — High-performance Python web framework with automatic Swagger docs
- [SQLAlchemy](https://www.sqlalchemy.org/) + SQLite — ORM and database (SQLite for simplicity; easy to migrate to PostgreSQL)
- [Pydantic v2](https://docs.pydantic.dev/) — Data validation and serialization
- [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) — Environment variable management
- [Mercado Pago Python SDK](https://github.com/mercadopago/sdk-python) — Payment integration for students in Argentina *(planned)*
- [PayPal REST API](https://developer.paypal.com/api/rest/) — Payment integration for international students *(planned)*

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
# Runtime dependencies only
pip install -r requirements.txt

# Runtime + dev tools (linter/formatter)
pip install -r requirements-dev.txt
```

### 3a. (Optional) Linting and formatting

[Ruff](https://docs.astral.sh/ruff/) is used for both linting and formatting.

```bash
ruff check . --fix   # find and auto-fix code quality issues (unused imports, bug patterns, etc.)
ruff format .        # format code appearance (indentation, line length, quotes, etc.)
```

> Run `check` before `format` — linting may change code that formatting then cleans up.

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
| `GET /api/admin/slots` | List all slots (admin) |
| `POST /api/admin/slots` | Create a slot (admin) |
| `DELETE /api/admin/slots/{id}` | Delete a slot (admin) |
| `GET /api/admin/bookings` | List all bookings (admin) |
| `DELETE /api/admin/bookings/{id}` | Delete a booking (admin) |
| `GET /health` | Health check |

Admin endpoints use **HTTP Basic Auth** — any username, password = `ADMIN_SECRET` from `.env`.

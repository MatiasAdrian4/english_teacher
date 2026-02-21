from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import public_router, admin_router

app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    init_db()


app.include_router(public_router)
app.include_router(admin_router)


@app.get("/health", tags=["health"])
def health_check() -> dict:
    return {"status": "ok"}

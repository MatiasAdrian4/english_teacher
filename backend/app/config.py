from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # App
    app_title: str = "English Teacher API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Database
    database_url: str = "sqlite:///./english_teacher.db"

    # Admin
    admin_secret: str = "changeme"

    # CORS
    allowed_origins: list[str] = ["http://localhost:5173"]


settings = Settings()

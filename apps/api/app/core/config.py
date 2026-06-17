"""Uygulama ayarları — .env'den tip-güvenli okuma (pydantic-settings).

Secret'lar (TARGET_API_KEY) yalnız buradan erişilir; asla log'lanmaz, response'a konmaz.
uvicorn `apps/api` dizininden çalıştığı için kök .env yolu `../../.env`.
"""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Uygulama ---
    app_env: str = "development"
    log_level: str = "INFO"

    # --- Veritabanı (SQLite) ---
    database_url: str = "sqlite:///./var/app.db"

    # --- CORS ---
    cors_allow_origins: str = "http://localhost:3000"

    # --- Hedef (target) MES API ---
    target_api_url: str = "http://89.252.189.91:8983"
    target_api_submit_path: str = "/api/v1/submit"
    target_api_key: str = ""
    target_api_timeout_seconds: int = 15
    target_api_max_retries: int = 3
    target_api_backoff_base_seconds: int = 2
    target_api_rate_limit_cooldown_seconds: int = 60

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allow_origins.split(",") if o.strip()]

    @property
    def target_submit_url(self) -> str:
        return f"{self.target_api_url.rstrip('/')}{self.target_api_submit_path}"


settings = Settings()

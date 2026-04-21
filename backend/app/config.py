from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration. Env vars prefixed with TECHPHYSIO_ override defaults.

    Anything sensitive (LLM keys, webhook URLs) MUST come from the environment —
    never commit values here.
    """

    model_config = SettingsConfigDict(
        env_prefix="TECHPHYSIO_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    host: str = "127.0.0.1"
    port: int = 8000
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    db_url: str = "sqlite:///./techphysio.db"
    file_storage_dir: Path = Path("./uploads")

    chroma_dir: Path = Path("./chroma")
    chroma_collection: str = "techphysio_exercises"

    llm_endpoint: str | None = None
    llm_api_key: str | None = None
    llm_model: str = "nemotron-3-8b-safety"
    vlm_endpoint: str | None = None
    vlm_model: str | None = None

    clinician_webhook_url: str | None = None

    log_level: str = "INFO"

    @property
    def llm_configured(self) -> bool:
        return bool(self.llm_endpoint)

    @property
    def vlm_configured(self) -> bool:
        return bool(self.vlm_endpoint)


settings = Settings()

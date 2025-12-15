import os
from pydantic_settings import BaseSettings, SettingsConfigDict

env_state = os.getenv("APP_ENV", "local")


class Settings(BaseSettings):
    db_host: str
    db_port: int
    db_name: str
    db_user: str
    db_password: str
    db_port: str

    model_config = SettingsConfigDict(
        env_file=f".env.{env_state}",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
print(f"Loading config for: {env_state}")

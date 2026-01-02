import logging
from contextlib import asynccontextmanager
from typing import Union

from api import auth, link, tag, user
from core.auth import dispatch
from core.config import settings
from db.base import Base
from db.session import engine
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from utils.embedding import get_embedding_model

logger = logging.getLogger("uvicorn")

# db_connection pool 생성
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI 애플리케이션 시작/종료 시 실행되는 lifespan 이벤트

    - 시작 시:
        - SentenceTransformer 모델을 미리 로드하여 캐싱
    - 종료 시: 필요한 정리 작업 수행
    """
    # Startup
    logger.info("Application startup")
    # 모델 미리 로드
    logger.info("Preloading SentenceTransformer model on startup...")

    model = get_embedding_model()

    logger.info(f"Model loaded: {type(model).__name__}")

    yield

    # Shutdown: 필요시 정리 작업
    logger.info("Application shutdown")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_key,
    session_cookie="session_auth",
    max_age=60 * 60,
    https_only=False,
)
app.middleware(dispatch)

app.include_router(link.router, prefix="/api/v1", tags=["v1"])
app.include_router(auth.router, prefix="/api/v1", tags=["v1"])
app.include_router(user.router, prefix="/api/v1", tags=["v1"])
app.include_router(tag.router, prefix="/api/v1", tags=["v1"])


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

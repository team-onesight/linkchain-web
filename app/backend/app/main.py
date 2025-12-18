from typing import Union

from api import auth, link
from core.auth import dispatch
from core.config import settings
from db.base import Base
from db.session import engine
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

# db_connection pool 생성
Base.metadata.create_all(bind=engine)

app = FastAPI()

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


# 라우팅 정의 후 삭제 예정
@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

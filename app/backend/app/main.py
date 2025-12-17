from typing import Union

from api import link
from db.base import Base
from db.session import engine
from fastapi import FastAPI

# db_connection pool 생성
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(link.router, prefix="/api/v1", tags=["v1"])


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

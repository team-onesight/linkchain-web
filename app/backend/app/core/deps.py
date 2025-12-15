from sqlalchemy.orm import Session

from db.session import SessionLocal
from repositories.link import LinkRepository
from services.link import LinkService


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from fastapi import Depends
from sqlalchemy.orm import Session


def get_di_link_service(db: Session = Depends(get_db)) -> LinkService:
    repository = LinkRepository(db)  # db 세션을 넘겨 LinkRepository 인스턴스 생성
    return LinkService(repository)  # LinkService 인스턴스를 반환

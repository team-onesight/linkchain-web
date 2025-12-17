from typing import Annotated

from db.session import SessionLocal
from fastapi import Depends
from repositories.link import LinkRepository
from repositories.user import UserRepository
from services.link import LinkService
from services.user import UserService
from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_di_link_service(db: Annotated[Session, Depends(get_db)]) -> LinkService:
    repository = LinkRepository(db)  # db 세션을 넘겨 LinkRepository 인스턴스 생성
    return LinkService(repository)  # LinkService 인스턴스를 반환


def get_di_user_service(db: Annotated[Session, Depends(get_db)]) -> UserService:
    """
    Userservice 의존성 주입 메소드

    :param db: Description
    :type db: Session
    :return: Description
    :rtype: UserService
    """
    repository = UserRepository(db)
    return UserService(repository)

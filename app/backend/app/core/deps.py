import time
from typing import Annotated, Callable

from db.session import SessionLocal
from fastapi import Depends, Request
from repositories.link import LinkRepository
from repositories.tag import TagRepository
from repositories.user import UserRepository
from services.link import LinkService
from services.tag import TagService
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


def get_di_tag_service(db: Annotated[Session, Depends(get_db)]) -> TagService:
    repository = TagRepository(db)
    return TagService(repository)


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


def get_user_session(request: Request) -> Callable:
    """
    user session 의존성 주입 메소드
    :param request: request
    :type request: Request
    :return: Callable
    :rtype: Callable[..., Any]
    """

    def create_session(login_user):
        request.session["user"] = {
            "user_id": login_user.user_id,
            "username": login_user.username,  # 오타 수정: usernmae -> username
        }
        now = int(time.time())
        request.session["expired_time"] = now + (60 * 60)

    return create_session

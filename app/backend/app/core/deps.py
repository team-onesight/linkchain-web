import time
from typing import Annotated, Callable

from db.session import SessionLocal
from fastapi import Depends, HTTPException, Request
from repositories.link import LinkRepository
from repositories.link_group import LinkGroupRepository
from repositories.link_history import LinkHistoryRepository
from repositories.link_user_map import LinkUserMapRepository
from repositories.tag import TagRepository
from repositories.user import UserRepository
from services.link import LinkService
from services.link_group import GroupService
from services.tag import TagService
from services.user import UserLinkHistoryService, UserService
from sqlalchemy.orm import Session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_di_link_service(db: Annotated[Session, Depends(get_db)]) -> LinkService:
    """
    LinkService 의존성 주입 메소드
    """
    link_repository = LinkRepository(db)  # db 세션을 넘겨 LinkRepository 인스턴스 생성
    link_user_map_repository = LinkUserMapRepository(db)  # db 세션을 넘겨 LinkUserMapRepository 인스턴스 생성 # noqa: E501
    return LinkService(
        link_repository=link_repository,
        link_user_map_repository=link_user_map_repository)  # LinkService 인스턴스를 반환 # noqa: E501


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


def get_di_user_link_history_service(db: Annotated[Session, Depends(get_db)]) -> UserLinkHistoryService: # noqa: E501
    """
    UserLinkHistoryResponse 의존성 주입 메소드
    """
    link_history_repository = LinkHistoryRepository(db)
    return UserLinkHistoryService(link_history_repository)


def get_di_link_group_service(db: Annotated[Session, Depends(get_db)]) -> GroupService:
    """
    GroupService 의존성 주입 메소드
    """
    link_group_repository = LinkGroupRepository(db)
    tag_repository = TagRepository(db)
    return GroupService(
        link_group_repository=link_group_repository, tag_repository=tag_repository
    )


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


def get_current_user_from_session(
    request: Request,
) -> dict:
    """
    현재 세션에서 사용자 정보를 가져오는 의존성 주입 메소드
    :param request: request
    :type request: Request
    :return: user_id와 username을 포함한 딕셔너리
    :rtype: dict
    """
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

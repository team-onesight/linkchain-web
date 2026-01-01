from typing import Annotated, Optional

from core.deps import (
    get_current_user_from_session,
    get_di_link_service,
    get_di_user_link_history_service,
    get_di_user_service,
)
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from schemas.common import Page
from schemas.link import LinkResponse
from schemas.user import UserLinkHistoryResponse, UserResponse, UsernameAvailabilityResponse
from services.link import LinkService
from services.user import UserLinkHistoryService, UserService

router = APIRouter(prefix="/users")


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    user = service.get_user_by_id(user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        user_id=user.user_id,
        username=user.username,
    )


@router.get("/{user_id}/links", response_model=Page[LinkResponse])
def get_user_links(
    user_id: int,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    cursor: Annotated[
        Optional[int], Query(description="마지막으로 받은 map_id")
    ] = None,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return service.get_links(user_id, cursor, size)


def _get_user_session_from_request(
    request: Request,
):
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

@router.get("/{user_id}/histories", response_model=UserLinkHistoryResponse) # noqa: E501
def get_user_link_histories(
    service: Annotated[UserLinkHistoryService, Depends(get_di_user_link_history_service)], # noqa: E501
    current_user: Annotated[dict, Depends(get_current_user_from_session)],
):
    """
    user가 방문한 link history 조회
    :param user_id: user_id
    :type user_id: int
    """
    user_id = current_user["user_id"]
    user_link_history_response = service.get_user_link_history(user_id)

    return user_link_history_response

@router.post("/validate/id", response_model=UsernameAvailabilityResponse)
def validate_username(
    username: str,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    """
    username 중복 확인
    :param username: username
    :type username: str
    """
    return {"available": service.is_username_available(username)}
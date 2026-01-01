from typing import Annotated

from core.deps import get_di_user_link_history_service, get_di_user_service
from fastapi import APIRouter, Depends, HTTPException, Request
from schemas.user import UserLinkHistoryResponse, UserResponse
from services.user import UserLinkHistoryService, UserService

router = APIRouter(prefix="/users")


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    print(user_id)
    user = service.get_user_by_id(user_id)

    return UserResponse(  # TODO need to add more fields link Related Links
        user_id=user.user_id,
        username=user.username,
    )


def _get_user_session_from_request(
    request: Request,
):
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

@router.get("/{user_id}/histories", response_model=UserLinkHistoryResponse) # noqa: E501
def get_user_link_histories(
    user_id: int,
    service: Annotated[UserLinkHistoryService, Depends(get_di_user_link_history_service)], # noqa: E501
):
    """
    user가 방문한 link history 조회
    :param user_id: user_id
    :type user_id: int
    """
    user_link_history_response = service.get_user_link_history(user_id)

    return user_link_history_response
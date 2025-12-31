import logging
from typing import Annotated, Optional

from core.deps import get_di_link_service
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from schemas.common import Page
from schemas.link import CreateLinkRequest, LinkResponse, LinkViewRegisterResponse
from services.link import LinkService

from api.session_utils import get_user_id_from_session

router = APIRouter(prefix="/links")


@router.get("/my", response_model=Page[LinkResponse])
def get_my_links(
    request: Request,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    cursor: Annotated[
        Optional[int], Query(description="마지막으로 받은 map_id")
    ] = None,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    user_id = get_user_id_from_session(request)
    return service.get_links(user_id, cursor, size)


@router.get("/{link_id}", response_model=LinkResponse)
def read_link(
    link_id: str,
    service: Annotated[LinkService, Depends(get_di_link_service)],
):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    link = service.get_link(int(link_id))

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    return link


@router.post("/{link_id}", response_model=LinkViewRegisterResponse)
def register_link_view(
    link_id: str,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    request: Request,
):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    if not service.increase_view(link_id):
        logging.warning(f"Failed to increase view for link {link_id}.")

    try:
        user_id = get_user_id_from_session(request)
        if not service.create_history(user_id, link_id):
            logging.warning(
                f"Failed to create link view history for user {user_id} and link {link_id}."  # noqa: E501
            )
    except HTTPException:
        pass

    return LinkViewRegisterResponse(message="Link View registered.")


@router.post("", response_model=dict)
def create_link(body: CreateLinkRequest):
    logging.warn("Creating link with data: %s", body)
    return {
        "link_id": 1,
        "url": body.url,
        "title": body.title,
        "description": body.description,
    }

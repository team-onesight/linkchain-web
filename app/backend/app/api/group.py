from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request

from core.deps import get_di_link_group_service
from schemas.link_group import GroupResponse
from services.link_group import GroupService


router = APIRouter(prefix="/groups")

@router.get("", response_model=list[GroupResponse])
def get_groups(service: Annotated[GroupService, Depends(get_di_link_group_service)]):
    return service.get_groups()
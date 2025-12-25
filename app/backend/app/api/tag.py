from typing import Annotated

from core.deps import get_di_tag_service
from fastapi import APIRouter, Depends
from services.tag import TagService

router = APIRouter(prefix="/tags")


@router.get("")
def get_tags(
    service: Annotated[TagService, Depends(get_di_tag_service)],
    limit: int = 5,
):
    return service.get_tags(limit)

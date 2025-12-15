from fastapi import APIRouter

from api import link

endpoint_router = APIRouter()

endpoint_router.include_router(link.router, prefix="/links", tags=["links"])
# endpoint_router.include_router(users.router, prefix="/users", tags=["users"])

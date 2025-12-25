from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    """
    Pagenation response schema
    """

    items: List[T]
    next_cursor: Optional[int] = None
    has_more: bool

    class Config:
        from_attributes = True

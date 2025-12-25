from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Query


def paginate_by_cursor(
    query: Query, cursor_col, cursor: Optional[datetime], size: int
) -> dict:
    if cursor:
        query = query.filter(cursor_col < cursor)

    items = query.order_by(cursor_col.desc()).limit(size + 1).all()

    has_more = len(items) > size
    items = items[:size]

    next_cursor = None
    if items and has_more:
        next_cursor = getattr(items[-1], cursor_col.name).isoformat()

    return {"items": items, "next_cursor": next_cursor, "has_more": has_more}

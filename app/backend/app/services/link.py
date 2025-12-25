from typing import Optional

from repositories.link import LinkRepository
from schemas.common import Page
from schemas.link import LinkResponse


class LinkService:
    def __init__(self, repository: LinkRepository):
        self.repository = repository

    def get_link(self, link_id: int):
        return self.repository.get_link_from_db(link_id)

    def get_links(
        self, user_id: int, cursor: Optional[int], size: int
    ) -> Page[LinkResponse]:
        raw_data = self.repository.find_my_links(user_id, cursor, size)

        has_more = len(raw_data) > size
        items = raw_data[:size]

        next_cursor = items[-1].map_id if items and has_more else None

        return Page[LinkResponse](
            items=items, next_cursor=next_cursor, has_more=has_more
        )

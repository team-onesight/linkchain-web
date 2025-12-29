from typing import Optional

from repositories.link import LinkRepository
from repositories.link_user_map import LinkUserMapRepository
from schemas.common import Page
from schemas.link import LinkResponse
from utils.hash import get_uuid_hash


class LinkService:
    def __init__(
            self,
            link_repository: LinkRepository,
            link_user_map_repository: LinkUserMapRepository
    ):
        self.link_repository = link_repository
        self.link_user_map_repository = link_user_map_repository

    def get_link(self, link_id: int):
        return self.link_repository.get_link_from_db(link_id)

    def get_links(
        self, user_id: int, cursor: Optional[int], size: int
    ) -> Page[LinkResponse]:
        raw_data = self.link_repository.find_my_links(user_id, cursor, size)

        has_more = len(raw_data) > size
        items = raw_data[:size]

        next_cursor = items[-1].map_id if items and has_more else None

        return Page[LinkResponse](
            items=items, next_cursor=next_cursor, has_more=has_more
        )

    def create_link(self, url: str, user_id: int, username: str):
        """
        Create a new link and associate it with a user.
        1. 같은 url에 대해 동일한 user_id가 존재하면 아무 작업도 하지 않고 None 반환
        2. link_user_map에 user_id와 link_id 매핑 생성
        3. link 테이블에 link 생성
        :param self: Description
        :param url: user가 등록하려는 링크
        :type url: str
        :param user_id: link를 등록하는 user의 아이디
        :type user_id: int
        """
        link_id = get_uuid_hash(url)

        if self.link_user_map_repository.get_link_user_map(link_id, user_id=user_id):
            return None # LinkUserMap already exists -> link already exists for this user # noqa: E501

        if not self.get_link(link_id):
            self.link_repository.create_link(link_id, url, created_by_user_id=user_id, created_by_username=username) # Link does not exist, create it # noqa: E501
        return self.link_user_map_repository.create_link_user_map(link_id, user_id=user_id)  # Link already exists -> just create LinkUserMap # noqa: E501

    def increase_view(self, link_id: str):
        return self.link_repository.increase_view(link_id)

    def create_history(self, user_id: int, link_id: str):
        return self.link_repository.create_history(user_id, link_id)

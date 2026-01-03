from typing import Optional

from repositories.link import LinkRepository
from repositories.link_user_map import LinkUserMapRepository
from schemas.common import Page
from schemas.link import LinkResponse, SearchLinkResponse
from utils.hash import get_uuid_hash


class LinkService:
    def __init__(
        self,
        link_repository: LinkRepository,
        link_user_map_repository: LinkUserMapRepository,
    ):
        self.link_repository = link_repository
        self.link_user_map_repository = link_user_map_repository

    def get_link(self, link_id: str):
        return self.link_repository.get_link_by_link_id(link_id)

    def get_links(
        self, user_id: int, cursor: Optional[int], size: int
    ) -> Page[LinkResponse]:
        raw_data = self.link_repository.get_links_by_user_id(user_id, cursor, size)
        has_more = len(raw_data) > size
        sliced_data = raw_data[:size]

        items = [row.Link for row in sliced_data]

        next_cursor = sliced_data[-1].map_id if sliced_data and has_more else None

        return Page[LinkResponse](
            items=items, next_cursor=next_cursor, has_more=has_more
        )

    def create_link(self, url: str, user_id: int, username: str):
        """
        Create a new link and associate it with a user.
        1. 같은 url에 대해 동일한 user_id가 존재하면 아무 작업도 하지 않고 None 반환
        2. link_user_map에 user_id와 link_id 매핑 생성
        3. link 테이블에 link 생성
        :param username:  link를 생성하는 user의 이름
        :param self: Description
        :param url: user가 등록하려는 링크
        :type url: str
        :param user_id: link를 등록하는 user의 아이디
        :type user_id: int
        """
        link_id: str = get_uuid_hash(url)

        if self.link_user_map_repository.get_link_user_map(link_id, user_id=user_id):
            return None  # LinkUserMap already exists -> link already exists for this user # noqa: E501

        if not self.get_link(link_id):
            self.link_repository.create_link(
                link_id, url, created_by_user_id=user_id, created_by_username=username
            )  # Link does not exist, create it # noqa: E501
        return self.link_user_map_repository.create_link_user_map(
            link_id, user_id=user_id
        )  # Link already exists -> just create LinkUserMap # noqa: E501

    def increase_view(self, link_id: str):
        return self.link_repository.increase_view(link_id)

    def create_history(self, user_id: int, link_id: str):
        return self.link_repository.create_history(user_id, link_id)

    def search_links(
        self,
        query: Optional[str],
        tag: Optional[str],
        page: int,
        size: int,
    ) -> SearchLinkResponse:
        """
        검색어 또는 태그로 링크 검색하는 Service 메서드입니다.

        1. query 가 주어진 경우, title,description 기반 LIKE 검색을 수행합니다.
        2. tag 가 주어진 경우, 태그 기반 검색을 수행합니다.
        3. 검색 조건이 없는 경우, 빈 결과를 반환합니다.
        ( total_count 는 페이징을 위한 전체 결과 수입니다. )

        :param self:
        :param query: 검색 쿼리
        :type query: Optional[str]
        :param tag: 태그
        :type tag: Optional[str]
        :param page: 페이지 번호
        :type page: int
        :param size: 페이지 당 아이템 수
        :type size: int
        :return: 검색 결과
        :rtype: SearchLinkResponse
        """  # noqa: E501
        if query:
            links, total_count = self.link_repository.search_links_by_query(
                query=query,
                page=page,
                size=size,
            )
        elif tag:
            links, total_count = self.link_repository.search_links_by_tag(
                tag=tag,
                page=page,
                size=size,
            )
        else:
            # 검색 조건이 없는 경우 빈 결과 반환
            links = []
            total_count = 0

        # 올림 연산
        total_pages = (total_count + size - 1) // size if total_count > 0 else 0

        return SearchLinkResponse(
            items=links,
            total=total_count,
            page=page,
            size=size,
            total_pages=total_pages,
        )

    def get_similar_links(self, link_id: str) -> list[LinkResponse]:
        """
        유사한 링크를 반환합니다.

        :param self:
        :param link_id: 원본 링크 ID
        :type link_id: str
        :return: 유사한 링크 리스트
        :rtype: list[LinkResponse]
        """
        link = self.link_repository.get_link_by_link_id(link_id)
        if not link or link.link_embedding is None:
            return []

        similar_links = self.link_repository.get_similar_links(link=link)
        return [LinkResponse.from_orm(link) for link in similar_links]

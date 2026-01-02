from typing import List, Optional

from models.link import Link
from models.link_history import LinkHistory
from models.link_tag_map import LinkTagMap
from models.link_user_map import LinkUserMap
from models.tag import Tag
from sqlalchemy import Float, desc, func, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload


class LinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_link_by_link_id(self, link_id: str):
        return self.db.query(Link).filter(Link.link_id == link_id).first()

    def get_links_by_user_id(self, user_id: int, cursor: Optional[int], size: int):
        query = (
            self.db.query(Link, LinkUserMap.id.label("map_id"))
            .join(LinkUserMap, Link.link_id == LinkUserMap.link_id)
            .options(joinedload(Link.tags))
            .filter(LinkUserMap.user_id == user_id)
        )

        if cursor:
            query = query.filter(LinkUserMap.id < cursor)

        return query.order_by(desc(LinkUserMap.id)).limit(size + 1).all()

    def create_link(
        self, link_id: str, url: str, created_by_user_id: int, created_by_username: str
    ):
        new_link = Link(
            link_id=link_id,
            url=url,
            created_by_user_id=created_by_user_id,
            created_by_username=created_by_username,
        )
        try:
            self.db.add(new_link)
            self.db.commit()
            self.db.refresh(new_link)
            return new_link
        except IntegrityError as e:
            self.db.rollback()
            print(f"Error while creating link: {e}")
            raise e

    def increase_view(self, link_id: str):
        stmt = update(Link).where(Link.link_id == link_id).values(views=Link.views + 1)
        self.db.execute(stmt)
        self.db.commit()
        return True

    def create_history(self, user_id: int, link_id: str):
        link_history = LinkHistory(user_id=user_id, link_id=link_id)
        self.db.add(link_history)
        self.db.commit()
        return link_history

    def search_links_by_embedding(
        self,
        query_embedding: List[float],
        page: int,
        size: int,
    ):
        """
        query_embedding 기반 유사도 검색을 진행합니다.

        1. postgreSQL 의 <=> 연산자를 사용하여 코사인 유사도를 계산합니다.
        2. 유사도 기준 내림차순으로 정렬하고 page와 size를 각각 offset과 limit으로 적용하여 결과를 반환합니다.
        ( total_count 는 페이징을 위한 전체 결과 수입니다. )

        :param self:
        :param query_embedding:
        :type query_embedding: List[float]
        :param page: 페이지 번호
        :type page: int
        :param size: 페이지 당 아이템 수
        :type size: int
        """  # noqa: E501
        embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"

        query = (
            self.db.query(
                Link,
                (1 - func.cast(Link.link_embedding.op("<=>")(embedding_str), Float)).label("similarity")  # noqa: E501
            )
            .options(joinedload(Link.tags))
            .filter(Link.link_embedding.isnot(None))
        )

        total_count = query.count()

        offset = (page - 1) * size
        results = (
            query.order_by(desc("similarity"))
            .offset(offset)
            .limit(size)
            .all()
        )

        links = [row.Link for row in results]

        return links, total_count

    def search_links_by_tag(
        self,
        tag: str,
        page: int,
        size: int,
    ):
        """
        태그 기반 링크 검색을 진행합니다.

        1. tag_name 으로 Tag 테이블에서 태그를 찾고, LinkTagMap을 통해 링크를 조회합니다.
        2. 생성일 기준 내림차순으로 정렬하고 page와 size를 각각 offset과 limit으로 적용하여 결과를 반환합니다.
        ( total_count 는 페이징을 위한 전체 결과 수입니다. )

        :param self:
        :param tag: 검색할 태그 이름
        :type tag: str
        :param page: 페이지 번호
        :type page: int
        :param size: 페이지 당 아이템 수
        :type size: int
        """  # noqa: E501
        query = (
            self.db.query(Link)
            .join(LinkTagMap, Link.link_id == LinkTagMap.link_id)
            .join(Tag, LinkTagMap.tag_id == Tag.tag_id)
            .options(joinedload(Link.tags))
            .filter(Tag.tag_name == tag)
        )

        total_count = query.count()

        offset = (page - 1) * size
        links = (
            query.order_by(desc(Link.created_at))
            .offset(offset)
            .limit(size)
            .all()
        )

        return links, total_count

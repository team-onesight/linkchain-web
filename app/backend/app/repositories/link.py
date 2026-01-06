from datetime import datetime
from typing import Optional

from models import Link, LinkGroupLinkMap
from models.link import Link
from models.link_history import LinkHistory
from models.link_tag_map import LinkTagMap
from models.link_user_map import LinkUserMap
from models.tag import Tag
from sqlalchemy import desc, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload


class LinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_link_by_link_id(self, link_id: str):
        return self.db.query(Link).filter(Link.link_id == link_id).first()

    def get_links_by_user_id(
        self,
        user_id: int,
        cursor: Optional[int],
        size: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        query = (
            self.db.query(Link, LinkUserMap.id.label("map_id"))
            .join(LinkUserMap, Link.link_id == LinkUserMap.link_id)
            .options(joinedload(Link.tags))
            .filter(LinkUserMap.user_id == user_id)
        )

        if start_date:
            query = query.filter(Link.created_at >= start_date)

        if end_date:
            query = query.filter(Link.created_at <= end_date)

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

    def search_links(
        self,
        query: Optional[str] = None,
        tag: Optional[str] = None,
        group_id: Optional[int] = None,
        page: int = 1,
        size: int = 10,
    ):
        """
        검색어, 태그, 그룹 ID 기반 동적 링크 검색
        """

        db_query = self.db.query(Link).options(joinedload(Link.tags))

        if group_id:
            db_query = db_query.join(
                LinkGroupLinkMap, Link.link_id == LinkGroupLinkMap.link_id
            ).filter(LinkGroupLinkMap.group_id == group_id)

        if query:
            search_filter = f"%{query}%"
            db_query = db_query.filter(
                (Link.title.ilike(search_filter))
                | (Link.description.ilike(search_filter))
            )

        if tag:
            db_query = (
                db_query.join(LinkTagMap, Link.link_id == LinkTagMap.link_id)
                .join(Tag, LinkTagMap.tag_id == Tag.tag_id)
                .filter(Tag.tag_name == tag)
            )

        db_query = db_query.distinct()
        total_count = db_query.count()
        offset = (page - 1) * size
        links = (
            db_query.order_by(desc(Link.created_at)).offset(offset).limit(size).all()
        )

        return links, total_count

    def get_similar_links(self, link: Link, limit: int = 10):
        """
        주어진 링크와 유사한 링크를 반환합니다.

        :param self:
        :param link: 원본 링크
        :type link: Link
        :param limit: 반환할 링크 수
        :type limit: int
        :return: 유사한 링크 리스트
        :rtype: list[Link]
        """
        if link.link_embedding is None:
            return []

        return (
            self.db.query(Link)
            .filter(Link.link_id != link.link_id)
            .order_by(Link.link_embedding.cosine_distance(link.link_embedding))
            .limit(limit)
            .all()
        )

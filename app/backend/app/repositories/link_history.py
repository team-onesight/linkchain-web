from typing import Sequence

from sqlalchemy import desc
from sqlalchemy.engine import Row
from sqlalchemy.orm import Session

from models.link import Link
from models.link_user_map import LinkHistory

class LinkHistoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def count_distinct_links_by_user(self, user_id: int) -> int:
        """
        user가 방문한 link의 distinct count 반환
        :param user_id: user_id
        :type user_id: int
        """
        link_count = (
            self.db.query(LinkHistory.link_id)
            .filter(LinkHistory.user_id == user_id)
            .distinct()
            .count()
        )

        return link_count

    def find_recently_visited_links_by_user(
        self,
        user_id: int,
    ) -> Sequence[Row]:
        """
        user가 방문한 link를
        - link_id 기준으로 중복 제거
        - 가장 최근 방문 기록 기준으로 선택
        - 전체 결과는 최근 방문 순으로 정렬
        """

        subquery = (
            self.db.query(
                Link.link_id,
                Link.url,
                Link.title,
                Link.description,
                Link.views,
                LinkHistory.created_at.label("visited_at"),
            )
            .join(LinkHistory, Link.link_id == LinkHistory.link_id)
            .filter(LinkHistory.user_id == user_id)
            .distinct(Link.link_id)
            .order_by(
                Link.link_id,
                LinkHistory.created_at.desc(),
            )
            .subquery()
        )

        query = (
            self.db.query(subquery)
            .order_by(desc(subquery.c.visited_at))
        )

        return query.all()
from typing import Optional

from models.link import Link
from models.link_history import LinkHistory
from models.link_user_map import LinkUserMap
from sqlalchemy import desc, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


class LinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_link_from_db(self, link_id: int):
        return self.db.query(Link).filter(Link.link_id == link_id).first()

    def find_my_links(self, user_id: int, cursor: Optional[int], size: int):
        query = (
            self.db.query(
                Link.link_id,
                Link.url,
                Link.title,
                Link.description,
                LinkUserMap.is_public,
                LinkUserMap.id.label("map_id"),
            )
            .join(LinkUserMap, Link.link_id == LinkUserMap.link_id)
            .filter(LinkUserMap.user_id == user_id)
        )

        if cursor:
            query = query.filter(LinkUserMap.id < cursor)

        return query.order_by(desc(LinkUserMap.id)).limit(size + 1).all()

    def create_link(self, link_id: str, url: str, created_by: int):
        new_link = Link(link_id=link_id, url=url, created_by=created_by)
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
        stmt = (
                update(Link)
                .where(Link.link_id == link_id)
                .values(views=Link.views + 1)
            )
        self.db.execute(stmt)
        self.db.commit()
        return True

    def create_history(self, user_id: int, link_id: str):
        link_history = LinkHistory(user_id=user_id, link_id=link_id)
        self.db.add(link_history)
        self.db.commit()
        return link_history

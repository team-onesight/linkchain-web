from uuid import UUID

from models.link_tag_map import LinkTagMap
from models.tag import Tag
from sqlalchemy.orm import Session


class TagRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_tags(self, limit: int = 5):
        return self.db.query(Tag).order_by(Tag.created_at.desc()).limit(limit).all()

    def get_tags_by_link_ids(self, link_ids: list[UUID]):
        return (
            self.db.query(LinkTagMap.link_id, Tag)
            .join(Tag, LinkTagMap.tag_id == Tag.tag_id)
            .filter(LinkTagMap.link_id.in_(link_ids))
            .all()
        )

from collections import defaultdict

from sqlalchemy.orm import Session

from models.link import Link
from models.link_group import LinkGroup
from models.link_group_link_map import LinkGroupLinkMap


class LinkGroupRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_group_link_rows(self) -> list[tuple[str, Link]]:
        return (
            self.db.query(
                LinkGroup.group_title,
                Link,
            )
            .join(
                LinkGroupLinkMap,
                LinkGroup.group_id == LinkGroupLinkMap.group_id,
            )
            .join(
                Link,
                Link.link_id == LinkGroupLinkMap.link_id,
            )
            .order_by(LinkGroup.group_id, Link.created_at.desc())
            .all()
        )
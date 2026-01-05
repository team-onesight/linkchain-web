from models.link import Link
from models.link_group import LinkGroup
from models.link_group_link_map import LinkGroupLinkMap
from sqlalchemy import func
from sqlalchemy.orm import Session


class LinkGroupRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_groups_with_link_count(self):
        """그룹별 ID, 타이틀 및 전체 링크 개수 조회"""
        return (
            self.db.query(
                LinkGroup.group_id,
                LinkGroup.group_title,
                func.count(LinkGroupLinkMap.link_id).label("total_links"),
            )
            .join(LinkGroupLinkMap, LinkGroup.group_id == LinkGroupLinkMap.group_id)
            .group_by(LinkGroup.group_id, LinkGroup.group_title)
            .all()
        )

    def get_top_5_links_per_group(self):
        """Window Function을 사용하여 그룹별 최신 5개 링크 조회"""
        subquery = (
            self.db.query(
                LinkGroup.group_id,
                LinkGroup.group_title,
                Link.link_id.label("link_id"),
                Link.url.label("url"),
                Link.title.label("title"),
                Link.description.label("description"),
                Link.image_url.label("image_url"),
                Link.views.label("views"),
                Link.created_at.label("created_at"),
                Link.created_by_user_id.label("created_by_user_id"),
                Link.created_by_username.label("created_by_username"),
                func.row_number()
                .over(partition_by=LinkGroup.group_id, order_by=Link.created_at.desc())
                .label("rn"),
            )
            .join(LinkGroupLinkMap, LinkGroup.group_id == LinkGroupLinkMap.group_id)
            .join(Link, Link.link_id == LinkGroupLinkMap.link_id)
            .subquery()
        )

        return self.db.query(subquery).filter(subquery.c.rn <= 5).all()

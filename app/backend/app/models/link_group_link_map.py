from db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID as DB_UUID
from sqlalchemy.orm import relationship


class LinkGroupLinkMap(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link_group_link_map"

    id = Column(Integer, primary_key=True, autoincrement=True)

    link_id = Column(
        DB_UUID,
        ForeignKey("public.link.link_id", ondelete="CASCADE"),
    )
    group_id = Column(
        Integer,
        ForeignKey("public.link_group.group_id", ondelete="CASCADE"),
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    link = relationship("Link", back_populates="group_maps")
    group = relationship("LinkGroup", back_populates="link_maps")

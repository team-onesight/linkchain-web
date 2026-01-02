from db.base import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class LinkTagMap(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link_tag_map"

    id = Column(Integer, primary_key=True, autoincrement=True)

    link_id = Column(
        UUID(as_uuid=True), ForeignKey("public.link.link_id", ondelete="CASCADE")
    )
    tag_id = Column(Integer, ForeignKey("public.tag.tag_id", ondelete="CASCADE"))

    link = relationship("Link", back_populates="tag_map")
    tag = relationship("Tag", back_populates="link_maps")

from db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship


class Tag(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "tag"

    tag_id = Column(Integer, primary_key=True, index=True)

    tag_name = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    links = relationship("Link", secondary="public.link_tag_map", back_populates="tags")

    link_maps = relationship("LinkTagMap", back_populates="tag")

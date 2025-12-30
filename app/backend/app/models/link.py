import uuid

from db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Link(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link"

    link_id = Column(UUID, primary_key=True, default=uuid.uuid4, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    views = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("public.user_info.user_id"), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_maps = relationship("LinkUserMap", back_populates="link")
    tag_map = relationship("LinkTagMap", back_populates="link")
    group_maps = relationship("LinkGroupLinkMap", back_populates="link")
    histories = relationship(
        "LinkHistory", back_populates="link", cascade="all, delete-orphan"
    )

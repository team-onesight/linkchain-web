import uuid

from db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from utils.vector import VECTOR


class Link(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link"

    link_id = Column(UUID, primary_key=True, default=uuid.uuid4, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    views = Column(Integer, default=0)
    created_by_user_id = Column(Integer, nullable=True) # user_id 기본값 입력 안됨, NULL 허용
    created_by_username = Column(String, nullable=True) # 위와 같음. NULL 허용으로 crawler 여부 판단
    link_embedding = Column(VECTOR(768), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_maps = relationship("LinkUserMap", back_populates="link")
    tag_map = relationship("LinkTagMap", back_populates="link")
    group_maps = relationship("LinkGroupLinkMap", back_populates="link")
    histories = relationship(
        "LinkHistory", back_populates="link", cascade="all, delete-orphan"
    )

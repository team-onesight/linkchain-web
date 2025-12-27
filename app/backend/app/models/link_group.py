from db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship


class LinkGroup(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link_group"

    group_id = Column(Integer, primary_key=True, index=True)

    group_title = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    link_maps = relationship("LinkGroupLinkMap", back_populates="group")

from db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func


class Link(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link"

    link_id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=True)
    description = Column(String, nullable=True)
    views = Column(Integer, default=0)
    created_by = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

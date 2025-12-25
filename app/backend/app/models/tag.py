from db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func


class Tag(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "tag"

    tag_id = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

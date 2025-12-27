from db.base import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID as DB_UUID
from sqlalchemy.orm import relationship


class LinkHistory(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link_history"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(
        Integer,
        ForeignKey("public.user_info.user_id", ondelete="CASCADE"),
    )
    link_id = Column(
        DB_UUID,
        ForeignKey("public.link.link_id", ondelete="CASCADE"),
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="histories")
    link = relationship("Link", back_populates="histories")

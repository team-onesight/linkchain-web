from db.base import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.dialects.postgresql import UUID as DB_UUID
from sqlalchemy.orm import relationship


class LinkUserMap(Base):
    __table_args__ = {"schema": "public"}
    __tablename__ = "link_user_map"

    id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(
        Integer,
        ForeignKey("public.user_info.user_id", ondelete="CASCADE"),
        nullable=False,
    )
    link_id = Column(
        DB_UUID,
        ForeignKey("public.link.link_id", ondelete="CASCADE"),
        nullable=False,
    )

    is_public = Column(Boolean, server_default="true", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="link_maps")
    link = relationship("Link", back_populates="user_maps")

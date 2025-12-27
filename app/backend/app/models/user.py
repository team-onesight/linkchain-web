from db.base import Base
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
from utils.vector import VECTOR


class User(Base):
    """
    user_info 테이블 모델
    """

    __table_args__ = {"schema": "public"}
    __tablename__ = "user_info"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    user_embedding = Column(VECTOR(768), nullable=True)  # 1536차원 vector
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    link_maps = relationship("LinkUserMap", back_populates="user")
    histories = relationship(
        "LinkHistory", back_populates="user", cascade="all, delete-orphan"
    )

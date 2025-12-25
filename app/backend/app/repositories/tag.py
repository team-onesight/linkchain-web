from models.tag import Tag
from sqlalchemy.orm import Session


class TagRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_tags(self, limit: int = 5):
        return self.db.query(Tag).order_by(Tag.created_at.desc()).limit(limit).all()

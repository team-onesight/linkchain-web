from models.link import Link
from sqlalchemy.orm import Session


class LinkRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_link_from_db(self, link_id: int):
        return self.db.query(Link).filter(Link.link_id == link_id).first()

from models.link_user_map import LinkUserMap
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


class LinkUserMapRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_link_user_map(self, link_id: str, user_id: int):
        return self.db.query(LinkUserMap).filter(
            LinkUserMap.link_id == link_id,
            LinkUserMap.user_id == user_id
        ).first()

    def create_link_user_map(self, link_id: str, user_id: int, is_public: bool = True):
        new_link_user_map = LinkUserMap(link_id=link_id, user_id=user_id, is_public=is_public)
        try:
            self.db.add(new_link_user_map)
            self.db.commit()
            self.db.refresh(new_link_user_map)
            
            return new_link_user_map
        except IntegrityError as e:
            self.db.rollback()
            print(f"Error while creating link_user_map: {e}")
            raise e


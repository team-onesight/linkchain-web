# services/link_service.py
from repositories.link import LinkRepository


class LinkService:
    def __init__(self, repository: LinkRepository):
        self.repository = repository

    def get_link(self, link_id: int):
        return self.repository.get_link_from_db(link_id)

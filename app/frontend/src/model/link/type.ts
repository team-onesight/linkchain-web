import type {Tag} from "../tag/type";

type LinkType = "News" | "Blog" | "Video" | "Default";

interface LinksGroup {
  name: string;
  description?: string;
  links: LinkItem[];
}

interface LinkItem {
  link_id: string;
  url: string;
  imageUrl: string;
  title: string;
  description: string;
  views: number;
  created_by_user_id: number;
  created_by_username: string;
  tags: Tag[];
}

interface MyLinksResponse {
  items: LinkItem[];
  next_cursor: number | null;
  has_more: boolean;
}

interface PostLinkRequest {
  url: string;
}

interface SearchLinksResponse {
    items: LinkItem[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export type { LinkItem, LinkType, LinksGroup, PostLinkRequest, MyLinksResponse, SearchLinksResponse };

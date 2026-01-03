import type {Tag} from "../tag/type";

type LinkType = "News" | "Blog" | "Video" | "Default";

interface LinksGroup {
  name: string;
  description?: string;
  links: LinkItem[];
}

interface LinkItem {
  id: string // deprecated, use link_id instead
  link_id: string;
  userId?: string;
  url: string;
  imageUrl: string;
  title: string;
  description: string;
  tags: Tag[];
  created_at: string;
  linkType: LinkType;
}

interface MyLinksResponse {
  items: LinkItem[];
  next_cursor: number | null;
  has_more: boolean;
}

interface SearchLinksResponse {
  items: LinkItem[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

interface PostLinkRequest {
  url: string;
}

export type {LinkItem, LinkType, LinksGroup, PostLinkRequest, MyLinksResponse, SearchLinksResponse};

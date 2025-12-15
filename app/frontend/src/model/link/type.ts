import type { Tag } from "../tag/type";

type LinkType = "News" | "Blog" | "Video" | "Default";

interface LinksGroup {
  name: string;
  description?: string;
  links: LinkItem[];
}

interface LinkItem {
  id: string;
  userId?: string;
  url: string;
  imageUrl: string;
  title: string;
  description: string;
  tags: Tag[];
  created_at: string;
  linkType: LinkType;
}

export type { LinkItem, LinkType, LinksGroup };

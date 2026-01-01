import type {LinkItem} from "@/model/link/type";

interface User {
  user_id: number;
  username: string;
}

interface UserLinksResponse {
    items: LinkItem[];
    next_cursor: number | null;
    has_more: boolean;
}

interface LinkHistoryItem {
  link_id: string;
  url: string;
  image_url: string | null;
  title: string | null;
  description: string | null;
  views: number;
  created_at: string;
}

interface GroupedLinkHistory {
  date: string;
  items: LinkHistoryItem[];
}

export type { User, LinkHistoryItem, GroupedLinkHistory, UserLinksResponse };

import type { LinkItem } from "@/model/link/type";

interface User {
  user_id: number;
  username: string;
}

interface UserLinksResponse {
  items: LinkItem[];
  next_cursor: number | null;
  has_more: boolean;
}

interface UserLinkHistoryResponse {
  total: number;
  link_groups: UserLinkHistoryGroup[];
}

interface UserLinkHistoryGroup {
  date: string;
  items: UserLinkHistoryItem[];
}

interface UserLinkHistoryItem {
  link_id: string;
  url: string;
  title?: string;
  description?: string;
  views: number;
  created_at: string;
}

interface UserSimilarResponse {
  similar_users: {
    user_id: number;
    username: string;
  }[];
}

export type {
  User,
  UserLinkHistoryGroup,
  UserLinkHistoryResponse,
  UserLinksResponse,
  UserLinkHistoryItem,
  UserSimilarResponse,
};

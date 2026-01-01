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

export type {User, UserLinksResponse};
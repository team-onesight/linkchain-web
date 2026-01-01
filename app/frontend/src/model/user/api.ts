import type { User, UserLinksResponse, LinkHistoryItem } from "@/model/user/type";
import type { BaseError } from "@/model/common/type.ts";

const usersAPI = async (): Promise<User[]> => {
  const response = await fetch("/mocks/users.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as User[];
};

const fetchUser = async (user_id: number): Promise<User> => {
  const response = await fetch(`/api/v1/users/${user_id}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as User;
};

const fetchUserLinks = async (
  user_id: number,
  size: number = 20,
  cursor: number | undefined
): Promise<UserLinksResponse> => {
  const params = new URLSearchParams();
  params.append("size", size.toString());
  cursor && params.append("cursor", cursor.toString());

  const response = await fetch(`/api/v1/users/${user_id}/links?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as UserLinksResponse;
};

const fetchMyLinkHistory = async () => {
  const response = await fetch(`/api/v1/users/`);
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      location.href = "/login";
    }
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as LinkHistoryItem[];
};

export { usersAPI, fetchUser, fetchUserLinks, fetchMyLinkHistory };

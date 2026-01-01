import type {User, UserLinksResponse} from "@/model/user/type";

const usersAPI = async (): Promise<User[]> => {
  const response = await fetch("/mocks/users.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json() as User[];
};

const fetchUser = async (user_id: number): Promise<User> => {
    const response = await fetch(`/api/v1/users/${user_id}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return await response.json() as User;
}


const fetchUserLinks = async (user_id: number, size: number = 20, cursor: number | undefined): Promise<UserLinksResponse> => {
    const params = new URLSearchParams();
    params.append("size", size.toString());
    cursor && params.append("cursor", cursor.toString());

    const response = await fetch(`/api/v1/users/${user_id}/links?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return await response.json() as UserLinksResponse;
}

export {usersAPI, fetchUser, fetchUserLinks};
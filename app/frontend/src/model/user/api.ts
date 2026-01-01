import type { User } from "./type";
import type { BaseError } from "@/model/common/type.ts";

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
};

export { usersAPI, userAPI };

import type { User } from "./type";
import type { BaseError } from "@/model/common/type.ts";

const usersAPI = async (): Promise<User[]> => {
  const response = await fetch("/mocks/users.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json() as User[];
};

const userAPI = async (user_id: number): Promise<User | undefined> => {
  const response = await fetch("/api/v1/users/{}".replace("{}", String(user_id)), {});
  if (!response.ok) {
    const data = await response.json() as BaseError;
    throw new Error(data.detail);
  }

  return await response.json() as User;
};

export { usersAPI, userAPI };

import type { User } from "./type";

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch("/mocks/users.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchUser = async (id: string): Promise<User | undefined> => {
  const response = await fetch("/mocks/users.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const users: User[] = await response.json();
  return users.find((user) => user.id === id);
};

export { fetchUsers, fetchUser };

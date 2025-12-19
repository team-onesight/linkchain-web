import type { AuthResponse } from "@/model/auth/type.ts";

const loginAPI = async (username: string, password: string) => {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("아이디/비밀번호를 다시 확인해주세요.");
  }

  return await response.json() as AuthResponse;
};

const logoutAPI = async () => {
  await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};

const checkSessionAPI = async () => {
  const response = await fetch("/api/v1/auth", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Session invalid");
  return await response.json() as AuthResponse;
};

export { loginAPI, logoutAPI, checkSessionAPI };

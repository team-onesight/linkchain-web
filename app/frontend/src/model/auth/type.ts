import type { User } from "@/model/user/type.ts";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (id: string, password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthResponse {
  user_id: number;
  username: string;
}


export type { AuthState, AuthResponse };

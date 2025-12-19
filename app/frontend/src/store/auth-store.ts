import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { checkSessionAPI, loginAPI, logoutAPI } from "@/model/auth/api.ts";
import type { AuthState } from "@/model/auth/type.ts";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await loginAPI(username, password);

          set({
            user: { user_id: data.user_id, username: data.username },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      logout: async () => {
        try {
          await logoutAPI();
        } catch (error) {
          console.error("Logout failed", error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      refreshSession: async () => {
        set({ isLoading: true });
        try {
          const data = await checkSessionAPI();
          set({
            user: {
              user_id: data.user_id,
              username: data.username,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

import { useQuery } from "@tanstack/react-query";
import { fetchUser, usersAPI } from "@/model/user/api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersAPI(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUser = (user_id?: number) => {
  return useQuery({
    queryKey: ["users", user_id],
    queryFn: () => fetchUser(user_id!),
    enabled: !!user_id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};



import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUsers } from "@/model/user/api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUser = (id?: string | undefined) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

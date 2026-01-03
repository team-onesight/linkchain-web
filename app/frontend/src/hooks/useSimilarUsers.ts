import { fetchSimilarUsers } from "@/model/user/api.ts";
import { useQuery } from "@tanstack/react-query";

export const useSimilarUsers = (count: number = 3) => {
  return useQuery({
    queryKey: ["users", "similar"],
    queryFn: () => {
      return fetchSimilarUsers(count);
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

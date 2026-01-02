import { useQuery } from "@tanstack/react-query";
import { fetchMyLinkHistory } from "@/model/user/api.ts";

export const useMyLinkHistory = () => {
  return useQuery({
    queryKey: ["links", "history"],
    queryFn: () => {
      return fetchMyLinkHistory();
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

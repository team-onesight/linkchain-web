import { fetchLinkGroups } from "@/model/link/api.ts";
import { useQuery } from "@tanstack/react-query";

export const useLinkGroup = () => {
  return useQuery({
    queryKey: ["links", "group"],
    queryFn: () => fetchLinkGroups(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

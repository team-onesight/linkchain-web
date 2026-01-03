import { fetchLinkGroups } from "@/model/link/api.ts";
import { useQuery } from "@tanstack/react-query";

export const useLinkGroup = () => {
  return useQuery({
    queryKey: ["links", "group"],
    queryFn: () => fetchLinkGroups(),
    retry: 1,
  });
};

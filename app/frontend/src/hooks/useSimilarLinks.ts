import { useQuery } from "@tanstack/react-query";
import { fetchSimilarLinks } from "@/model/link/api.ts";

export const useSimilarLinks = (link_id: string, size: number = 10) => {
  return useQuery({
    queryKey: ["links", "similar"],
    queryFn: () => {
      return fetchSimilarLinks(link_id, size);
    },
    retry: 1,
  });
};

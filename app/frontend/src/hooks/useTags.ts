import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/model/tag/api";

export const useTags = (limit: number = 5) => {
  return useQuery({
    queryKey: ["tags", limit],
    queryFn: () => fetchTags(limit),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

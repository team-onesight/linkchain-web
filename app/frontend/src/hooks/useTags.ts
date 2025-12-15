import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/model/tag/api";

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

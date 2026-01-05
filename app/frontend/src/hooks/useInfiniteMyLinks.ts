import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMyLinks } from "@/model/link/api.ts";

const useInfiniteMyLinks = (size: number = 20, start_date?: string, end_date?: string) => {
  return {
    query: useInfiniteQuery({
      queryKey: ["links", "my", start_date, end_date, size],
      queryFn: ({ pageParam }) =>
        fetchMyLinks(size, start_date, end_date, pageParam as number | undefined),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage.has_more || lastPage.next_cursor === null) {
          return undefined;
        }
        return lastPage.next_cursor;
      },
      retry: 1,
    }),
  };
};

export { useInfiniteMyLinks };

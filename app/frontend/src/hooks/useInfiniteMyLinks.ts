import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchMyLinks} from "@/model/link/api.ts";

const useInfiniteMyLinks = (size: number = 20) => {
    return {
        query: useInfiniteQuery({
            queryKey: ["links", "my", size],
            queryFn: ({pageParam}) =>
                fetchMyLinks(
                    size,
                    pageParam as number | undefined,
                ),
            initialPageParam: undefined as number | undefined,
            getNextPageParam: (lastPage) => {
                if (!lastPage.has_more || lastPage.next_cursor === null) {
                    return undefined;
                }
                return lastPage.next_cursor;
            }
        })
    }
}

export {useInfiniteMyLinks};

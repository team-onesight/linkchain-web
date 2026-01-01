import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchUserLinks} from "@/model/user/api.ts";

const useInfiniteUserLinks = (user_id: number | undefined, size: number = 20) => {
    return {
        query: useInfiniteQuery({
            queryKey: ["links", "user", user_id, size],
            queryFn: ({pageParam}) =>
                fetchUserLinks(
                    user_id as number,
                    size,
                    pageParam as number | undefined,
                ),
            initialPageParam: undefined as number | undefined,
            getNextPageParam: (lastPage) => {
                if (!lastPage.has_more || lastPage.next_cursor === null) {
                    return undefined;
                }
                return lastPage.next_cursor;
            },
            enabled: !!user_id,
            retry: 1
        })
    }
}

export {useInfiniteUserLinks};
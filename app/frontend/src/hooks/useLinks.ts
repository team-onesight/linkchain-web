import { useQuery } from "@tanstack/react-query";
import { fetchLink, fetchLinksV2 } from "@/model/link/api";

interface UseLinksParams {
  q?: string | null;
  tag?: string | null;
  linkId?: string | null;
  groupName?: string | null;
  userId?: string | null;
  groupBy?: "date" | "tag" | "trending";
}

export const useLink = (id: string | undefined) => {
  return useQuery({
    queryKey: ["links", id],
    queryFn: () => fetchLink(id!),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useLinks = ({ q, tag, linkId, userId, groupName, groupBy }: UseLinksParams = {}) => {
  console.log("useLinksV2 params:", { q, tag, linkId, userId, groupName, groupBy });
  const query = useQuery({
    queryKey: ["linksV2", { q, tag, userId, groupBy }],
    queryFn: () => fetchLinksV2({ q, tag, userId, groupBy }),
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return {
    query,
    concat_groups: () => {
      if (!query.data) return [];
      return query.data.reduce(
        (acc, group) => {
          return acc.concat(group.links);
        },
        [] as (typeof query.data)[0]["links"]
      );
    },
  };
};

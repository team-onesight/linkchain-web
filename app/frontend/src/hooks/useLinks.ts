import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLink, fetchLinks, postLink, postLinkView, searchLinks } from "@/model/link/api";

interface UseLinksParams {
  q?: string | null;
  tag?: string | null;
  link_id?: string | null;
  group_name?: string | null;
  group_by?: "date" | "tag" | "trending";
  user_id?: number | null;
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

export const useLinks = ({
  q,
  tag,
  link_id,
  user_id,
  group_name,
  group_by,
}: UseLinksParams = {}) => {
  console.log(link_id);

  const query = useQuery({
    queryKey: ["links", { q, tag, user_id, group_name, group_by }],
    queryFn: () => fetchLinks({ q, tag, user_id, group_by }),
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

export const useLinkView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postLinkView(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", "history"] });
    },
  });
};

export const useCreateLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => postLink({ url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });
};

interface UseSearchLinksParams {
  query?: string | null;
  tag?: string | null;
  page?: number;
  size?: number;
}

export const useSearchLinks = ({
  query,
  tag,
  page = 1,
  size = 10,
}: UseSearchLinksParams) => {
  return useQuery({
    queryKey: ["links", "search", { query, tag, page, size }],
    queryFn: () => searchLinks({ query, tag, page, size }),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!(query || tag),
  });
};

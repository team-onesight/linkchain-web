import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { fetchLink, postLink, postLinkView, searchLinks } from "@/model/link/api";

export const useLink = (id: string | undefined) => {
  return useQuery({
    queryKey: ["links", id],
    queryFn: () => fetchLink(id!),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
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
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (url: string) => postLink({ url }),
    onSuccess: (response: { link_id: string; user_id: string }) => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast("is bookmarked", {
        description: "The link has been added to your bookmarks.",
        position: "top-center",
        action: {
          label: "View",
          onClick: () => {
            navigate(`/links/${response.link_id}`);
          },
        },
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to bookmark", {
        description: error.message || "Something went wrong.",
        position: "top-center",
      });
    },
  });
};

interface UseSearchLinksParams {
  query?: string | null;
  tag?: string | null;
  group_id?: string | null;
  page?: number;
  size?: number;
}

export const useSearchLinks = ({
  query,
  tag,
  group_id,
  size = 10,
}: Omit<UseSearchLinksParams, "page">) => {
  return useInfiniteQuery({
    queryKey: ["links", "search", { query, tag, group_id, size }],
    queryFn: ({ pageParam = 1 }) => searchLinks({ query, tag, group_id, page: pageParam, size }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length < lastPage.total_pages ? allPages.length + 1 : undefined;
    },
    retry: 1,
  });
};

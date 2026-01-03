import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  page?: number;
  size?: number;
}

export const useSearchLinks = ({ query, tag, page = 1, size = 10 }: UseSearchLinksParams) => {
  return useQuery({
    queryKey: ["links", "search", { query, tag, page, size }],
    queryFn: () => searchLinks({ query, tag, page, size }),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!(query || tag),
  });
};

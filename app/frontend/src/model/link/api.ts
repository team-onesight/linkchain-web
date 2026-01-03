import type {
  LinkItem,
  LinksGroup,
  PostLinkRequest,
  MyLinksResponse,
  SearchLinksResponse,
} from "@/model/link/type";

const searchLinks = async ({
  query,
  tag,
  page = 1,
  size = 10,
}: {
  query?: string | null;
  tag?: string | null;
  page?: number;
  size?: number;
}): Promise<SearchLinksResponse> => {
  const params = new URLSearchParams();

  if (query) params.append("query", query);
  if (tag) params.append("tag", tag);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const url = `/api/v1/links/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as SearchLinksResponse;
};

const fetchLink = async (id: string): Promise<LinkItem | undefined> => {
  const response = await fetch(`/api/v1/links/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as LinkItem;
};

const postLinkView = async (linkId: string) => {
  const response = await fetch(`/api/v1/links/${linkId}/view`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
};

const postLink = async (payload: PostLinkRequest) => {
  const response = await fetch("/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.detail || "Network response was not ok";
    const errorCode = response.status || "unknown_error";
    throw new Error(errorMessage, { cause: errorCode });
  }
  return await response.json();
};

const fetchMyLinks = async (
  size: number = 20,
  cursor: number | undefined
): Promise<MyLinksResponse> => {
  const params = new URLSearchParams();
  params.append("size", size.toString());
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  cursor && params.append("cursor", cursor.toString());

  const response = await fetch(`/api/v1/links/my?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as MyLinksResponse;
};

const fetchLinkGroups = async () => {
  const response = await fetch("/api/v1/groups");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as LinksGroup[];
};

const fetchSimilarLinks = async (link_id: string, size: number = 10) => {
  const response = await fetch(`/api/v1/links/${link_id}/similar?size=${size}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return (await response.json()) as LinkItem[];
};

export {
  fetchLink,
  postLinkView,
  postLink,
  fetchMyLinks,
  searchLinks,
  fetchLinkGroups,
  fetchSimilarLinks,
};

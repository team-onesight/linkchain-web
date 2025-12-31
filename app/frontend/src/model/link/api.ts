import type {LinkItem, LinksGroup} from "@/model/link/type";

type GroupByType = "date" | "tag" | "trending";

const fetchLinks = async ({
                            q,
                            tag,
                            user_id,
                            group_by,
                          }: {
  q?: string | null;
  tag?: string | null;
  user_id?: number | null;
  group_by?: GroupByType;
}): Promise<LinksGroup[]> => {
  console.log("Fetching links v2 with groupBy:", q, tag, user_id, group_by);
  const response = await fetch("/mocks/links.json", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as LinksGroup[];
};

const fetchLink = async (id: string): Promise<LinkItem | undefined> => {
  const response = await fetch("/mocks/links.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const links: LinksGroup[] = await response.json();

  for (const group of links) {
    const foundLink = group.links.find((link) => link.id === id);
    if (foundLink) {
      return foundLink;
    }
  }
  return undefined;
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


export {fetchLink, fetchLinks, postLinkView};

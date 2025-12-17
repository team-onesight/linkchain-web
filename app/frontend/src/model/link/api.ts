import type {LinkItem, LinksGroup} from "@/model/link/type";

type GroupByType = "date" | "tag" | "trending";

const fetchLinks = async ({
                            q,
                            tag,
                            userId,
                            groupBy,
                          }: {
  q?: string | null;
  tag?: string | null;
  userId?: string | null;
  groupBy?: GroupByType;
}): Promise<LinksGroup[]> => {
  console.log("Fetching links v2 with groupBy:", q, tag, userId, groupBy);
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

export {fetchLinks, fetchLink, fetchLinks as fetchLinksV2};

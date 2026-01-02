import type { Tag } from "./type";

const fetchTags = async (limit: number = 5): Promise<Tag[]> => {
  const params = new URLSearchParams({ limit: limit.toString() });

  const response = await fetch(`/api/v1/tags?${params}`, {});
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export { fetchTags };

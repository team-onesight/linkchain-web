import type { Tag } from "./type";

const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch("/mocks/tags.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export { fetchTags };

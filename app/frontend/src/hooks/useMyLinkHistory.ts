import { useQuery } from "@tanstack/react-query";
import { fetchMyLinkHistory } from "@/model/user/api.ts";
import type { GroupedLinkHistory, LinkHistoryItem } from "@/model/user/type.ts";

const transformGroups = (data: LinkHistoryItem[]): GroupedLinkHistory[] => {
  const groups = data.reduce(
    (acc, item) => {
      const dateKey = item.created_at.split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, LinkHistoryItem[]>
  );

  return Object.keys(groups)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => ({
      date,
      items: groups[date],
    }));
};

export const useMyLinkHistory = () => {
  return useQuery({
    queryKey: ["links", "history"],
    queryFn: () => fetchMyLinkHistory(),
    retry: 1,
    select: (data) => transformGroups(data),
    refetchOnWindowFocus: false,
  });
};

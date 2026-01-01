import { Card } from "@components/ui/card.tsx";
import { useNavigate } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import type { LinkHistoryItem } from "@/model/user/type.ts";
import { cn } from "@/lib/utils.ts";

interface LinkHistoryCardProps {
  item: LinkHistoryItem;
}

export const LinkHistoryCard = ({ item }: LinkHistoryCardProps) => {
  const navigate = useNavigate();

  if (!item) {
    return null;
  }

  const { link_id, title, url, image_url, created_at, views } = item;

  const timeString = new Date(created_at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className={cn(
        "flex flex-row items-center gap-3 p-2 sm:p-3 w-full",
        "cursor-pointer group transition-colors duration-200",
        "hover:bg-accent/50 border-transparent hover:border-border", // 호버 시 경계선 및 배경 강조
        "rounded-lg shadow-sm hover:shadow-md" // 그림자 효과 조절
      )}
    >
      <div className='relative flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-muted border border-border/40'>
        <img
          src={image_url || "/images/default_link_image.png"}
          alt={title || "링크 이미지"}
          className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
        />
      </div>

      <div className='flex flex-col grow min-w-0 gap-0.5 pr-2'>
        <h3 className='text-sm sm:text-base font-medium leading-tight truncate'>
          {title || "제목 없음"}
        </h3>

        <p className='text-[11px] sm:text-xs text-muted-foreground truncate opacity-80'>{url}</p>
      </div>

      <div className='flex flex-col items-end justify-center gap-1 text-[10px] sm:text-xs text-muted-foreground flex-shrink-0 font-medium'>
        <div className='flex items-center gap-1 whitespace-nowrap'>
          <Clock className='w-3 h-3' />
          <span>{timeString}</span>
        </div>

        <div className='flex items-center gap-1 whitespace-nowrap opacity-70'>
          <Eye className='w-3 h-3 ml-0.5' />
          <span>{views}</span>
        </div>
      </div>
    </Card>
  );
};

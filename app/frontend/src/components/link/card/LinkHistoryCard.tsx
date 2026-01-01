import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { Eye, Clock } from "lucide-react";
import type { LinkHistoryItem } from "@/model/user/type.ts";

interface LinkHistoryCardProps {
  item: LinkHistoryItem;
}

export function LinkHistoryCard({ item }: LinkHistoryCardProps) {
  const navigate = useNavigate();

  if (!item) {
    return null;
  }

  const { link_id, title, description, url, image_url, created_at, views } = item;

  const timeString = new Date(created_at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className='flex h-full flex-col min-h-[140px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group py-4'
    >
      <CardHeader className='p-0 px-4'>
        <AspectRatio.Root ratio={16 / 9}>
          <img
            src={image_url || "/images/default_link_image.png"}
            alt={title || "링크 이미지"}
            className='object-cover w-full h-full rounded-lg transition-transform duration-300 group-hover:scale-105 border border-border/50'
          />
        </AspectRatio.Root>
      </CardHeader>

      <CardContent className='p-4 pt-3 grow flex flex-col gap-1'>
        <CardTitle className='text-base leading-snug line-clamp-2 font-semibold'>
          {title || "제목 없음"}
        </CardTitle>

        <CardDescription className='line-clamp-2 text-xs text-muted-foreground'>
          {description || "설명이 없습니다."}
        </CardDescription>

        <CardDescription className='line-clamp-1 text-[10px] text-muted-foreground/70 break-all'>
          {url}
        </CardDescription>
      </CardContent>

      <CardFooter className='p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground'>
        <div className='flex items-center gap-1'>
          <Clock className='w-3 h-3' />
          <span>{timeString}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Eye className='w-3 h-3' />
          <span>{views}회 조회</span>
        </div>
      </CardFooter>
    </Card>
  );
}

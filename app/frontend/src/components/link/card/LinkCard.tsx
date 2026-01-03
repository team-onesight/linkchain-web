import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { LinkItem } from "@/model/link/type";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { LinkCardFooter } from "./CardFooter";

interface LinkCardProps {
  link: LinkItem;
  onBookmark?: (url: string) => void;
}

export function LinkCard({ link, onBookmark }: LinkCardProps) {
  const navigate = useNavigate();

  if (!link) {
    return null;
  }

  const { link_id, title, description, imageUrl, url } = link;

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className='flex h-full flex-col min-h-[140px] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group py-4'
    >
      <CardHeader className='p-0'>
        <AspectRatio.Root ratio={16 / 9}>
          <img
            src={imageUrl || "/images/default_link_image.png"}
            alt={title}
            className='object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105'
          />
        </AspectRatio.Root>
      </CardHeader>
      <CardContent className='p-3 grow'>
        <CardTitle className='text-base leading-snug line-clamp-2 font-semibold mb-1'>
          {title || "제목 없음"}
        </CardTitle>
        <div>
          <CardDescription className='line-clamp-2 text-xs'>
            {description || "추가된 설명이 없습니다."}
          </CardDescription>
          <CardDescription className='line-clamp-2 text-xs'>{url}</CardDescription>
        </div>
      </CardContent>
      <LinkCardFooter link={link} onBookmark={onBookmark} />
    </Card>
  );
}

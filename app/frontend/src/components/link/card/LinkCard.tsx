import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { LinkItem } from "@/model/link/type";
import { LinkCardFooter } from "./CardFooter";

interface LinkCardProps {
  link: LinkItem;
  onBookmark?: (url: string) => void;
}

export function LinkCard({ link, onBookmark }: LinkCardProps) {
  const navigate = useNavigate();

  if (!link) return null;

  const { link_id, title, description, image_url, url } = link;

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className='flex flex-col overflow-hidden hover:shadow-md transition-all cursor-pointer group p-3 gap-1 items-start h-[245px] rounded-xl'
    >
      <div className='w-full'>
        <CardTitle className='pt-1 pl-1 text-[14px] leading-tight line-clamp-1 font-bold group-hover:text-primary transition-colors'>
          {title || "제목 없음"}
        </CardTitle>
        <span className='text-[10px] text-muted-foreground opacity-60 line-clamp-1 pl-1 underline break-all'>
          {url}
        </span>
      </div>

      <CardContent className='flex flex-row justify-start p-0 overflow-hidden gap-3 items-center w-full grow mt-2'>
        <div className='relative flex-shrink-0 w-20 h-20 min-w-[80px] max-w-[80px] overflow-hidden rounded-md bg-muted'>
          <img
            src={image_url || "/images/default_link_image.png"}
            alt={title}
            className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-110'
          />
        </div>

        <div className='flex flex-col grow min-w-0'>
          <CardDescription className='text-[12px] leading-snug line-clamp-4 text-muted-foreground pr-1'>
            {description || "추가된 설명이 없습니다."}
          </CardDescription>
        </div>
      </CardContent>
      <div
        className='flex flex-row justify-between mt-auto w-full border-t pt-2 border-transparent'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='w-full'>
          <LinkCardFooter link={link} onBookmark={onBookmark} />
        </div>
      </div>
    </Card>
  );
}

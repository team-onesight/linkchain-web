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

  const { link_id, title, description, imageUrl, url } = link;

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className='flex flex-col  overflow-hidden hover:shadow-md transition-all cursor-pointer group p-3 gap-1 items-start
      mh-[255px] h-[245px] rounded-xl

      '
    >
      <CardTitle className='pt-2 pl-2 text-[14px] leading-tight line-clamp-1 font-bold group-hover:text-primary transition-colors'>
        {title || "제목 없음"}
      </CardTitle>
      <span className='text-[10px] text-muted-foreground opacity-60 line-clamp-1 pl-2 underline'>
        {url}
      </span>
      <CardContent className='flex flex-row justify-start p-0 overflow-hidden gap-1 items-center w-full grow'>
        <div className='relative flex-shrink-0 w20 h-20 overflow-hidden rounded-md bg-muted'>
          <img
            src={imageUrl || "/images/default_link_image.png"}
            alt={title}
            className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-110'
          />
        </div>
        <div className='flex flex-col gap-0.5'>
          <CardDescription className='text-[12px] leading-snug line-clamp-4 text-muted-foreground pr-2 grow'>
            {description || "추가된 설명이 없습니다."}
          </CardDescription>
        </div>
      </CardContent>
      <div className='flex-row justify-between mt-auto w-full' onClick={(e) => e.stopPropagation()}>
        <div className='origin-right pt-2'>
          <LinkCardFooter link={link} onBookmark={onBookmark} />
        </div>
      </div>
    </Card>
  );
}

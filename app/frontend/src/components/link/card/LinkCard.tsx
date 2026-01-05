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
      className='flex flex-row h-[110px] overflow-hidden hover:shadow-md transition-all cursor-pointer group p-2 gap-3 items-center'
    >
      <div className='relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-muted'>
        <img
          src={imageUrl || "/images/default_link_image.png"}
          alt={title}
          className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-110'
        />
      </div>

      <CardContent className='flex flex-col justify-between p-0 overflow-hidden grow h-20'>
        <div className='flex flex-col gap-0.5'>
          <CardTitle className='text-[14px] leading-tight line-clamp-1 font-bold group-hover:text-primary transition-colors'>
            {title || "제목 없음"}
          </CardTitle>

          <CardDescription className='text-[12px] leading-snug line-clamp-1 text-muted-foreground pr-1'>
            {description || "추가된 설명이 없습니다."}
          </CardDescription>
        </div>

        <div
          className='flex items-center justify-between mt-auto'
          onClick={(e) => e.stopPropagation()}
        >
          <span className='text-[10px] text-muted-foreground opacity-60'>{url}</span>

          <div className='scale-90 origin-right'>
            <LinkCardFooter link={link} onBookmark={onBookmark} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

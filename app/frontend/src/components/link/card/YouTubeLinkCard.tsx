import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {PlayCircle} from "lucide-react";
import type {LinkItem as LinkItemType} from "@/model/link/type";
import {useNavigate} from "react-router-dom";
import {LinkCardFooter} from "./CardFooter";

interface YouTubeLinkCardProps {
  link: LinkItemType;
}

export function YouTubeLinkCard({link}: YouTubeLinkCardProps) {
  const navigate = useNavigate();

  if (!link) {
    return null;
  }

  const {id, title, description, imageUrl} = link;

  return (
    <Card
      onClick={() => navigate(`/links/${id}`)}
      className='flex flex-col h-full overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer'
    >
      <CardHeader className='p-0 relative'>
        <AspectRatio.Root ratio={16 / 9}>
          <img src={imageUrl} alt={title} className='rounded-t-lg object-cover w-full h-full'/>
        </AspectRatio.Root>
        <div
          className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
          <PlayCircle className='h-12 w-12 text-white'/>
        </div>
      </CardHeader>
      <CardContent className='grow p-3'>
        <CardTitle className='text-base font-semibold leading-snug line-clamp-2'>
          {title.substring(0, 20) + (title.length > 20 ? "..." : "")}
        </CardTitle>
        <CardDescription className='text-xs text-gray-600 line-clamp-2 mt-1'>
          {description}
        </CardDescription>
      </CardContent>
      <LinkCardFooter link={link}/>
    </Card>
  );
}

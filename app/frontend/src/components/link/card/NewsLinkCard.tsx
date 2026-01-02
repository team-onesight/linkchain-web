import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LinkItem as LinkItemType } from "@/model/link/type";
import { useNavigate } from "react-router-dom";
import { LinkCardFooter } from "./CardFooter";

interface NewsLinkCardProps {
  link: LinkItemType;
}

export const NewsLinkCard = ({ link }: NewsLinkCardProps) => {
  const navigate = useNavigate();

  if (!link) {
    return null;
  }

  const { link_id, title, description, imageUrl } = link;

  return (
    <Card
      onClick={() => navigate(`/links/${link_id}`)}
      className='flex flex-col h-full overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer'
    >
      <CardHeader className='p-0'>
        <AspectRatio.Root ratio={16 / 9}>
          <img src={imageUrl} alt={title} className='rounded-t-lg object-cover w-full h-full' />
        </AspectRatio.Root>
      </CardHeader>
      <CardContent className='grow p-3'>
        <CardTitle className='text-base font-semibold leading-snug line-clamp-2'>{title}</CardTitle>
        <p className='text-xs text-gray-600 line-clamp-2 mt-1'>{description}</p>
      </CardContent>
      <LinkCardFooter link={link} />
    </Card>
  );
};

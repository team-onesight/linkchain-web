import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink } from "lucide-react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import type { LinkItem } from "@/model/link/type";
import { useCreateLink } from "@/hooks/useLinks.ts";

interface LinkDetailViewProps {
  link: LinkItem;
}

export function LinkDetailView({ link }: LinkDetailViewProps) {
  const { mutate: createLink, isPending: isCreatingLink } = useCreateLink();
  const handleBookmark = () => {
    createLink(link.url);
  };

  return (
    <div className='mx-auto'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>{link.title || "제목을 찾는 중..."}</h1>

      <div className='flex items-center gap-4 mb-6 text-muted-foreground text-sm'>
        <a
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='truncate underline underline-offset-2 hover:text-primary'
        >
          {link.url}
        </a>
        <div className='flex items-center gap-2 ml-auto mr-1'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={handleBookmark}
            disabled={isCreatingLink}
          >
            <Bookmark className='h-4 w-4' />
          </Button>
          <a href={link.url} target='_blank' rel='noopener noreferrer'>
            <Button variant='outline' size='icon' className='h-8 w-8'>
              <ExternalLink className='h-4 w-4' />
            </Button>
          </a>
        </div>
      </div>

      <p className='text-base text-gray-700 mb-6'>{link.description || "설명을 찾는 중..."}</p>

      <div className='space-y-4 mb-8'>
        <h3 className='text-sm font-semibold'>TAGs</h3>
        <div className='flex flex-wrap gap-2'>
          {link.tags.map((tag) => (
            <Badge key={tag.tag_id} variant='secondary' className='pl-3 pr-1 py-1 text-sm'>
              {tag.tag_name}
              <button className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted-foreground/20 p-0.5'></button>
            </Badge>
          ))}
        </div>
      </div>

      <AspectRatio.Root ratio={16 / 9} className='bg-muted rounded-lg border'>
        <iframe
          src={link.url}
          className='w-full h-full rounded-lg'
          title={link.title}
          sandbox='allow-scripts allow-same-origin'
        />
      </AspectRatio.Root>
      <p className='text-xs text-center text-muted-foreground mt-2'>
        Note: Some websites may not be available for preview.
      </p>
    </div>
  );
}

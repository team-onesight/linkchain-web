import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import type { LinkItem } from "@/model/link/type";
import { Bookmark, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LinkCardFooter = ({ link }: { link: LinkItem }) => {
  const navigate = useNavigate();
  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.stopPropagation();

    navigate(`/search?tag=${encodeURIComponent(tagName)}`);
  };
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast("is bookmarked", {
      description: "The link has been added to your bookmarks.",
      position: "top-center",
      action: {
        label: "Undo",

        onClick: () => console.log("Undo"),
      },
    });
  };

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };
  return (
    <CardFooter className='flex flex-col items-end p-1 pt-0 gap-3 pr-2'>
      {link.tags && link.tags.length > 0 && (
        <div className='flex flex-wrap gap-1 mr-auto ml-2'>
          {link.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant='default'
              className='text-xs'
              onClick={(e) => handleTagClick(e, tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
      <div className='flex flex-row flex-nowrap gap-1'>
        <Button variant='outline' size='icon' className='h-8 w-8' onClick={handleBookmark}>
          <Bookmark className='h-5 w-5' />
        </Button>
        <Button variant='outline' size='icon' className='h-8 w-8' onClick={handleExternalLinkClick}>
          <ExternalLink className='h-5 w-5' />
        </Button>
      </div>
    </CardFooter>
  );
};

export { LinkCardFooter };

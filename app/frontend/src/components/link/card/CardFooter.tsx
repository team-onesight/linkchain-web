import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import type { LinkItem } from "@/model/link/type";
import { Bookmark, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LinkCardFooter = ({
  link,
  onBookmark,
}: {
  link: LinkItem;
  onBookmark?: (url: string) => void;
}) => {
  const navigate = useNavigate();
  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.stopPropagation();

    navigate(`/search?tag_name=${encodeURIComponent(tagName)}`);
  };
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onBookmark && onBookmark(link?.url);
  };

  const handleUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/users/${link.created_by_user_id}/links`);
  };

  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link.url, "_blank", "noopener,noreferrer");
  };
  return (
    <CardFooter className='flex grow flex-col items-end p-1 pt-0 gap-3 pr-2 w-full'>
      {link.tags && link.tags.length > 0 && (
        <div className='flex flex-wrap gap-1 mr-auto ml-2'>
          {link.tags.map((tag) => (
            <Badge
              key={tag.tag_id}
              variant='default'
              className='text-xs'
              onClick={(e) => handleTagClick(e, tag.tag_name)}
            >
              {tag.tag_name}
            </Badge>
          ))}
        </div>
      )}
      <div className='flex flex-row flex-nowrap gap-1 w-full justify-end'>
        {link.created_by_username && link.created_by_user_id && (
          <Badge variant='outline' className='h-8 cursor-pointer mr-auto ml-2' onClick={handleUser}>
            작성자: {link.created_by_username}
          </Badge>
        )}
        {onBookmark && (
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8 cursor-pointer'
            onClick={handleBookmark}
          >
            <Bookmark className='h-5 w-5' />
          </Button>
        )}
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8 cursor-pointer'
          onClick={handleExternalLinkClick}
        >
          <ExternalLink className='h-5 w-5' />
        </Button>
      </div>
    </CardFooter>
  );
};

export { LinkCardFooter };

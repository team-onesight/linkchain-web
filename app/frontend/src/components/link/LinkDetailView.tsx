import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Tag as TagIcon, FileText } from "lucide-react";
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

  const hasTags = link.tags && link.tags.length > 0;
  const hasDescription = link.description && link.description.length > 0;

  return (
    <div className='mx-auto w-full max-w-3xl'>
      <h1 className='text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-50 leading-tight'>
        {link.title || "제목 없음"}
      </h1>

      <div className='flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800'>
        <a
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-muted-foreground truncate underline underline-offset-4 hover:text-primary transition-colors max-w-full sm:max-w-md'
        >
          {link.url}
        </a>

        <div className='flex items-center gap-2 sm:ml-auto'>
          <Button
            variant='outline'
            size='sm'
            className='gap-2'
            onClick={handleBookmark}
            disabled={isCreatingLink}
          >
            <Bookmark className='h-4 w-4' />
            {isCreatingLink ? "저장 중..." : "북마크"}
          </Button>
          <a href={link.url} target='_blank' rel='noopener noreferrer'>
            <Button variant='secondary' size='sm' className='gap-2'>
              <ExternalLink className='h-4 w-4' />
              방문하기
            </Button>
          </a>
        </div>
      </div>

      <div className='mb-10'>
        <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
          <FileText className='w-4 h-4 text-gray-400' />
          Description
        </h3>
        {hasDescription ? (
          <p className='text-base leading-relaxed text-gray-700 dark:text-gray-300 break-words'>
            {link.description}
          </p>
        ) : (
          <div className='p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed text-sm text-muted-foreground'>
            제공된 설명이 없습니다.
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold flex items-center gap-2'>
          <TagIcon className='w-4 h-4 text-gray-400' />
          Tags
        </h3>

        {hasTags ? (
          <div className='flex flex-wrap gap-2'>
            {link.tags.map((tag) => (
              <Badge
                key={tag.tag_id}
                variant='secondary'
                className='px-3 py-1.5 text-sm font-normal hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              >
                #{tag.tag_name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className='text-sm text-muted-foreground flex items-center gap-2'>
            등록된 태그가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

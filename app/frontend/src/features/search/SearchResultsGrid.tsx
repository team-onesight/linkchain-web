import { motion } from "framer-motion";
import { useCreateLink, useSearchLinks } from "@/hooks/useLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { LinkCard } from "@/components/link/card/LinkCard";

interface SearchResultsGridProps {
  q?: string | null;
  tag?: string | null;
  group_id?: string | null;
}

export const SearchResultsGrid = ({ q, tag, group_id }: SearchResultsGridProps) => {
  const pageSize = 10;

  const { ref, inView } = useInView();
  const { mutate: createLink } = useCreateLink();

  const handleBookmark = (url: string) => {
    createLink(url);
  };

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useSearchLinks(
    {
      query: q,
      tag: tag,
      group_id,
      size: pageSize,
    }
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <GridSkeleton />;

  if (error) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-red-500'>Error loading search results.</p>
      </div>
    );
  }

  const allLinks = data?.pages.flatMap((page) => page.items) || [];

  if (allLinks.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-gray-500'>No links found.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <motion.div
        className='grid grid-cols-1 gap-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {allLinks.map((link) => (
          <LinkCard key={link.link_id} link={link} onBookmark={handleBookmark} />
        ))}
      </motion.div>

      <div ref={ref} className='py-8 flex justify-center'>
        {isFetchingNextPage ? (
          <div className='flex gap-2'>
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce' />
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]' />
            <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]' />
          </div>
        ) : hasNextPage ? (
          <div className='h-10' />
        ) : (
          <p className='text-sm text-gray-400'>모든 링크를 불러왔습니다.</p>
        )}
      </div>
    </div>
  );
};

const GridSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className='h-[120px] w-full rounded-xl' />
    ))}
  </div>
);

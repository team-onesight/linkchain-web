import { useEffect, useRef, Fragment } from "react";
import { motion } from "framer-motion";
import { SectionContainer } from "@/components/styled/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteMyLinks } from "@/hooks/useInfiniteMyLinks.ts";
import { LinkCard } from "@components/link/card/LinkCard.tsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const MyRecentLinks = () => {
  const { query } = useInfiniteMyLinks(20);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (query.isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && query.hasNextPage) {
        void query.fetchNextPage();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => observer.current?.disconnect();
  }, [query.isFetchingNextPage, query.hasNextPage, query.data]);

  if (query.isLoading) return <MyRecentLinksSkeleton />;

  return (
    <SectionContainer className='pt-0'>
      <h2 className='text-2xl font-bold mb-4'>저장된 링크 목록</h2>
      <div className='space-y-8'>
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 gap-4'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          {query.data && query.data.pages[0].items.length === 0 ? (
            <p className='text-muted-foreground'>등록된 링크가 없습니다.</p>
          ) : (
            query.data?.pages.map((page, pageIndex) => (
              <Fragment key={`page-${pageIndex}-${page.next_cursor}`}>
                {page.items.map((link, linkIndex) => {
                  const isLastItem =
                    pageIndex === query.data!.pages.length - 1 &&
                    linkIndex === page.items.length - 1;

                  return (
                    <div
                      key={`${link.link_id}-${pageIndex}`}
                      ref={isLastItem ? lastElementRef : null}
                    >
                      <LinkCard link={link} />
                    </div>
                  );
                })}
              </Fragment>
            ))
          )}
        </motion.div>

        {query.isFetchingNextPage && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
            <Skeleton className='h-36 rounded-xl' />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

const MyRecentLinksSkeleton = () => (
  <SectionContainer className='pt-0'>
    <Skeleton className='h-8 w-48 mb-4' />
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <Skeleton className='h-36 rounded-xl' />
      <Skeleton className='h-36 rounded-xl' />
    </div>
  </SectionContainer>
);

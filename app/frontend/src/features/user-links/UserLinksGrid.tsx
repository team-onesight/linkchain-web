import {useEffect, useRef, Fragment} from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { getLinkCardComponent } from "@/components/link/LinkCardFactory";
import type { UseQueryResult } from "@tanstack/react-query";
import type { User } from "@/model/user/type";
import { useInfiniteUserLinks } from "@/hooks/useInfiniteUserLinks.ts";

export const UserLinksGrid = ({ user }: { user: UseQueryResult<User | undefined, Error> }) => {
  const { query } = useInfiniteUserLinks(user.data?.user_id);
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


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  if (query.isLoading) {
    return <GridSkeleton />;
  }
  
  const links = query.data?.pages.flatMap((page) => page.items) ?? [];

  if (links.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">
          {user ? "아직 큐레이션된 링크가 없습니다." : "사용자를 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {query.data?.pages.map((page, pageIndex) => (
            <Fragment key={`page-${pageIndex}-${page.next_cursor}`}>
                {page.items.map((link, linkIndex) => {
                    const isLastItem =
                        pageIndex === query.data!.pages.length - 1 &&
                        linkIndex === page.items.length - 1;
                    const CardComponent = getLinkCardComponent(link.linkType);
                    return (
                        <div
                            key={`${link.link_id}-${pageIndex}`}
                            ref={isLastItem ? lastElementRef : null}
                        >
                            <CardComponent link={link}/>
                        </div>
                    );
                })}
            </Fragment>
        ))}
      </motion.div>
      {query.isFetchingNextPage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
          </div>
      )}
    </div>
  );
};

const GridSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  </div>
);

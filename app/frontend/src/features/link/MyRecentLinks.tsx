import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionContainer } from "@/components/styled/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteMyLinks } from "@/hooks/useInfiniteMyLinks.ts";
import { LinkCard } from "@components/link/card/LinkCard.tsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const DATE_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "오늘", value: "today" },
  { label: "최근 7일", value: "7d" },
  { label: "최근 30일", value: "30d" },
];

export const MyRecentLinks = () => {
  const [filter, setFilter] = useState("all");

  const dateParams = useMemo(() => {
    if (filter === "all") return { start_date: undefined, end_date: undefined };
    const end = new Date();
    const start = new Date();
    end.setSeconds(0, 0);

    if (filter === "today") start.setHours(0, 0, 0, 0);
    else if (filter === "7d") start.setDate(end.getDate() - 7);
    else if (filter === "30d") start.setDate(end.getDate() - 30);

    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  }, [filter]);

  const { query } = useInfiniteMyLinks(20, dateParams.start_date, dateParams.end_date);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤 관찰자 설정
  useEffect(() => {
    if (query.isFetching || query.isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          void query.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }
    return () => observer.current?.disconnect();
  }, [query.isFetching, query.isFetchingNextPage, query.hasNextPage, query.data]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filter]);

  // 데이터 평탄화 및 태그 가공 로직
  const allLinks = useMemo(() => {
    if (!query.data) return [];

    return query.data.pages.flatMap((page) =>
      page.items.map((link) => {
        // 중복 태그 제거 및 최대 5개 제한
        const uniqueTags = Array.from(
          new Map(link.tags?.map((tag) => [tag.tag_name, tag])).values()
        ).slice(0, 5);

        return { ...link, tags: uniqueTags };
      })
    );
  }, [query.data]);

  return (
    <SectionContainer className='pt-0 relative'>
      <h2 className='text-2xl font-bold mb-4'>저장된 링크 목록</h2>

      <div className='sticky top-0 z-20 flex items-center gap-1.5 overflow-x-auto py-3 mb-4 scrollbar-hide bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-transparent'>
        <Calendar size={16} className='text-muted-foreground mr-1 hidden sm:block' />
        {DATE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={filter === opt.value ? "default" : "secondary"}
            size='sm'
            onClick={() => setFilter(opt.value)}
            className='rounded-full px-4 h-8 text-xs font-medium transition-all active:scale-95 flex-shrink-0'
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className='space-y-8'>
        {query.isLoading ? (
          <div className='grid grid-cols-1 gap-4'>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className='h-36 rounded-xl' />
            ))}
          </div>
        ) : (
          <motion.div
            className='grid grid-cols-1 gap-4'
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            initial='hidden'
            animate='visible'
          >
            <AnimatePresence mode='popLayout'>
              {allLinks.length === 0 ? (
                <motion.p
                  key='empty-state'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='text-muted-foreground py-10 text-center col-span-full'
                >
                  해당 기간에 등록된 링크가 없습니다.
                </motion.p>
              ) : (
                allLinks.map((link, index) => {
                  const isLastItem = index === allLinks.length - 1;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={link.link_id}
                      ref={isLastItem ? lastElementRef : null}
                    >
                      <LinkCard link={link} />
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {query.isFetchingNextPage && (
          <div className='grid grid-cols-1 gap-4 mt-4'>
            <Skeleton className='h-36 rounded-xl' />
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

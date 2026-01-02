import { motion } from "framer-motion";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LinkHistoryCard } from "@components/history/LinkHistoryCard.tsx";
import { useMyLinkHistory } from "@/hooks/useMyLinkHistory.ts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const formatDateHeader = (dateStr: string) => {
  const targetDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const toDateString = (date: Date) => date.toISOString().split("T")[0];

  if (dateStr === toDateString(today)) return "오늘";
  if (dateStr === toDateString(yesterday)) return "어제";

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(targetDate);
};

const HistorySkeleton = () => (
  <div className='space-y-8'>
    {[1, 2].map((group) => (
      <div key={group} className='space-y-3'>
        <Skeleton className='h-6 w-24 mb-2' />
        <div className='space-y-2'>
          <Skeleton className='h-[60px] w-full rounded-lg' />
          <Skeleton className='h-[60px] w-full rounded-lg' />
          <Skeleton className='h-[60px] w-full rounded-lg' />
        </div>
      </div>
    ))}
  </div>
);

const EmptyHistoryState = () => (
  <div className='flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500'>
    <div className='bg-muted/50 p-6 rounded-full mb-4'>
      <History className='w-10 h-10 text-muted-foreground/50' />
    </div>
    <h3 className='text-xl font-semibold mb-2'>방문 기록이 없습니다</h3>
    <p className='text-muted-foreground max-w-sm'>
      링크를 클릭하여 확인한 페이지들이 이곳에 날짜별로 정리됩니다.
    </p>
  </div>
);

export const MyLinkHistories = () => {
  const query = useMyLinkHistory();
  const hasHistory = query.data && query.data.total > 0;

  if (query.isLoading) {
    return <HistorySkeleton />;
  }

  if (!hasHistory) {
    return <EmptyHistoryState />;
  }

  return (
    <div className='space-y-8 pb-20'>
      {query.data.link_groups.map((group) => (
        <section key={group.date} className='relative'>
          <div className='flex items-center mb-3 sticky top-[60px] z-10 bg-background/95 backdrop-blur-sm py-2'>
            <h2 className='text-base font-bold flex items-center gap-2 text-foreground'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary' />
              {formatDateHeader(group.date)}
            </h2>
            <span className='text-xs text-muted-foreground ml-2 mt-0.5 font-normal opacity-70'>
              {group.date}
            </span>
          </div>

          <motion.div
            key={group.date}
            className='flex flex-col gap-2'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {group.items.map((link, idx) => (
              <motion.div key={idx} variants={itemVariants} initial='hidden' animate='visible'>
                <LinkHistoryCard item={link} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
    </div>
  );
};

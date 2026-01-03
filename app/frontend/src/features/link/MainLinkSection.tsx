import { useState } from "react";
import { useCreateLink } from "@/hooks/useLinks";
import { motion, AnimatePresence } from "framer-motion";
import { LinkCard } from "@components/link/card/LinkCard.tsx";
import { useLinkGroup } from "@/hooks/useLinkGroup.ts";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LinkItem, LinksGroup } from "@/model/link/type.ts";

export const MainLinkSection = () => {
  const query = useLinkGroup();
  const { mutate: createLink } = useCreateLink();

  const handleBookmark = (url: string) => {
    createLink(url);
  };

  if (query.isLoading) {
    return (
      <div className='w-full h-96 animate-pulse bg-gray-100 rounded-lg max-w-[600px] mx-auto mt-8' />
    );
  }

  return (
    <main className='w-full flex flex-col items-center pb-20'>
      <div className='w-full max-w-[600px] px-4 sm:px-0 space-y-12'>
        {query.data?.map((group) => (
          <GroupSection key={group.group_title} group={group} onBookmark={handleBookmark} />
        ))}
      </div>
    </main>
  );
};

const GroupSection = ({
  group,
  onBookmark,
}: {
  group: LinksGroup;
  onBookmark: (url: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalCount = group.items?.length || 0;
  const hasMore = totalCount > 4;

  const visibleItems = isExpanded ? group.items : group.items?.slice(0, 4) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex items-center justify-between px-1'>
        <h2 className='text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100'>
          {group.group_title}
        </h2>
        {hasMore && (
          <span className='text-xs text-gray-400'>
            {isExpanded ? `전체 ${totalCount}개` : `${totalCount}개 중 4개`}
          </span>
        )}
      </div>

      <motion.div
        className='grid grid-cols-1 gap-4'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        layout
      >
        <AnimatePresence initial={false} mode='popLayout'>
          {visibleItems.map((link: LinkItem) => (
            <motion.div
              key={link.link_id}
              variants={itemVariants}
              layout
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <LinkCard link={link} onBookmark={onBookmark} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.button
          layout
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center justify-center w-full py-3 mt-2 text-sm font-medium text-gray-500 transition-all bg-gray-50/50 border border-dashed border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:scale-[0.98]'
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} className='mr-1' /> 접기
            </>
          ) : (
            <>
              <ChevronDown size={16} className='mr-1' /> + {totalCount - 4}개 더보기
            </>
          )}
        </motion.button>
      )}
    </section>
  );
};

import { useNavigate } from "react-router-dom";
import { useCreateLink } from "@/hooks/useLinks";
import { motion } from "framer-motion";
import { LinkCard } from "@components/link/card/LinkCard.tsx";
import { useLinkGroup } from "@/hooks/useLinkGroup.ts";
import { ChevronRight } from "lucide-react";
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
          <GroupSection key={group.group_id} group={group} onBookmark={handleBookmark} />
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
  const navigate = useNavigate();
  const totalCount = group.total_links || 0;
  const hasMore = totalCount > 5;

  return (
    <section className='relative flex flex-col gap-4'>
      <div className='sticky top-0 z-10 flex items-center justify-between px-0 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm transition-all'>
        <div
          className='flex items-baseline gap-2 justify-between w-full'
          onClick={() =>
            navigate(
              `/search?group_id=${group.group_id}&group_title=${encodeURIComponent(group.group_title)}`
            )
          }
        >
          <h2 className='text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-xl'>
            {group.group_title}
          </h2>
          <span className='text-[11px] text-primary font-bold uppercase tracking-wider opacity-80'>
            {totalCount} links
          </span>
        </div>
      </div>

      <motion.div
        className='grid grid-cols-1 gap-3'
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {group.items?.map((link: LinkItem) => (
          <LinkCard key={link.link_id} link={link} onBookmark={onBookmark} />
        ))}
      </motion.div>

      {hasMore && (
        <button
          onClick={() =>
            navigate(
              `/search?group_id=${group.group_id}&group_title=${encodeURIComponent(group.group_title)}`
            )
          }
          className='flex items-center justify-center py-3.5 mt-2 text-sm font-bold text-primary transition-all bg-primary/5 rounded-xl hover:bg-primary/10 active:scale-[0.98] border border-primary/10'
        >
          <span className='mr-1'>{totalCount - 5}개 더보기</span>
          <ChevronRight size={16} />
        </button>
      )}
    </section>
  );
};

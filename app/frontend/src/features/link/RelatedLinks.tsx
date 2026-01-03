import { useCreateLink } from "@/hooks/useLinks";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LinkCard } from "@components/link/card/LinkCard.tsx";
import { useSimilarLinks } from "@/hooks/useSimilarLinks.ts";
import { SearchX } from "lucide-react";

interface RelatedLinksProps {
  currentLinkId: string;
}

export const RelatedLinks = ({ currentLinkId }: RelatedLinksProps) => {
  const query = useSimilarLinks(currentLinkId, 10);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const { mutate: createLink } = useCreateLink();
  const handleBookmark = (url: string) => {
    createLink(url);
  };

  if (query.isLoading) {
    return <RelatedLinksSkeleton />;
  }

  const hasLinks = query.data && query.data.length > 0;

  return (
    <>
      <Separator className='my-12' />
      <section>
        <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Related Links</h2>

        {hasLinks ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {query.data?.map((link) => (
              <motion.div
                key={link.link_id}
                variants={itemVariants}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
              >
                <LinkCard link={link} onBookmark={handleBookmark} />
              </motion.div>
            ))}
          </div>
        ) : (
          <NoLinksFeedback />
        )}
      </section>
    </>
  );
};

const NoLinksFeedback = () => (
  <div className='flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50/50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl'>
    <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4'>
      <SearchX className='w-6 h-6 text-gray-400' />
    </div>
    <h3 className='text-base font-medium text-gray-900 dark:text-gray-100'>
      관련된 링크를 찾을 수 없어요
    </h3>
    <p className='text-sm text-gray-500 mt-1 max-w-xs'>
      아직 이 링크와 유사한 콘텐츠가 수집되지 않았습니다.
    </p>
  </div>
);

const RelatedLinksSkeleton = () => (
  <>
    <Separator className='my-12' />
    <div>
      <Skeleton className='h-8 w-48 mb-6' />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Skeleton className='h-36 rounded-xl' />
        <Skeleton className='h-36 rounded-xl' />
      </div>
    </div>
  </>
);

import { motion } from "framer-motion";
import { useLinks } from "@/hooks/useLinks";
import { Skeleton } from "@/components/ui/skeleton";
import { getLinkCardComponent } from "@/components/link/LinkCardFactory";

interface SearchResultsGridProps {
  q: string | null;
  tag: string | null;
}
export const SearchResultsGrid = ({ q, tag }: SearchResultsGridProps) => {
  const { query, concat_groups } = useLinks({ q, tag });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (query.isLoading) {
    return <GridSkeleton />;
  }

  if (!query.data || query.data.length === 0) {
    return (
      <div className='text-center py-20'>
        <p className='text-xl text-gray-500'>No links found.</p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 gap-4'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {concat_groups()?.map((link) => {
          const CardComponent = getLinkCardComponent(link.linkType);
          return (
            <motion.div key={link.id} variants={itemVariants}>
              <CardComponent link={link} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

const GridSkeleton = () => (
  <div className='space-y-8'>
    <div>
      <Skeleton className='h-8 w-48 mb-4' />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Skeleton className='h-36 w-full' />
      </div>
    </div>
  </div>
);

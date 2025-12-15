import { useLinks } from "@/hooks/useLinks";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getLinkCardComponent } from "@/components/link/LinkCardFactory";
import { motion } from "framer-motion";

interface RelatedLinksProps {
  currentLinkId: string;
}

export const RelatedLinks = ({ currentLinkId }: RelatedLinksProps) => {
  const { query, concat_groups } = useLinks({
    linkId: currentLinkId,
  });
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (query.isLoading) {
    return <RelatedLinksSkeleton />;
  }

  const relatedLinks = concat_groups()?.filter((l) => l.id !== currentLinkId) || [];
  if (relatedLinks.length === 0) {
    return null;
  }

  return (
    <>
      <Separator className='my-12' />
      <div>
        <h2 className='text-2xl font-bold mb-4'>Related Links</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {relatedLinks.map((link) => {
            const CardComponent = getLinkCardComponent(link.linkType);
            return (
              <motion.div key={link.id} variants={itemVariants}>
                <CardComponent link={link} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const RelatedLinksSkeleton = () => (
  <>
    <Separator className='my-12' />
    <div>
      <Skeleton className='h-8 w-48 mb-4' />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Skeleton className='h-36' />
        <Skeleton className='h-36' />
      </div>
    </div>
  </>
);

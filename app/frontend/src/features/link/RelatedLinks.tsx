import { useCreateLink, useSearchLinks } from "@/hooks/useLinks";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { LinkCard } from "@components/link/card/LinkCard.tsx";

interface RelatedLinksProps {
  currentLinkId: string;
}

export const RelatedLinks = ({ currentLinkId }: RelatedLinksProps) => {
  console.log(currentLinkId);
  const query = useSearchLinks({});
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

  return (
    <>
      <Separator className='my-12' />
      <div>
        <h2 className='text-2xl font-bold mb-4'>Related Links</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {query.data?.items.map((link) => (
            <motion.div key={link.link_id} variants={itemVariants}>
              <LinkCard link={link} onBookmark={handleBookmark} />
            </motion.div>
          ))}
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

import {motion} from "framer-motion";
import {SectionContainer} from "@/components/styled/layout";
import {useLinks} from "@/hooks/useLinks";
import {Skeleton} from "@/components/ui/skeleton";
import {getLinkCardComponent} from "@/components/link/LinkCardFactory";

export const MyRecentLinks = () => {
  const {query, concat_groups} = useLinks({userId: "1", groupBy: "date"});
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {staggerChildren: 0.1, delayChildren: 0.2},
    },
  };

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {y: 0, opacity: 1},
  };

  if (query.isLoading) {
    return <MyRecentLinksSkeleton/>;
  }

  if (Object.keys(query.data || {}).length === 0) {
    return null;
  }

  return (
    <SectionContainer className='pt-0'>
      <h2 className='text-2xl font-bold mb-4'>My Recent Links</h2>
      <div className='space-y-8'>
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 gap-4'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{once: true}}
        >
          {concat_groups()?.map((link) => {
            const CardComponent = getLinkCardComponent(link.linkType);
            return (
              <motion.div key={link.id} variants={itemVariants}>
                <CardComponent link={link}/>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionContainer>
  );
};

const MyRecentLinksSkeleton = () => (
  <SectionContainer className='pt-0'>
    <Skeleton className='h-8 w-48 mb-4'/>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <Skeleton className='h-36'/>
      <Skeleton className='h-36'/>
    </div>
  </SectionContainer>
);

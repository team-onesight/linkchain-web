import {Header} from "@/components/layout/Header";
import {getLinkCardComponent} from "@/components/link/LinkCardFactory";
import {PageContainer, SectionContainer} from "@/components/styled/layout";
import {Skeleton} from "@/components/ui/skeleton";
import {useLinks} from "@/hooks/useLinks";
import {motion} from "framer-motion";

const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {y: 20, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
  },
};

const GridSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
    <Skeleton className='h-40 w-full'/>
    <Skeleton className='h-40 w-full'/>
    <Skeleton className='h-40 w-full'/>
    <Skeleton className='h-40 w-full'/>
  </div>
);

const LinkPage = () => {
  const {query} = useLinks({
    group_by: "date",
  });

  return (
    <PageContainer>
      <Header/>
      <SectionContainer>
        <h1 className='text-3xl md:text-4xl font-bold mb-8'>All Links</h1>
        {query.isLoading ? (
          <GridSkeleton/>
        ) : (
          <div className='space-y-8'>
            {(query.data || []).map((group) => (
              <div key={group.name}>
                <h2 className='text-xl font-bold mb-4 pb-2 border-b'>{group.name}</h2>
                <motion.div
                  className='grid grid-cols-1 sm:grid-cols-2 gap-4'
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                >
                  {group.links.map((link) => {
                    const CardComponent = getLinkCardComponent(link.linkType);
                    return (
                      <motion.div key={link.id} variants={itemVariants}>
                        <CardComponent link={link}/>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </SectionContainer>
    </PageContainer>
  );
};

export default LinkPage;

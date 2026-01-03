import { SectionContainer, SectionTitle } from "@/components/styled/layout";
import { useCreateLink, useLinks } from "@/hooks/useLinks";
import { motion } from "framer-motion";
import { LinkCard } from "@components/link/card/LinkCard.tsx";

export const MainLinkSection = () => {
  const { query } = useLinks({
    group_by: "trending",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const { mutate: createLink } = useCreateLink();
  const handleBookmark = (url: string) => {
    createLink(url);
  };

  {
    return (
      <div className='space-y-8'>
        {(query.data || []).map((group) => (
          <SectionContainer key={group.name}>
            <SectionTitle>{group.description}</SectionTitle>
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 gap-4'
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
            >
              {group.links.map((link) => (
                <motion.div key={link.link_id} variants={itemVariants}>
                  <LinkCard link={link} onBookmark={handleBookmark} />
                </motion.div>
              ))}
            </motion.div>
          </SectionContainer>
        ))}
      </div>
    );
  }
};

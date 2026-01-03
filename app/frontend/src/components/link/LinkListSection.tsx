import { SectionContainer, SectionTitle } from "@/components/styled/layout";
import { motion } from "framer-motion";
import type { LinksGroup } from "@/model/link/type";
import { LinkCard } from "@components/link/card/LinkCard.tsx";

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

export const LinkListSection = ({ linksGroup }: { linksGroup: LinksGroup }) => {
  return (
    <SectionContainer>
      <SectionTitle>{linksGroup.description}</SectionTitle>
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 gap-4'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        {linksGroup.items.map((link) => {
          return (
            <motion.div key={link.link_id} variants={itemVariants}>
              <LinkCard link={link} />
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
};

import {SectionContainer, SectionTitle} from "@/components/styled/layout";
import {motion} from "framer-motion";
import {getLinkCardComponent} from "@/components/link/LinkCardFactory";
import type {LinksGroup} from "@/model/link/type";

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

export const LinkListSection = ({linksGroup}: { linksGroup: LinksGroup }) => {
  return (
    <SectionContainer>
      <SectionTitle>{linksGroup.description}</SectionTitle>
      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 gap-4'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{once: true}}
      >
        {linksGroup.links.map((link) => {
          const CardComponent = getLinkCardComponent(link.linkType);
          return (
            <motion.div key={link.id} variants={itemVariants}>
              <CardComponent link={link}/>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionContainer>
  );
};

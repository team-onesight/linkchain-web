import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {SectionContainer} from "@/components/styled/layout";
import {Badge} from "@/components/ui/badge";
import {TrendingUp} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Link} from "react-router-dom";
import {animate, motion} from "framer-motion";
import {useEffect, useRef} from "react";
import {useTags} from "@/hooks/useTags";
import {Skeleton} from "@/components/ui/skeleton";

const containerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {staggerChildren: 0.07, delayChildren: 0.2},
  },
};

const itemVariants = {
  hidden: {y: 20, opacity: 0},
  visible: {y: 0, opacity: 1},
};

export const TodayStatsSection = () => {
  const linksSavedToday = 128;
  const {data: trendingTags, isLoading} = useTags();

  return (
    <SectionContainer>
      <Card className='bg-gray-50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
            <TrendingUp className='h-5 w-5'/>
            Today's LINKs
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>오늘 새로 저장된 링크</p>
            <Counter to={linksSavedToday}/>
          </div>
          <Separator/>
          <motion.div
            className='flex flex-wrap flex-col gap-2 justify-center'
            variants={containerVariants}
            key={isLoading ? "loading" : "loaded"}
            initial='hidden'
            animate='visible'
          >
            <div className='text-center'>
              <p className='text-sm text-muted-foreground'>요즘 뜨는 키워드</p>
            </div>
            <div className='flex flex-wrap gap-2 justify-center'>
              {isLoading ? (
                <>
                  <Skeleton className='h-6 w-24 rounded-full'/>
                  <Skeleton className='h-6 w-16 rounded-full'/>
                  <Skeleton className='h-6 w-32 rounded-full'/>
                </>
              ) : (
                trendingTags?.map((tag) => (
                  <motion.div key={tag.id} variants={itemVariants}>
                    <Link to={`/search?tag=${tag.name}`}>
                      <Badge variant='default' className='hover:bg-primary/80 transition-colors'>
                        {tag.name}
                      </Badge>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </SectionContainer>
  );
};

const Counter = ({to}: { to: number }) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, to, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = Math.round(value).toString();
      },
    });

    return () => controls.stop();
  }, [to]);

  return <p ref={nodeRef} className='text-5xl font-bold tracking-tighter text-blue-600'/>;
};

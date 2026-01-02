import { PageContainer, SectionContainer } from "@/components/styled/layout";
import { CalendarClock } from "lucide-react";
import { MyLinkHistories } from "@/features/history/MyLinkHistories.tsx";

const HistoryPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <div className='mb-8 space-y-2 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4'>
          <div className='flex items-center gap-2'>
            <CalendarClock className='w-8 h-8 text-primary' />
            <h1 className='text-3xl md:text-4xl font-bold'>방문 기록</h1>
          </div>
          <p className='text-muted-foreground pl-1'>최근 확인한 링크들을 날짜별로 모아봅니다.</p>
        </div>
        <MyLinkHistories />
      </SectionContainer>
    </PageContainer>
  );
};

export default HistoryPage;

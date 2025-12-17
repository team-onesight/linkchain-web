import {PageContainer} from "@/components/styled/layout";
import {UserRecommendationList} from "@/features/user-links/UserRecommendationList";
import {Header} from "@/components/layout/Header";
import {StickyAddLinkForm} from "@/features/link/StickyAddLinkForm";
import {TodayStatsSection} from "@/features/link/TodayStatsSection";
import {MainLinkSection} from "@/features/link/MainLinkSection";

const HomePage = () => {
  return (
    <PageContainer>
      <Header/>
      <TodayStatsSection/>
      <UserRecommendationList/>
      <MainLinkSection/>
      <StickyAddLinkForm/>
    </PageContainer>
  );
};

export default HomePage;

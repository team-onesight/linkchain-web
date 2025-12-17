import {PageContainer} from "@/components/styled/layout";
import {ProfileHeader} from "@/features/user-info/ProfileHeader";
import {StatsCard} from "@/features/user-info/StatsCard";
import {MyRecentLinks} from "@/features/link/MyRecentLinks";
import {useUser} from "@/hooks/useUsers";

const MyPage = () => {
  const user = useUser("1");
  return (
    <PageContainer>
      <ProfileHeader user={user}/>
      {user.isFetched && user.data?.id && <StatsCard userId={user.data?.id}/>}
      <MyRecentLinks/>
    </PageContainer>
  );
};

export default MyPage;

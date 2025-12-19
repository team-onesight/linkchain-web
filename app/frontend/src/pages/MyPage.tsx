import { PageContainer } from "@/components/styled/layout";
import { MyRecentLinks } from "@/features/link/MyRecentLinks";
import { useUser } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/auth-store.ts";
import { ProfileHeader } from "@/features/user/ProfileHeader.tsx";
import { StatsCard } from "@/features/user/StatsCard.tsx";

const MyPage = () => {
  const { user, isLoading } = useAuthStore();
  const userQuery = useUser(user?.user_id);
  return (
    <PageContainer>
      <ProfileHeader user={userQuery} />
      {isLoading && user?.user_id && <StatsCard />}
      <MyRecentLinks />
    </PageContainer>
  );
};

export default MyPage;

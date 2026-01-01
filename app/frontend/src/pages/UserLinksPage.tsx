import { Link, useParams, useNavigate } from "react-router-dom";
import { PageContainer, SectionContainer } from "@/components/styled/layout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserLinksGrid } from "@/features/user-links/UserLinksGrid";
import { useUser } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/features/user/ProfileHeader.tsx";
import { StatsCard } from "@/features/user/StatsCard.tsx";
import { useAuthStore } from "@/store/auth-store.ts";
import { useEffect } from "react";

const UserLinksPage = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const user = useUser(user_id ? parseInt(user_id, 10) : undefined);
  const { user: authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser?.user_id && user_id && parseInt(user_id, 10) === authUser.user_id) {
      navigate("/my");
    }
  }, [authUser, user_id, navigate]);

  return (
    <PageContainer>
      <Header />
      <ProfileHeader user={user} />
      {user.data && <StatsCard />}
      <SectionContainer>
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          {user.isLoading ? (
            <Skeleton className="h-9 w-48" />
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold text-center sm:text-right">
              {user.data ? `${user.data.username}'s Curations` : "User Not Found"}
            </h1>
          )}
        </div>

        {user_id && <UserLinksGrid user={user} />}
      </SectionContainer>
    </PageContainer>
  );
};

export default UserLinksPage;

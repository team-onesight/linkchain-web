import { Link, useParams } from "react-router-dom";
import { PageContainer, SectionContainer } from "@/components/styled/layout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserLinksGrid } from "@/features/user-links/UserLinksGrid";
import { useUser } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/features/user-info/ProfileHeader";
import { StatsCard } from "@/features/user-info/StatsCard";

const UserLinksPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useUser(userId);

  return (
    <PageContainer>
      <Header />
      <ProfileHeader user={user} />
      {userId && <StatsCard userId={userId} />}
      <SectionContainer>
        <div className='flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
          <Button asChild variant='outline'>
            <Link to='/'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Link>
          </Button>
          {user.isLoading ? (
            <Skeleton className='h-9 w-48' />
          ) : (
            <h1 className='text-2xl md:text-3xl font-bold text-center sm:text-right'>
              {user.data ? `${user.data.name}'s Curations` : "User Not Found"}
            </h1>
          )}
        </div>

        {userId && <UserLinksGrid user={user} />}
      </SectionContainer>
    </PageContainer>
  );
};

export default UserLinksPage;

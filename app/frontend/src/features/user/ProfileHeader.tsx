import { SectionContainer } from "@/components/styled/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/model/user/type";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { UseQueryResult } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store.ts";

export const ProfileHeader = ({ user }: { user: UseQueryResult<User | undefined, Error> }) => {
  const { logout, user: authUser } = useAuthStore();
  if (user.isLoading) {
    return <ProfileHeaderSkeleton />;
  } else if (!user.data) {
    return <UserNotFoundComponent />;
  } else {
    const avatarIndex = parseInt(String(user.data.user_id % 5), 10);
    const isMyProfile = authUser?.user_id === user.data.user_id;

    return (
      <SectionContainer className="pt-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src={`/avatars/${avatarIndex}.png`} alt={user.data?.username} />
            <AvatarFallback>{user.data?.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="text-3xl font-bold">{user.data?.username}</h1>
            {/*<p className='text-muted-foreground mt-1'>{user.data?.bio}</p>*/}
          </div>
          {isMyProfile && (
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          )}
        </div>
      </SectionContainer>
    );
  }
};

const ProfileHeaderSkeleton = () => (
  <SectionContainer className="pt-8">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  </SectionContainer>
);

const UserNotFoundComponent = () => (
  <SectionContainer className="pt-8">
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl text-gray-500">사용자를 찾을 수 없습니다.</p>
    </div>
  </SectionContainer>
);

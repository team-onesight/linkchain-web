import { UserCard } from "@/components/user/UserCard";
import { HorizontalScrollWrapper, SectionContainer, SectionTitle } from "@/components/styled/layout";
import { useUsers } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";

const UserListSkeleton = () => (
  <HorizontalScrollWrapper>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="w-[220px] h-[228px] rounded-xl" />
    ))}
  </HorizontalScrollWrapper>
);

export function UserRecommendationList() {
  const { data: users, isLoading } = useUsers();


  return (
    <SectionContainer>
      <SectionTitle>나와 관심사가 비슷한 큐레이터</SectionTitle>
      {isLoading ? (
        <UserListSkeleton />
      ) : (
        <HorizontalScrollWrapper>
          {users?.map((user) => (
            <UserCard
              key={user.user_id}
              user_id={user.user_id}
              username={user.username}
              avatarUrl={`https://i.pravatar.cc/150?u=${user.user_id}`}
              // tags={user.bio.split(" ").slice(0, 2)}
            />
          ))}
        </HorizontalScrollWrapper>
      )}
    </SectionContainer>
  );
}

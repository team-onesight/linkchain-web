import { UserCard } from "@/components/user/UserCard";
import {
  HorizontalScrollWrapper,
  SectionContainer,
  SectionTitle,
} from "@/components/styled/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useSimilarUsers } from "@/hooks/useSimilarUsers";

const UserListSkeleton = () => (
  <HorizontalScrollWrapper>
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className='w-[220px] h-[228px] rounded-xl' />
    ))}
  </HorizontalScrollWrapper>
);

export function UserRecommendationList() {
  const { data, isLoading } = useSimilarUsers(5);
  const similarUsers = data?.similar_users || [];

  return (
    <SectionContainer>
      <SectionTitle>나와 관심사가 비슷한 큐레이터</SectionTitle>

      {isLoading ? (
        <UserListSkeleton />
      ) : similarUsers.length > 0 ? (
        <HorizontalScrollWrapper>
          {similarUsers.map((user) => (
            <UserCard
              key={user.user_id}
              user_id={user.user_id}
              username={user.username}
              avatarUrl={`https://i.pravatar.cc/150?u=${user.user_id}`}
            />
          ))}
        </HorizontalScrollWrapper>
      ) : (
        <div className='flex h-[228px] w-full items-center justify-center text-sm text-gray-500'>
          아직 비슷한 취향의 큐레이터를 찾지 못했어요.
        </div>
      )}
    </SectionContainer>
  );
}

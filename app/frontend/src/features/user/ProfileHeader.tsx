import {SectionContainer} from "@/components/styled/layout";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import type {User} from "@/model/user/type";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import type {UseQueryResult} from "@tanstack/react-query";
import {Edit} from "lucide-react";

export const ProfileHeader = ({user}: { user: UseQueryResult<User | undefined, Error> }) => {
  const stringToNumberHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  };
  // Render logic
  if (user.isLoading) {
    return <ProfileHeaderSkeleton/>;
  } else if (!user.data) {
    return <UserNotFoundComponent/>;
  } else {
    const avatarIndex = stringToNumberHash(user.data?.id ?? "") % 5;
    return (
      <SectionContainer className='pt-8'>
        <div className='flex flex-col items-center gap-4'>
          <Avatar className='w-24 h-24 border-4 border-white shadow-md'>
            <AvatarImage src={`/avatars/${avatarIndex}.png`} alt={user.data?.name}/>
            <AvatarFallback>{user.data?.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='text-center'>
            <h1 className='text-3xl font-bold'>{user.data?.name}</h1>
            <p className='text-muted-foreground mt-1'>{user.data?.bio}</p>
          </div>
          <Button variant='outline'>
            <Edit className='mr-2 h-4 w-4'/>
            Edit Profile
          </Button>
        </div>
      </SectionContainer>
    );
  }
};

const ProfileHeaderSkeleton = () => (
  <SectionContainer className='pt-8'>
    <div className='flex flex-col items-center gap-4'>
      <Skeleton className='w-24 h-24 rounded-full'/>
      <div className='text-center space-y-2'>
        <Skeleton className='h-8 w-32'/>
        <Skeleton className='h-5 w-48'/>
      </div>
      <Skeleton className='h-10 w-32'/>
    </div>
  </SectionContainer>
);

const UserNotFoundComponent = () => (
  <SectionContainer className='pt-8'>
    <div className='flex flex-col items-center gap-4'>
      <p className='text-xl text-gray-500'>사용자를 찾을 수 없습니다.</p>
    </div>
  </SectionContainer>
);

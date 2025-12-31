import {useNavigate, useParams} from "react-router-dom";
import {PageContainer, SectionContainer} from "@/components/styled/layout";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import {Skeleton} from "@/components/ui/skeleton";
import {LinkDetailView} from "@/components/link/LinkDetailView";
import {RelatedLinks} from "@/features/link/RelatedLinks";
import {useLink, useLinkView} from "@/hooks/useLinks";
import {Header} from "@/components/layout/Header";
import {useEffect} from "react";

const LinkDetailPage = () => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {data: link, isLoading} = useLink(id);
  const {mutate} = useLinkView();

  useEffect(() => {
    if (id) {
      mutate(id);
    }
  }, [id, mutate]);

  if (isLoading) {
    return <DetailPageSkeleton/>;
  }

  if (!link) {
    return (
      <PageContainer>
        <Header/>
        <div className='text-center py-20'>
          <p className='text-xl text-gray-500'>Link not found.</p>
          <Button variant='outline' className='mt-4' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header/>
      <SectionContainer>
        <div className='mb-8'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4'/>
            Back
          </Button>
        </div>
        <LinkDetailView link={link}/>
        <RelatedLinks currentLinkId={link.id}/>
      </SectionContainer>
    </PageContainer>
  );
};

const DetailPageSkeleton = () => (
  <PageContainer>
    <Header/>
    <SectionContainer>
      <div className='mb-8'>
        <Skeleton className='h-10 w-24'/>
      </div>
      <div className='mx-auto'>
        <Skeleton className='h-10 w-3/4 mb-4'/>
        <Skeleton className='h-6 w-full mb-6'/>
        <Skeleton className='h-8 w-1/2 mb-6'/>
        <div className='flex flex-wrap gap-2 mb-8'>
          <Skeleton className='h-6 w-16'/>
          <Skeleton className='h-6 w-20'/>
          <Skeleton className='h-6 w-14'/>
          <Skeleton className='h-8 w-full'/>
        </div>
        <AspectRatio.Root ratio={16 / 9}>
          <Skeleton className='w-full h-full'/>
        </AspectRatio.Root>
        <Skeleton className='h-4 w-1/2 mt-2 mx-auto'/>
      </div>
      <div className='my-12'>
        <Skeleton className='h-px w-full'/>
      </div>
      <div>
        <Skeleton className='h-8 w-48 mb-4'/>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Skeleton className='h-32'/>
          <Skeleton className='h-32'/>
        </div>
      </div>
    </SectionContainer>
  </PageContainer>
);

export default LinkDetailPage;

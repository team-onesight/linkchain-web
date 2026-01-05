import { Link, useSearchParams } from "react-router-dom";
import { PageContainer, SectionContainer } from "@/components/styled/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchResultsGrid } from "@/features/search/SearchResultsGrid";
import { Header } from "@/components/layout/Header";
import { useEffect } from "react"; // useEffect 추가

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const tag_name = searchParams.get("tag_name");
  const group_id = searchParams.get("group_id");
  const group_title = searchParams.get("group_title");

  // 페이지 진입 시 및 검색 조건 변경 시 스크롤 최상단 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query, tag_name, group_id]); // 조건이 바뀔 때마다 실행

  const generateTitle = () => {
    // ... 기존 generateTitle 로직 동일
    if (tag_name && query) {
      return (
        <>
          Search results for "<strong>{query}</strong>" in #<strong>{tag_name}</strong>
        </>
      );
    }
    if (tag_name) {
      return (
        <>
          Links tagged with #<strong>{tag_name}</strong>
        </>
      );
    }
    if (query) {
      return (
        <>
          Search results for "<strong>{query}</strong>"
        </>
      );
    }

    if (group_id) {
      return (
        <>
          GROUP "<strong>{group_title || group_id}</strong>"
        </>
      );
    }
    return "Search";
  };

  return (
    <PageContainer>
      <Header />
      <SectionContainer>
        <div className='flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
          <Button asChild variant='outline'>
            <Link to='/'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Home
            </Link>
          </Button>
          <h1 className='text-xl md:text-2xl font-bold text-center sm:text-right'>
            {generateTitle()}
          </h1>
        </div>

        <SearchResultsGrid q={query} tag={tag_name} group_id={group_id} />
      </SectionContainer>
    </PageContainer>
  );
};

export default SearchPage;

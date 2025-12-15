import { useSearchParams, Link } from "react-router-dom";
import { PageContainer, SectionContainer } from "@/components/styled/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchResultsGrid } from "@/features/search/SearchResultsGrid";
import { Header } from "@/components/layout/Header";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const tag = searchParams.get("tag");

  const generateTitle = () => {
    if (tag && query) {
      return (
        <>
          Search results for "<strong>{query}</strong>" in #<strong>{tag}</strong>
        </>
      );
    }
    if (tag) {
      return (
        <>
          Links tagged with #<strong>{tag}</strong>
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

        <SearchResultsGrid q={query} tag={tag} />
      </SectionContainer>
    </PageContainer>
  );
};

export default SearchPage;

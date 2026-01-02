import {motion} from "framer-motion";
import {useSearchLinks} from "@/hooks/useLinks";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {useState, useEffect} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import { LinkCard } from "@/components/link/card/LinkCard";

interface SearchResultsGridProps {
    q: string | null;
    tag: string | null;
}

export const SearchResultsGrid = ({q, tag}: SearchResultsGridProps) => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        setPage(1);
    }, [q, tag]);

    const {data, isLoading, error} = useSearchLinks({
        query: q,
        tag: tag,
        page,
        size: pageSize,
    });

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {staggerChildren: 0.07},
        },
    };

    const itemVariants = {
        hidden: {y: 20, opacity: 0},
        visible: {y: 0, opacity: 1},
    };

    const handleFirstPage = () => {
        setPage(1);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleLastPage = () => {
        if (data) {
            setPage(data.total_pages);
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    };

    const handlePageClick = (pageNum: number) => {
        setPage(pageNum);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    if (isLoading) {
        return <GridSkeleton/>;
    }

    if (error) {
        return (
            console.error(error),
                <div className='text-center py-20'>
                    <p className='text-xl text-red-500'>Error loading search results.</p>
                </div>
        );
    }

    if (!data || data.items.length === 0) {
        return (
            <div className='text-center py-20'>
                <p className='text-xl text-gray-500'>No links found.</p>
            </div>
        );
    }

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(data.total_pages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageClick(i)}
                    className="min-w-[40px]"
                >
                    {i}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className='space-y-8'>
            <motion.div
                key={`page-${page}`}
                className='grid grid-cols-1 sm:grid-cols-2 gap-4'
                variants={containerVariants}
                initial='hidden'
                animate='visible'
            >
                {data.items.map((link) => {
                    return (
                        <motion.div key={link.link_id} variants={itemVariants}>
                            <LinkCard link={link}/>
                        </motion.div>
                    );
                })}
            </motion.div>

            {data.total_pages > 1 && (
                <div className='flex items-center justify-center gap-2 mt-8'>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleFirstPage}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4"/>
                        First
                    </Button>

                    <div className="flex gap-1">
                        {renderPageNumbers()}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLastPage}
                        disabled={page === data.total_pages}
                    >
                        Last
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            )}

            <div className='text-center text-sm text-gray-500'>
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.total)} of {data.total} results
            </div>
        </div>
    );
};

const GridSkeleton = () => (
    <div className='space-y-8'>
        <div>
            <Skeleton className='h-8 w-48 mb-4'/>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Skeleton className='h-36 w-full'/>
            </div>
        </div>
    </div>
);

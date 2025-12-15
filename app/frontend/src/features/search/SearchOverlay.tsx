"use client";

import { useUiStore } from "@/store/ui-store";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useTags } from "@/hooks/useTags";
import { Skeleton } from "@/components/ui/skeleton";

export const SearchOverlay = () => {
  const { isSearchOpen, closeSearch } = useUiStore();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: trendingTags, isLoading: isLoadingTags } = useTags();

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleKeywordClick = () => {
    closeSearch();
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    if (query.startsWith("#")) {
      const tagName = query.substring(1);
      console.log(tagName);
      if (tagName) {
        navigate(`/search?tag=${encodeURIComponent(tagName)}`);
      }
    } else {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
    closeSearch();
  };

  const isTagSearch = inputValue.startsWith("#");

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
          onClick={closeSearch}
        >
          <div className='p-4' onClick={(e) => e.stopPropagation()}>
            <div className='relative w-full max-w-[600px] mx-auto bg-white rounded-lg shadow-lg'>
              <form onSubmit={handleSearchSubmit}>
                <Input
                  ref={inputRef}
                  placeholder='Search links or use # for tags...'
                  className='h-12 pl-12 pr-12 text-base border-0 rounded-lg focus-visible:ring-0'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </form>
              <div className='p-4 border-t'>
                <h3 className='text-sm font-semibold text-muted-foreground mb-3'>
                  Recommanded {isTagSearch ? "Tags" : "Keywords"}
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {inputValue.length > 1 && (
                    <Link
                      to={`/search?tag=${isTagSearch ? inputValue.substring(1) : inputValue}`}
                      key={isTagSearch ? inputValue.substring(1) : inputValue}
                      onClick={handleKeywordClick}
                    >
                      <Badge
                        variant='secondary'
                        className='text-sm py-1 px-3 hover:bg-accent transition-colors'
                      >
                        {isTagSearch ? inputValue.substring(1) : inputValue}
                      </Badge>
                    </Link>
                  )}
                  {isLoadingTags ? (
                    <>
                      <Skeleton className='h-7 w-24 rounded-full' />
                      <Skeleton className='h-7 w-16 rounded-full' />
                      <Skeleton className='h-7 w-32 rounded-full' />
                      <Skeleton className='h-7 w-20 rounded-full' />
                    </>
                  ) : (
                    trendingTags?.map((tag) => (
                      <Link
                        to={`/search?tag=${tag.name}`}
                        key={tag.id}
                        onClick={handleKeywordClick}
                      >
                        <Badge
                          variant='secondary'
                          className='text-sm py-1 px-3 hover:bg-accent transition-colors'
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { Search } from "lucide-react";

export function Header() {
  const openSearch = useUiStore((state) => state.openSearch);

  return (
    <header className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-20'>
      <div className='flex items-center justify-between h-10'>
        <Button
          variant='outline'
          className='w-full justify-start text-muted-foreground'
          onClick={openSearch}
        >
          <Search className='mr-2 h-4 w-4' />
          <span>Search links...</span>
        </Button>
      </div>
    </header>
  );
}

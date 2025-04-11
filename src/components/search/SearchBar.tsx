
import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import { useOnClickOutside } from '@/hooks/use-click-outside';

interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, isMobile = false }) => {
  const { 
    searchTerm, 
    setSearchTerm, 
    performSearch, 
    clearSearch, 
    isSearching 
  } = useSearch();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close dropdown
  useOnClickOutside(searchContainerRef, () => {
    clearSearch();
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleClear = () => {
    clearSearch();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={searchContainerRef} className={`relative ${className}`}>
      <div className={`relative ${isMobile ? 'w-full' : 'w-64 md:w-72 lg:w-80'}`}>
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search..."
          className={`${isMobile ? 'w-full' : 'w-full'} pl-9 pr-8 bg-gray-50 focus:bg-white transition-colors`}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm ? (
          isSearching ? (
            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1.5 h-6 w-6 p-0.5 text-gray-400 hover:text-gray-600" 
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;

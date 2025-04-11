
import React from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SearchResultsProps {
  className?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ className }) => {
  const { searchResults, searchTerm, navigateToResult } = useSearch();

  if (!searchTerm || searchResults.length === 0) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-50 ${className}`}>
      <ScrollArea className="max-h-[60vh]">
        <div className="p-2">
          {searchResults.length === 0 ? (
            <div className="py-3 px-4 text-sm text-gray-500">
              No results found for "{searchTerm}"
            </div>
          ) : (
            <>
              <div className="py-2 px-3 text-xs text-gray-500 font-medium">
                {searchResults.length} results found
              </div>
              <div className="divide-y divide-gray-100">
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-sm"
                    onClick={() => navigateToResult(result.path)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{result.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{result.description}</div>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                        {result.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchResults;

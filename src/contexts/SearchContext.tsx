
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type SearchResult = {
  id: string;
  title: string;
  description: string;
  path: string;
  category: string;
};

interface SearchContextType {
  searchResults: SearchResult[];
  searchTerm: string;
  isSearching: boolean;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string) => void;
  clearSearch: () => void;
  navigateToResult: (path: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Sample data - in a real app, this would come from a backend search API
const sampleSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Statistics Dashboard',
    description: 'Current market trends and data analytics',
    path: '/statistics',
    category: 'Analytics'
  },
  {
    id: '2',
    title: 'Financial Assistance',
    description: 'Government schemes and loan opportunities',
    path: '/financial',
    category: 'Finance'
  },
  {
    id: '3',
    title: 'Training Resources',
    description: 'Educational courses and materials',
    path: '/training',
    category: 'Education'
  },
  {
    id: '4',
    title: 'Latest News',
    description: 'Industry updates and important news',
    path: '/news',
    category: 'News'
  },
  {
    id: '5',
    title: 'Networking Events',
    description: 'Connect with other farmers and businesses',
    path: '/network',
    category: 'Community'
  },
  {
    id: '6',
    title: 'Marketplace Listings',
    description: 'Buy and sell poultry products and equipment',
    path: '/marketplace',
    category: 'Commerce'
  },
  {
    id: '7',
    title: 'Contact Support',
    description: 'Get help with your account or technical issues',
    path: '/contact',
    category: 'Support'
  },
  {
    id: '8',
    title: 'User Profile Settings',
    description: 'Update your personal information and preferences',
    path: '/profile',
    category: 'Account'
  }
];

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const performSearch = (term: string) => {
    setIsSearching(true);
    setSearchTerm(term);
    
    // If search term is empty, clear results
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      const results = sampleSearchData.filter(item => 
        item.title.toLowerCase().includes(term.toLowerCase()) || 
        item.description.toLowerCase().includes(term.toLowerCase()) ||
        item.category.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const navigateToResult = (path: string) => {
    navigate(path);
    clearSearch();
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchResults, 
        searchTerm, 
        isSearching, 
        setSearchTerm, 
        performSearch, 
        clearSearch,
        navigateToResult
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};


import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type NewsCategory = 'all' | 'research' | 'policy' | 'health' | 'market' | 'technology';

interface NewsFiltersProps {
  activeTab: NewsCategory;
  onTabChange: (value: NewsCategory) => void;
  children: React.ReactNode;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({ activeTab, onTabChange, children }) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as NewsCategory)} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All News</TabsTrigger>
        <TabsTrigger value="research">Research</TabsTrigger>
        <TabsTrigger value="policy">Policy</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="market">Market</TabsTrigger>
        <TabsTrigger value="technology">Technology</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default NewsFilters;


import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  date: string;
  url: string;
}

interface NewsCardProps {
  news: NewsItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Industry News</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {news.map((item) => (
            <div key={item.id} className="p-4">
              <h3 className="text-sm font-medium hover:text-poultry-primary">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex justify-between">
                  {item.title} 
                  <ExternalLink className="h-4 w-4 ml-2 flex-shrink-0" />
                </a>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {item.source} • {item.date}
              </p>
              <p className="text-sm text-gray-700 mt-2">{item.summary}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 p-4">
        <a href="/news" className="text-sm text-poultry-primary font-medium hover:underline">
          View all news
        </a>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;

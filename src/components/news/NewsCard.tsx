
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarDays, ThumbsUp, MessageCircle, Share2, ExternalLink } from 'lucide-react';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  image: string;
  source: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
}

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <Card key={article.id} className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-48 md:h-auto">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-3/4 p-4 space-y-3">
          <div>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 mb-2 capitalize">
              {article.category}
            </span>
            <h3 className="text-xl font-bold">{article.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
              <span>{article.source}</span>
              <span>•</span>
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                {article.date}
              </div>
            </div>
          </div>
          <p className="text-gray-600">{article.description}</p>
          <div className="flex flex-wrap items-center justify-between pt-2">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {article.likes}
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {article.comments}
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <ExternalLink className="h-4 w-4 mr-1" />
              Read More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;

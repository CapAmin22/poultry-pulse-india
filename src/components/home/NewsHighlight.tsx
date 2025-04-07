
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NewsHighlightProps {
  title: string;
  summary: string;
  date: string;
}

const NewsHighlight: React.FC<NewsHighlightProps> = ({ title, summary, date }) => {
  return (
    <motion.div 
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      className="p-4 rounded-lg border-l-4 border-[#ea384c] shadow-sm bg-white"
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-base text-gray-800">{title}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 whitespace-nowrap">{date}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2">{summary}</p>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs text-[#0FA0CE] hover:text-[#0FA0CE]/80 p-0 h-auto">
          Read more <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default NewsHighlight;

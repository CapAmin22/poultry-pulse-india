
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
      whileHover={{ scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-lg border border-gray-100 shadow-sm bg-white hover:bg-gray-50/50"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
        <h3 className="font-semibold text-base text-gray-800">{title}</h3>
        <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-3 py-1 whitespace-nowrap">
          {date}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">{summary}</p>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs font-medium text-[#0066b2] hover:text-[#0066b2]/80 p-0 h-auto">
          Read more <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

export default NewsHighlight;

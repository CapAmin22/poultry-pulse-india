
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatHighlightProps {
  title: string;
  value: string;
  unit: string;
  change?: number;
  icon?: React.ReactNode;
}

const StatHighlight: React.FC<StatHighlightProps> = ({ title, value, unit, change, icon }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 400 }}>
      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <div className="flex items-baseline">
                <span className="text-xl md:text-2xl font-bold">{value}</span>
                <span className="text-xs ml-1 text-gray-600">{unit}</span>
              </div>
            </div>
            
            {icon && (
              <div className="p-2 rounded-full bg-gray-100">
                {icon}
              </div>
            )}
          </div>
          
          {typeof change !== 'undefined' && (
            <div className="mt-3 flex items-center text-xs">
              {change > 0 ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 font-medium ml-1">{Math.abs(change)}%</span>
                </>
              ) : change < 0 ? (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-600 font-medium ml-1">{Math.abs(change)}%</span>
                </>
              ) : (
                <span className="text-gray-500">No change</span>
              )}
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </CardContent>
        
        {/* Decorative colored bottom border based on change */}
        <div 
          className={`h-1 w-full ${
            typeof change === 'undefined'
              ? 'bg-gray-200'
              : change > 0
                ? 'bg-green-500'
                : change < 0
                  ? 'bg-red-500'
                  : 'bg-gray-300'
          }`}
        />
      </Card>
    </motion.div>
  );
};

export default StatHighlight;

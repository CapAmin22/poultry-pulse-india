
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
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      transition={{ type: "spring", stiffness: 400 }}
      className="group"
    >
      <Card className="overflow-hidden border-none shadow-md transition-all duration-300 group-hover:shadow-lg">
        <CardContent className="p-5 relative overflow-hidden">
          {/* Background effect */}
          <div 
            className="absolute -right-10 -top-10 w-40 h-40 bg-gray-50 rounded-full opacity-30 group-hover:bg-gray-100 transition-colors"
            style={{ zIndex: 0 }}
          ></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <div className="flex items-baseline">
                  <span className="text-xl md:text-2xl font-bold">{value}</span>
                  <span className="text-xs ml-1 text-gray-600">{unit}</span>
                </div>
              </div>
              
              {icon && (
                <div className="p-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  {icon}
                </div>
              )}
            </div>
            
            {typeof change !== 'undefined' && (
              <div className="mt-4 flex items-center text-xs">
                {isPositive ? (
                  <div className="flex items-center text-emerald-600">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span className="font-medium">{Math.abs(change)}%</span>
                  </div>
                ) : isNegative ? (
                  <div className="flex items-center text-rose-600">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span className="font-medium">{Math.abs(change)}%</span>
                  </div>
                ) : (
                  <span className="text-gray-500">No change</span>
                )}
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          
          {/* Bottom indicator bar */}
          <div className="absolute bottom-0 left-0 w-full h-1">
            <div 
              className={`h-full ${
                isPositive
                  ? 'bg-emerald-500'
                  : isNegative
                  ? 'bg-rose-500'
                  : 'bg-gray-300'
              }`}
              style={{ width: `${Math.min(Math.abs(change || 0) * 10, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatHighlight;

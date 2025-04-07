
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
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }} 
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden border shadow-sm">
        <CardContent className="p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              {icon && (
                <div className="p-3 rounded-full bg-blue-50">
                  {icon}
                </div>
              )}
            </div>
            
            <div className="mt-3">
              <div className="flex items-baseline">
                <span className="text-2xl md:text-3xl font-bold text-gray-800">{value}</span>
                <span className="text-xs ml-1 text-gray-500">{unit}</span>
              </div>
              
              {typeof change !== 'undefined' && (
                <div className="mt-3 flex items-center text-xs">
                  <div className={`flex items-center ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-gray-500'} px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50' : isNegative ? 'bg-rose-50' : 'bg-gray-50'}`}>
                    {isPositive ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : isNegative ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : null}
                    <span className="font-medium">{Math.abs(change)}%</span>
                  </div>
                  <span className="text-gray-500 ml-2">from last week</span>
                </div>
              )}
            </div>
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

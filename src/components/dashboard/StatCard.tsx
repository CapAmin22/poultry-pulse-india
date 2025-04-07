
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, className }) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className="p-2 bg-gray-100 rounded-md">{icon}</div>}
      </div>
      {typeof change !== 'undefined' && (
        <div className="mt-4 flex items-center text-sm">
          {change > 0 ? (
            <>
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">{Math.abs(change)}% increase</span>
            </>
          ) : change < 0 ? (
            <>
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">{Math.abs(change)}% decrease</span>
            </>
          ) : (
            <span className="text-gray-500 font-medium">No change</span>
          )}
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;


import React from 'react';

interface ActivityItemProps {
  title: string; 
  description: string; 
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time }) => (
  <div className="bg-gray-50 rounded-md p-3">
    <h4 className="text-sm font-medium">{title}</h4>
    <p className="text-xs text-gray-600 mt-1">{description}</p>
    <p className="text-xs text-gray-400 mt-1">{time}</p>
  </div>
);

export default ActivityItem;

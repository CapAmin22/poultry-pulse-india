
import React from 'react';
import ActivityItem from './ActivityItem';
import { LucideIcon } from 'lucide-react';

interface Activity {
  title: string;
  description: string;
  time: string;
}

interface ActivityCategoryProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  activities: Activity[] | null;
}

const ActivityCategory: React.FC<ActivityCategoryProps> = ({ 
  title, 
  icon: Icon, 
  iconColor, 
  activities 
}) => {
  return (
    <div>
      <h3 className="font-medium text-gray-800 flex items-center">
        <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
        {title}
      </h3>
      <div className="mt-2 space-y-2">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem 
              key={index}
              title={activity.title} 
              description={activity.description} 
              time={activity.time} 
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent {title.toLowerCase()} activity.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityCategory;

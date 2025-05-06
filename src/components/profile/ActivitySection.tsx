
import React from 'react';
import { ShoppingBag, CreditCard, Users, BookOpen, Calendar, Settings, AlertCircle } from 'lucide-react';
import ActivityCategory from './ActivityCategory';
import { useRoleBasedData } from '@/hooks/use-role-based-data';
import { ROLES } from '@/utils/roles';

interface ActivitySectionProps {
  role?: string;
  userId?: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ role = '', userId }) => {
  const { getActivitiesByRole } = useRoleBasedData();
  const activities = getActivitiesByRole(role);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
      
      <div className="space-y-6">
        {activities.admin && (
          <ActivityCategory 
            title="System Administration" 
            icon={Settings} 
            iconColor="text-purple-500"
            activities={activities.admin}
          />
        )}
        
        {activities.marketplace && (
          <ActivityCategory 
            title="Marketplace" 
            icon={ShoppingBag} 
            iconColor="text-blue-500"
            activities={activities.marketplace}
          />
        )}
        
        {activities.financial && (
          <ActivityCategory 
            title="Financial Applications" 
            icon={CreditCard} 
            iconColor="text-green-500"
            activities={activities.financial}
          />
        )}
        
        {activities.network && (
          <ActivityCategory 
            title="Network Activity" 
            icon={Users} 
            iconColor="text-purple-500"
            activities={activities.network}
          />
        )}
        
        {activities.training && (
          <ActivityCategory 
            title="Training" 
            icon={BookOpen} 
            iconColor="text-red-500"
            activities={activities.training}
          />
        )}
        
        {activities.services && (
          <ActivityCategory 
            title="Financial Services" 
            icon={CreditCard} 
            iconColor="text-green-500"
            activities={activities.services}
          />
        )}
        
        {activities.clients && (
          <ActivityCategory 
            title="Client Interactions" 
            icon={Users} 
            iconColor="text-purple-500"
            activities={activities.clients}
          />
        )}
        
        {activities.events && (
          <ActivityCategory 
            title="Events" 
            icon={Calendar} 
            iconColor="text-blue-500"
            activities={activities.events}
          />
        )}
        
        {activities.courses && (
          <ActivityCategory 
            title="Training Courses" 
            icon={BookOpen} 
            iconColor="text-red-500"
            activities={activities.courses}
          />
        )}
        
        {activities.students && (
          <ActivityCategory 
            title="Student Interactions" 
            icon={Users} 
            iconColor="text-purple-500"
            activities={activities.students}
          />
        )}
        
        {!Object.values(activities).some(Boolean) && (
          <div className="flex flex-col items-center py-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-600">No recent activity to display.</p>
            <p className="text-sm text-gray-500">Your activities will appear here as you use the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;

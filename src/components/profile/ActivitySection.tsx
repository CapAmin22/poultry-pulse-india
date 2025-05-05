
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, CreditCard, Users, BookOpen, Calendar } from 'lucide-react';

interface ActivitySectionProps {
  role?: string;
  userId?: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ role = '', userId }) => {
  // This would be fetched from Supabase based on user activity
  
  const renderRoleSpecificActivity = () => {
    switch (role) {
      case 'farmer':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2 text-blue-500" />
                Marketplace
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New listing created" 
                  description="You listed '50kg Layer Feed' on the marketplace" 
                  time="2 days ago" 
                />
                <ActivityItem 
                  title="Price update" 
                  description="You updated the price of 'Day-old Chicks'" 
                  time="5 days ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                Financial Applications
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="Loan application status update" 
                  description="Your application for 'Equipment Financing' is under review" 
                  time="1 week ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Network Activity
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New connection" 
                  description="You connected with 'Sunrise Feed Suppliers'" 
                  time="3 days ago" 
                />
                <ActivityItem 
                  title="Event RSVP" 
                  description="You're attending 'Poultry Farmers Meetup'" 
                  time="1 week ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-red-500" />
                Training
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="Course completion" 
                  description="You completed 'Disease Prevention Basics'" 
                  time="2 weeks ago" 
                />
              </div>
            </div>
          </div>
        );
        
      case 'financial':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                Financial Services
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New loan product offered" 
                  description="You added 'Small Farm Equipment Loan'" 
                  time="1 day ago" 
                />
                <ActivityItem 
                  title="Application review" 
                  description="You reviewed 'ABC Farms' loan application" 
                  time="3 days ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Client Interactions
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New client connection" 
                  description="You connected with 'Golden Egg Farms'" 
                  time="2 days ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Events
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="Scheduled webinar" 
                  description="You registered 'Farm Financing Options' webinar" 
                  time="5 days ago" 
                />
              </div>
            </div>
          </div>
        );
        
      case 'trainer':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-red-500" />
                Training Courses
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New course published" 
                  description="You published 'Advanced Biosecurity Measures'" 
                  time="1 day ago" 
                />
                <ActivityItem 
                  title="Course update" 
                  description="You updated 'Poultry Nutrition 101'" 
                  time="4 days ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Student Interactions
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="New student enrollments" 
                  description="5 new students enrolled in your courses" 
                  time="2 days ago" 
                />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                Scheduled Training
              </h3>
              <div className="mt-2 space-y-2">
                <ActivityItem 
                  title="Upcoming workshop" 
                  description="You scheduled 'Hands-on Disease Diagnosis'" 
                  time="3 days ago" 
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800">Marketplace</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">No recent marketplace activity.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Financial Applications</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">No recent financial applications.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Network Activity</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">No recent network activity.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Training</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">No recent training activity.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
      
      {renderRoleSpecificActivity()}
    </div>
  );
};

// Helper component for activity items
const ActivityItem = ({ title, description, time }: { title: string; description: string; time: string }) => (
  <div className="bg-gray-50 rounded-md p-3">
    <h4 className="text-sm font-medium">{title}</h4>
    <p className="text-xs text-gray-600 mt-1">{description}</p>
    <p className="text-xs text-gray-400 mt-1">{time}</p>
  </div>
);

export default ActivitySection;

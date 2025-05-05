
import React from 'react';
import { ShoppingBag, CreditCard, Users, BookOpen, Calendar } from 'lucide-react';
import ActivityCategory from './ActivityCategory';

interface ActivitySectionProps {
  role?: string;
  userId?: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ role = '', userId }) => {
  // This would be fetched from Supabase based on user activity
  
  const getFarmerActivities = () => {
    return {
      marketplace: [
        {
          title: "New listing created", 
          description: "You listed '50kg Layer Feed' on the marketplace", 
          time: "2 days ago"
        },
        {
          title: "Price update", 
          description: "You updated the price of 'Day-old Chicks'", 
          time: "5 days ago"
        }
      ],
      financial: [
        {
          title: "Loan application status update", 
          description: "Your application for 'Equipment Financing' is under review", 
          time: "1 week ago"
        }
      ],
      network: [
        {
          title: "New connection", 
          description: "You connected with 'Sunrise Feed Suppliers'", 
          time: "3 days ago"
        },
        {
          title: "Event RSVP", 
          description: "You're attending 'Poultry Farmers Meetup'", 
          time: "1 week ago"
        }
      ],
      training: [
        {
          title: "Course completion", 
          description: "You completed 'Disease Prevention Basics'", 
          time: "2 weeks ago"
        }
      ]
    };
  };
  
  const getFinancialActivities = () => {
    return {
      services: [
        {
          title: "New loan product offered", 
          description: "You added 'Small Farm Equipment Loan'", 
          time: "1 day ago"
        },
        {
          title: "Application review", 
          description: "You reviewed 'ABC Farms' loan application", 
          time: "3 days ago"
        }
      ],
      clients: [
        {
          title: "New client connection", 
          description: "You connected with 'Golden Egg Farms'", 
          time: "2 days ago"
        }
      ],
      events: [
        {
          title: "Scheduled webinar", 
          description: "You registered 'Farm Financing Options' webinar", 
          time: "5 days ago"
        }
      ]
    };
  };
  
  const getTrainerActivities = () => {
    return {
      courses: [
        {
          title: "New course published", 
          description: "You published 'Advanced Biosecurity Measures'", 
          time: "1 day ago"
        },
        {
          title: "Course update", 
          description: "You updated 'Poultry Nutrition 101'", 
          time: "4 days ago"
        }
      ],
      students: [
        {
          title: "New student enrollments", 
          description: "5 new students enrolled in your courses", 
          time: "2 days ago"
        }
      ],
      training: [
        {
          title: "Upcoming workshop", 
          description: "You scheduled 'Hands-on Disease Diagnosis'", 
          time: "3 days ago"
        }
      ]
    };
  };

  const renderRoleSpecificActivity = () => {
    switch (role) {
      case 'farmer':
        const farmerActivities = getFarmerActivities();
        return (
          <div className="space-y-6">
            <ActivityCategory 
              title="Marketplace" 
              icon={ShoppingBag} 
              iconColor="text-blue-500"
              activities={farmerActivities.marketplace}
            />
            
            <ActivityCategory 
              title="Financial Applications" 
              icon={CreditCard} 
              iconColor="text-green-500"
              activities={farmerActivities.financial}
            />
            
            <ActivityCategory 
              title="Network Activity" 
              icon={Users} 
              iconColor="text-purple-500"
              activities={farmerActivities.network}
            />
            
            <ActivityCategory 
              title="Training" 
              icon={BookOpen} 
              iconColor="text-red-500"
              activities={farmerActivities.training}
            />
          </div>
        );
        
      case 'financial':
        const financialActivities = getFinancialActivities();
        return (
          <div className="space-y-6">
            <ActivityCategory 
              title="Financial Services" 
              icon={CreditCard} 
              iconColor="text-green-500"
              activities={financialActivities.services}
            />
            
            <ActivityCategory 
              title="Client Interactions" 
              icon={Users} 
              iconColor="text-purple-500"
              activities={financialActivities.clients}
            />
            
            <ActivityCategory 
              title="Events" 
              icon={Calendar} 
              iconColor="text-blue-500"
              activities={financialActivities.events}
            />
          </div>
        );
        
      case 'trainer':
        const trainerActivities = getTrainerActivities();
        return (
          <div className="space-y-6">
            <ActivityCategory 
              title="Training Courses" 
              icon={BookOpen} 
              iconColor="text-red-500"
              activities={trainerActivities.courses}
            />
            
            <ActivityCategory 
              title="Student Interactions" 
              icon={Users} 
              iconColor="text-purple-500"
              activities={trainerActivities.students}
            />
            
            <ActivityCategory 
              title="Scheduled Training" 
              icon={Calendar} 
              iconColor="text-blue-500"
              activities={trainerActivities.training}
            />
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
            <ActivityCategory 
              title="Marketplace" 
              icon={ShoppingBag} 
              iconColor="text-blue-500"
              activities={null}
            />
            
            <ActivityCategory 
              title="Financial Applications" 
              icon={CreditCard} 
              iconColor="text-green-500"
              activities={null}
            />
            
            <ActivityCategory 
              title="Network Activity" 
              icon={Users} 
              iconColor="text-purple-500"
              activities={null}
            />
            
            <ActivityCategory 
              title="Training" 
              icon={BookOpen} 
              iconColor="text-red-500"
              activities={null}
            />
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

export default ActivitySection;


import { useMemo } from 'react';
import { ROLES } from '@/utils/roles';

type Activity = {
  title: string;
  description: string;
  time: string;
};

type ActivitiesMap = {
  marketplace?: Activity[] | null;
  financial?: Activity[] | null;
  network?: Activity[] | null;
  training?: Activity[] | null;
  services?: Activity[] | null;
  clients?: Activity[] | null;
  events?: Activity[] | null;
  courses?: Activity[] | null;
  students?: Activity[] | null;
};

export const useRoleBasedData = () => {
  const getFarmerActivities = (): ActivitiesMap => {
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
  
  const getFinancialActivities = (): ActivitiesMap => {
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
  
  const getTrainerActivities = (): ActivitiesMap => {
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
  
  const getDefaultActivities = (): ActivitiesMap => ({
    marketplace: null,
    financial: null,
    network: null,
    training: null
  });
  
  const getActivitiesByRole = (role: string): ActivitiesMap => {
    switch (role) {
      case ROLES.FARMER:
        return getFarmerActivities();
      case ROLES.FINANCIAL:
        return getFinancialActivities();
      case ROLES.TRAINER:
        return getTrainerActivities();
      default:
        return getDefaultActivities();
    }
  };
  
  return {
    getActivitiesByRole
  };
};

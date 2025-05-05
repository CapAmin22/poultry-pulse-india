
import React from 'react';
import LoanApplicationCard from './LoanApplicationCard';

interface ApplicationListProps {
  applications: Array<{
    id: string;
    amount: number;
    purpose: string;
    farm_type: string;
    farm_size: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    created_at: string;
  }>;
  isProvider?: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  isProvider = false,
  onUpdateStatus
}) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{isProvider ? 'No applications to review at this time.' : 'You have no active applications.'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <LoanApplicationCard
          key={application.id}
          application={application}
          isProvider={isProvider}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default ApplicationList;

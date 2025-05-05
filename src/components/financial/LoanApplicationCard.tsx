
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoanApplicationCardProps {
  application: {
    id: string;
    amount: number;
    purpose: string;
    farm_type: string;
    farm_size: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    created_at: string;
  };
  isProvider?: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
}

const LoanApplicationCard: React.FC<LoanApplicationCardProps> = ({ 
  application, 
  isProvider = false,
  onUpdateStatus
}) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">₹{application.amount} - {application.purpose}</p>
          <p className="text-sm text-gray-600">Farm Type: {application.farm_type}, Size: {application.farm_size}</p>
          <p className="text-sm text-gray-600">
            Applied: {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            statusClasses[application.status]
          }`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>
      
      {isProvider && onUpdateStatus && (
        <div className="mt-4 flex gap-2 justify-end">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onUpdateStatus(application.id, 'reviewing')}
            disabled={application.status === 'reviewing'}
          >
            Review
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-green-500 text-green-500 hover:bg-green-50"
            onClick={() => onUpdateStatus(application.id, 'approved')}
            disabled={application.status === 'approved'}
          >
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={() => onUpdateStatus(application.id, 'rejected')}
            disabled={application.status === 'rejected'}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoanApplicationCard;

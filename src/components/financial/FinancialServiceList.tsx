
import React from 'react';
import { Database } from 'lucide-react';
import FinancialServiceCard from './FinancialServiceCard';

interface FinancialServiceListProps {
  services: Array<{
    id: string;
    title: string;
    provider: string;
    interestRate?: string;
    maxAmount?: string;
    tenure?: string;
    eligibility: string;
    tags: string[];
  }>;
  loading: boolean;
  userRole?: string;
  onEdit?: (id: string) => void;
  onApply?: (id: string) => void;
}

const FinancialServiceList: React.FC<FinancialServiceListProps> = ({
  services,
  loading,
  userRole,
  onEdit,
  onApply
}) => {
  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No financial services found</h3>
        <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <FinancialServiceCard
          key={service.id}
          id={service.id}
          title={service.title}
          provider={service.provider}
          interestRate={service.interestRate}
          maxAmount={service.maxAmount}
          tenure={service.tenure}
          eligibility={service.eligibility}
          tags={service.tags}
          userRole={userRole}
          onEdit={userRole === 'financial' ? () => onEdit && onEdit(service.id) : undefined}
          onApply={userRole !== 'financial' ? () => onApply && onApply(service.id) : undefined}
        />
      ))}
    </div>
  );
};

export default FinancialServiceList;

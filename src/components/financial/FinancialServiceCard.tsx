
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceTag {
  label: string;
  type?: 'default' | 'primary' | 'secondary';
}

interface FinancialServiceCardProps {
  id: string;
  title: string;
  provider: string;
  interestRate?: string;
  maxAmount?: string;
  tenure?: string;
  eligibility: string;
  tags: string[];
  onEdit?: () => void;
  onApply?: () => void;
  userRole?: string;
}

const FinancialServiceCard: React.FC<FinancialServiceCardProps> = ({
  id,
  title,
  provider,
  interestRate,
  maxAmount,
  tenure,
  eligibility,
  tags,
  onEdit,
  onApply,
  userRole
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-poultry-primary transition-colors">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div>
          <h3 className="font-medium text-poultry-primary">{title}</h3>
          <p className="text-sm text-gray-600">{provider}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="text-sm font-medium">{interestRate || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Maximum Amount</p>
          <p className="text-sm font-medium">{maxAmount || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tenure</p>
          <p className="text-sm font-medium">{tenure || 'Not specified'}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500">Eligibility</p>
        <p className="text-sm">{eligibility}</p>
      </div>
      
      <div className="mt-4 flex justify-end">
        {userRole !== 'financial' && (
          <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90" onClick={onApply}>
            Apply Now
          </Button>
        )}
        {userRole === 'financial' && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit Service
          </Button>
        )}
      </div>
    </div>
  );
};

export default FinancialServiceCard;

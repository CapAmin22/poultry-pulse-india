
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from '../../OnboardingTypes';
import { FINANCIAL_SERVICES } from '../../OnboardingConstants';

const FinancialStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Financial Services Offered</Label>
        <div className="grid grid-cols-2 gap-3">
          {FINANCIAL_SERVICES.slice(0, -1).map(service => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`service-${service.id}`} 
                checked={onboardingData.financial_services.includes(service.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleArrayItem('financial_services', service.id);
                  } else {
                    toggleArrayItem('financial_services', service.id);
                  }
                }}
              />
              <label 
                htmlFor={`service-${service.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {service.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="years_in_business">Years in Financial Services</Label>
        <Input
          id="years_in_business"
          placeholder="How many years have you been in financial services?"
          value={onboardingData.years_in_business}
          onChange={(e) => handleChange('years_in_business', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="website_url">Company Website (Optional)</Label>
        <Input
          id="website_url"
          placeholder="Your company website URL"
          value={onboardingData.website_url}
          onChange={(e) => handleChange('website_url', e.target.value)}
        />
      </div>
    </div>
  );
};

export default FinancialStep;

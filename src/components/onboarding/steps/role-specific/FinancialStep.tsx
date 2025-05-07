
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { StepProps } from '../../OnboardingTypes';
import { FINANCIAL_SERVICES } from '../../OnboardingConstants';

const FinancialStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-lg font-medium">Financial Services You Offer</Label>
        <p className="text-sm text-gray-500">Select all the financial services that you provide to poultry farmers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {FINANCIAL_SERVICES.map(service => (
            <div key={service.id} className="flex items-center space-x-2 bg-white p-3 rounded-md border hover:bg-gray-50 transition-colors">
              <Checkbox 
                id={`service-${service.id}`} 
                checked={onboardingData.financial_services.includes(service.id)}
                onCheckedChange={(checked) => {
                  toggleArrayItem('financial_services', service.id);
                }}
              />
              <label 
                htmlFor={`service-${service.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
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
          type="number"
          min="0"
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
      
      <div className="space-y-2">
        <Label htmlFor="financial_description">Company Description</Label>
        <Textarea
          id="financial_description"
          placeholder="Describe your financial institution and the services you provide..."
          value={onboardingData.financial_description || ''}
          onChange={(e) => handleChange('financial_description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
};

export default FinancialStep;

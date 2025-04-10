
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StepProps } from '../../OnboardingTypes';

const OtherStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="years_in_business">Years in Industry</Label>
        <Input
          id="years_in_business"
          placeholder="How many years have you been in the poultry industry?"
          value={onboardingData.years_in_business}
          onChange={(e) => handleChange('years_in_business', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Main Activities</Label>
        <Input
          placeholder="Enter activity and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              const newItem = e.currentTarget.value.trim();
              if (!onboardingData.services_offered.includes(newItem)) {
                handleChange('services_offered', [...onboardingData.services_offered, newItem]);
              }
              e.currentTarget.value = '';
            }
          }}
        />
        {onboardingData.services_offered.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {onboardingData.services_offered.map((item, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                {item}
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-red-500"
                  onClick={() => {
                    handleChange('services_offered', onboardingData.services_offered.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherStep;

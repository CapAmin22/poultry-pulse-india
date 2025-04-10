
import React from 'react';
import { Button } from '@/components/ui/button';
import { StepProps } from '../OnboardingTypes';
import { getInterestsForRole } from '../OnboardingConstants';

const InterestsStep: React.FC<StepProps> = ({ onboardingData, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        We'll customize your experience based on your interests. Select all that apply:
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {onboardingData.role && getInterestsForRole(onboardingData.role).map(interest => (
          <Button
            key={interest}
            type="button"
            variant={onboardingData.interests.includes(interest) ? "default" : "outline"}
            className={`
              h-auto text-xs py-2 px-3 justify-start normal-case
              ${onboardingData.interests.includes(interest) ? 
                'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white' : 
                ''}
            `}
            onClick={() => toggleArrayItem('interests', interest)}
          >
            {interest}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default InterestsStep;

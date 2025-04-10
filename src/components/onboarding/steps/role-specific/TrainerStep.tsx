
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from '../../OnboardingTypes';
import { TRAINING_SPECIALIZATIONS } from '../../OnboardingConstants';

const TrainerStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Training Specializations</Label>
        <div className="grid grid-cols-2 gap-3">
          {TRAINING_SPECIALIZATIONS.slice(0, -1).map(specialization => (
            <div key={specialization.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`spec-${specialization.id}`} 
                checked={onboardingData.training_specializations.includes(specialization.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleArrayItem('training_specializations', specialization.id);
                  } else {
                    toggleArrayItem('training_specializations', specialization.id);
                  }
                }}
              />
              <label 
                htmlFor={`spec-${specialization.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {specialization.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Certifications (Optional)</Label>
        <Input
          placeholder="Enter certification and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              const newCert = e.currentTarget.value.trim();
              if (!onboardingData.certifications.includes(newCert)) {
                handleChange('certifications', [...onboardingData.certifications, newCert]);
              }
              e.currentTarget.value = '';
            }
          }}
        />
        {onboardingData.certifications.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {onboardingData.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                {cert}
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-red-500"
                  onClick={() => {
                    handleChange('certifications', onboardingData.certifications.filter((_, i) => i !== index));
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

export default TrainerStep;

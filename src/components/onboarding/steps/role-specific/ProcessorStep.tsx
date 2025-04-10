
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from '../../OnboardingTypes';
import { POULTRY_TYPES } from '../../OnboardingConstants';

const ProcessorStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Poultry Types Processed</Label>
        <div className="grid grid-cols-2 gap-3">
          {POULTRY_TYPES.slice(0, -1).map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`poultry-proc-${type.id}`} 
                checked={onboardingData.poultry_types.includes(type.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleArrayItem('poultry_types', type.id);
                  } else {
                    toggleArrayItem('poultry_types', type.id);
                  }
                }}
              />
              <label 
                htmlFor={`poultry-proc-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Products Manufactured</Label>
        <Input
          placeholder="Enter product and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              const newItem = e.currentTarget.value.trim();
              if (!onboardingData.product_types.includes(newItem)) {
                handleChange('product_types', [...onboardingData.product_types, newItem]);
              }
              e.currentTarget.value = '';
            }
          }}
        />
        {onboardingData.product_types.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {onboardingData.product_types.map((item, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                {item}
                <button 
                  type="button" 
                  className="ml-2 text-gray-500 hover:text-red-500"
                  onClick={() => {
                    handleChange('product_types', onboardingData.product_types.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="processing_capacity">Processing Capacity</Label>
        <Input
          id="processing_capacity"
          placeholder="Processing capacity (e.g., birds per day)"
          value={onboardingData.farming_capacity}
          onChange={(e) => handleChange('farming_capacity', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProcessorStep;

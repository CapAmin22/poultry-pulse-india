
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StepProps } from '../../OnboardingTypes';
import { POULTRY_TYPES, FARMING_SYSTEMS } from '../../OnboardingConstants';

const FarmerStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Poultry Types</Label>
        <div className="grid grid-cols-2 gap-3">
          {POULTRY_TYPES.slice(0, -1).map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`poultry-${type.id}`} 
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
                htmlFor={`poultry-${type.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {type.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="farming_system">Farming System</Label>
        <Select 
          value={onboardingData.farming_system} 
          onValueChange={(value) => handleChange('farming_system', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your farming system" />
          </SelectTrigger>
          <SelectContent>
            {FARMING_SYSTEMS.slice(0, -1).map(system => (
              <SelectItem key={system.id} value={system.id}>{system.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="farming_capacity">Farming Capacity</Label>
        <Input
          id="farming_capacity"
          placeholder="Number of birds your farm can accommodate"
          value={onboardingData.farming_capacity}
          onChange={(e) => handleChange('farming_capacity', e.target.value)}
        />
      </div>
    </div>
  );
};

export default FarmerStep;

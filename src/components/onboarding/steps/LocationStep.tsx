
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Building } from 'lucide-react';
import { StepProps } from '../OnboardingTypes';
import { INDIAN_STATES, BUSINESS_SIZES, EXPERIENCE_LEVELS } from '../OnboardingConstants';

const LocationStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  const showBusinessDetails = ['farmer', 'distributor', 'processor', 'retailer', 'supplier'].includes(onboardingData.role);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select 
          value={onboardingData.state} 
          onValueChange={(value) => handleChange('state', value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent className="max-h-[240px]">
            {INDIAN_STATES.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          placeholder="Your district"
          value={onboardingData.district}
          onChange={(e) => handleChange('district', e.target.value)}
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Village/Town/City</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <MapPin className="h-5 w-5 text-gray-400" />
          </span>
          <Input
            id="location"
            placeholder="Your village, town or city"
            value={onboardingData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {showBusinessDetails && (
        <>
          <div className="space-y-2">
            <Label htmlFor="business_name">Business/Farm Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">
                <Building className="h-5 w-5 text-gray-400" />
              </span>
              <Input
                id="business_name"
                placeholder="Your business or farm name"
                value={onboardingData.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business_size">Business Size</Label>
            <Select 
              value={onboardingData.business_size} 
              onValueChange={(value) => handleChange('business_size', value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select your business size" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_SIZES.map(size => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="experience_level">Experience Level</Label>
        <Select 
          value={onboardingData.experience_level} 
          onValueChange={(value) => handleChange('experience_level', value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map(level => (
              <SelectItem key={level.id} value={level.id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationStep;

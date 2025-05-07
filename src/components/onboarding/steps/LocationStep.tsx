
import React, { useState } from 'react';
import { OnboardingStepProps, LocationData } from '../OnboardingTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LocationOption {
  label: string;
  value: string;
}

const countries: LocationOption[] = [
  { label: 'India', value: 'india' },
  { label: 'United States', value: 'usa' },
  { label: 'United Kingdom', value: 'uk' },
  // Add more countries as needed
];

const states: Record<string, LocationOption[]> = {
  india: [
    { label: 'Delhi', value: 'delhi' },
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Tamil Nadu', value: 'tamil_nadu' },
    // Add more Indian states as needed
  ],
  usa: [
    { label: 'California', value: 'california' },
    { label: 'New York', value: 'new_york' },
    { label: 'Texas', value: 'texas' },
    // Add more US states as needed
  ],
  uk: [
    { label: 'England', value: 'england' },
    { label: 'Scotland', value: 'scotland' },
    { label: 'Wales', value: 'wales' },
    // Add more UK regions as needed
  ],
};

const LocationStep: React.FC<OnboardingStepProps> = ({ onboardingData, setOnboardingData, nextStep, prevStep }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(
    typeof onboardingData.location === 'object' ? onboardingData.location.country : ''
  );

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setOnboardingData({
      ...onboardingData,
      location: {
        country: value,
        state: '',
        city: '',
      },
      state: '',  // Update separate state field for backward compatibility
    });
  };

  const handleStateChange = (value: string) => {
    if (typeof onboardingData.location === 'object') {
      setOnboardingData({
        ...onboardingData,
        location: {
          ...onboardingData.location,
          state: value,
        },
        state: value,  // Update separate state field for backward compatibility
      });
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onboardingData.location === 'object') {
      setOnboardingData({
        ...onboardingData,
        location: {
          ...onboardingData.location,
          city: e.target.value,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Where are you located?</h2>
        <p className="text-sm text-muted-foreground">
          This helps us show you relevant content and connect you with nearby farmers and resources.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select 
            value={typeof onboardingData.location === 'object' ? onboardingData.location.country : ''}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="state">State/Province</Label>
          <Select 
            value={typeof onboardingData.location === 'object' ? onboardingData.location.state : ''}
            onValueChange={handleStateChange}
            disabled={!selectedCountry}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Select your state/province" />
            </SelectTrigger>
            <SelectContent>
              {selectedCountry && states[selectedCountry]?.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city">City/Town</Label>
          <Input 
            id="city" 
            placeholder="Enter your city or town"
            value={typeof onboardingData.location === 'object' ? onboardingData.location.city : ''}
            onChange={handleCityChange}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep}>
          Previous
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!selectedCountry || (typeof onboardingData.location === 'object' && !onboardingData.location.state)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;

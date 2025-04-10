
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AtSign } from 'lucide-react';
import { StepProps } from '../OnboardingTypes';
import { INDIAN_LANGUAGES } from '../OnboardingConstants';

const BasicInfoStep: React.FC<StepProps> = ({ onboardingData, handleChange, toggleArrayItem }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          placeholder="Your full name"
          value={onboardingData.full_name}
          onChange={(e) => handleChange('full_name', e.target.value)}
          required
          className="bg-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <AtSign className="h-5 w-5 text-gray-400" />
          </span>
          <Input
            id="username"
            placeholder="Choose a unique username"
            value={onboardingData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            required
            className="pl-10 bg-white"
          />
        </div>
        <p className="text-xs text-gray-500">This will be your public identity on 22POULTRY</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_language">Preferred Language</Label>
        <Select 
          value={onboardingData.preferred_language} 
          onValueChange={(value) => handleChange('preferred_language', value)}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select your preferred language" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_LANGUAGES.map(lang => (
              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Content will be displayed in this language when available</p>
      </div>

      <div className="space-y-2">
        <Label>Secondary Languages (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INDIAN_LANGUAGES.filter(lang => lang !== onboardingData.preferred_language).map(lang => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox 
                id={`lang-${lang}`} 
                checked={onboardingData.secondary_languages.includes(lang)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    toggleArrayItem('secondary_languages', lang);
                  } else {
                    toggleArrayItem('secondary_languages', lang);
                  }
                }}
              />
              <label 
                htmlFor={`lang-${lang}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {lang}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;

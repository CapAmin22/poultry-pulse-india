
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from '../../OnboardingTypes';
import { ORGANIZATION_TYPES } from '../../OnboardingConstants';
import { Switch } from '@/components/ui/switch';

const OrganizationStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  const [representing, setRepresenting] = useState(!!onboardingData.business_name);
  
  const handleToggleRepresenting = (value: boolean) => {
    setRepresenting(value);
    if (!value) {
      // Clear organization data if user is not representing an organization
      handleChange('business_name', '');
      handleChange('organization_type', '');
      handleChange('organization_scope', '');
      handleChange('website_url', '');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="representing-organization" className="text-base">
            Are you representing an organization?
          </Label>
          <Switch 
            id="representing-organization"
            checked={representing}
            onCheckedChange={handleToggleRepresenting}
          />
        </div>
        <p className="text-sm text-gray-500">
          Select if you're joining on behalf of a company, cooperative, or other organization
        </p>
      </div>

      {representing && (
        <>
          <div className="space-y-2">
            <Label htmlFor="business_name">Organization Name <span className="text-red-500">*</span></Label>
            <Input
              id="business_name"
              placeholder="Name of your organization"
              value={onboardingData.business_name}
              onChange={(e) => handleChange('business_name', e.target.value)}
              required={representing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_type">Organization Type</Label>
            <Select 
              value={onboardingData.organization_type} 
              onValueChange={(value) => handleChange('organization_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your organization type" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZATION_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization_scope">Organization Scope</Label>
            <Select 
              value={onboardingData.organization_scope} 
              onValueChange={(value) => handleChange('organization_scope', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your organization's scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local (District/City)</SelectItem>
                <SelectItem value="state">State-level</SelectItem>
                <SelectItem value="regional">Regional (Multiple States)</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website_url">Organization Website</Label>
            <Input
              id="website_url"
              placeholder="Your organization's website URL"
              value={onboardingData.website_url}
              onChange={(e) => handleChange('website_url', e.target.value)}
            />
          </div>
        </>
      )}
      
      {!representing && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p className="text-sm text-blue-700">
            You're joining as an individual user. You can always update your profile later if you wish to associate with an organization.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationStep;

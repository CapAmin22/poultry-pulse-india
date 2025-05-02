
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from '../../OnboardingTypes';
import { ORGANIZATION_TYPES } from '../../OnboardingConstants';

const OrganizationStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="business_name">Organization Name <span className="text-red-500">*</span></Label>
        <Input
          id="business_name"
          placeholder="Name of your organization"
          value={onboardingData.business_name}
          onChange={(e) => handleChange('business_name', e.target.value)}
          required
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
    </div>
  );
};

export default OrganizationStep;


import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone } from 'lucide-react';
import { StepProps } from '../OnboardingTypes';

const ContactStep: React.FC<StepProps> = ({ onboardingData, handleChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mobile_number">Mobile Number</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Phone className="h-5 w-5 text-gray-400" />
          </span>
          <Input
            id="mobile_number"
            type="tel"
            placeholder="10-digit mobile number"
            value={onboardingData.mobile_number}
            onChange={(e) => handleChange('mobile_number', e.target.value.replace(/\D/g, '').substring(0, 10))}
            required
            maxLength={10}
            className="pl-10 bg-white"
          />
        </div>
        <p className="text-xs text-gray-500">
          Your 10-digit mobile number for important updates and notifications
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="whatsapp_number">WhatsApp Number (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="same-number" 
            checked={onboardingData.whatsapp_number === onboardingData.mobile_number}
            onCheckedChange={(checked) => {
              if (checked) {
                handleChange('whatsapp_number', onboardingData.mobile_number);
              } else {
                handleChange('whatsapp_number', '');
              }
            }}
          />
          <label 
            htmlFor="same-number"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Same as mobile number
          </label>
        </div>
        {onboardingData.whatsapp_number !== onboardingData.mobile_number && (
          <div className="mt-2 relative">
            <span className="absolute left-3 top-2.5 text-gray-500">
              <Phone className="h-5 w-5 text-gray-400" />
            </span>
            <Input
              id="whatsapp_number"
              type="tel"
              placeholder="WhatsApp number if different"
              value={onboardingData.whatsapp_number}
              onChange={(e) => handleChange('whatsapp_number', e.target.value.replace(/\D/g, '').substring(0, 10))}
              maxLength={10}
              className="pl-10 bg-white"
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Notification Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="email-notifications" 
              checked={onboardingData.email_notifications}
              onCheckedChange={(checked) => {
                handleChange('email_notifications', !!checked);
              }}
            />
            <label 
              htmlFor="email-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Receive email notifications
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sms-notifications" 
              checked={onboardingData.sms_notifications}
              onCheckedChange={(checked) => {
                handleChange('sms_notifications', !!checked);
              }}
            />
            <label 
              htmlFor="sms-notifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Receive SMS notifications
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself, your experience, or your business..."
          value={onboardingData.bio || ''}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="h-24 bg-white"
        />
      </div>
    </div>
  );
};

export default ContactStep;

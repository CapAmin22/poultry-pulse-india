
export interface OnboardingData {
  full_name: string;
  username: string;
  role: string;
  business_name: string;
  business_size: string;
  poultry_types: string[];
  farming_system: string;
  farming_capacity: string;
  financial_services: string[];
  training_specializations: string[];
  organization_type: string;
  organization_scope: string;
  experience_level: string;
  location: string;
  state: string;
  district: string;
  interests: string[];
  bio: string;
  preferred_language: string;
  secondary_languages: string[];
  mobile_number: string;
  whatsapp_number: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  website_url: string;
  years_in_business: string;
  certifications: string[];
  services_offered: string[];
  product_types: string[];
}

export interface StepProps {
  onboardingData: OnboardingData;
  handleChange: (field: keyof OnboardingData, value: any) => void;
  toggleArrayItem: (field: keyof OnboardingData, item: string) => void;
}

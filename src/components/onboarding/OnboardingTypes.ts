
export interface StepProps {
  onboardingData: OnboardingData;
  handleChange: (field: string, value: any) => void;
  toggleArrayItem: (field: string, item: string) => void;
}

export interface OnboardingData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization?: string;
  position?: string;
  farm_type?: string;
  experience?: string;
  interests: string[];
  location: {
    country: string;
    state: string;
    city: string;
  };
  // Added fields to match usage in OnboardingFlow.tsx
  full_name: string;
  username: string;
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
  state: string;
  district: string;
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
  // Farmer specific
  farm_size?: string;
  livestock_type?: string[];
  production_system?: string;
  challenges?: string[];
  // Processor specific
  processing_type?: string[];
  capacity?: string;
  // Trainer specific
  expertise_areas?: string[];
  certification_details?: string;
  training_formats?: string[];
  // Business specific
  business_type?: string;
  target_audience?: string;
  // Organization specific
  org_type?: string;
  focus_areas?: string[];
  establishment_year?: string;
  // Financial specific
  financial_description?: string;
  // Other
  other_details?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.FC<StepProps>;
  roles?: string[];
}

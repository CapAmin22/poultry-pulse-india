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
  // Farmer specific
  farm_size?: string;
  livestock_type?: string[];
  production_system?: string;
  challenges?: string[];
  // Processor specific
  processing_type?: string[];
  capacity?: string;
  certifications?: string[];
  // Trainer specific
  expertise_areas?: string[];
  years_experience?: string;
  certification_details?: string;
  training_formats?: string[];
  // Business specific
  business_type?: string;
  products_services?: string[];
  target_audience?: string;
  years_in_business?: string;
  // Organization specific
  org_type?: string;
  focus_areas?: string[];
  establishment_year?: string;
  // Financial specific
  financial_services?: string[];
  years_in_business?: string;
  website_url?: string;
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


export interface OnboardingStepProps {
  onboardingData: OnboardingData;
  setOnboardingData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  nextStep: () => void;
  prevStep: () => void;
}

export interface StepProps {
  onboardingData: OnboardingData;
  handleChange: (field: keyof OnboardingData, value: any) => void;
  toggleArrayItem?: (field: keyof OnboardingData, item: string) => void;
}

export interface LocationData {
  country: string;
  state: string;
  city: string;
}

export interface OnboardingData {
  role: string;
  interests: string[];
  location: LocationData;
  // Basic info fields
  full_name?: string;
  username?: string;
  bio?: string;
  preferred_language?: string;
  secondary_languages?: string[];
  experience_level?: string;
  
  // Contact info
  mobile_number?: string;
  whatsapp_number?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  
  // Location fields
  state?: string;
  district?: string;
  
  // Farmer specific fields
  farm_name?: string;
  farm_type?: string;
  farm_size?: string;
  years_in_business?: number;
  poultry_types?: string[];
  farming_system?: string;
  farming_capacity?: string;
  
  // Business specific fields
  business_name?: string;
  business_type?: string;
  business_size?: string;
  product_types?: string[];
  services_offered?: string[];
  
  // Trainer specific fields
  training_specializations?: string[];
  certifications?: string[];
  
  // Organization specific fields
  organization?: string;
  organization_type?: string;
  organization_scope?: string;
  website_url?: string;
  financial_description?: string;
  
  // Financial specific fields
  financial_services?: string[];
  
  // Processor specific fields
  processing_capacity?: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

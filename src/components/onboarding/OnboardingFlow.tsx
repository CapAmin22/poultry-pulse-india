
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Briefcase, Users, Leaf, 
  LandPlot, BarChart2, GraduationCap, Building, Beaker, Phone, 
  MapPin, Calendar, Globe, Mail, AtSign, User, Info, ShieldCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

// Define stakeholder roles with icons and descriptions
const STAKEHOLDER_ROLES = [
  { 
    id: 'farmer', 
    name: 'Poultry Farmer', 
    description: 'I manage poultry farming operations',
    icon: <LandPlot className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'distributor', 
    name: 'Distributor', 
    description: 'I distribute poultry products to markets',
    icon: <Briefcase className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'retailer', 
    name: 'Retailer', 
    description: 'I sell poultry products to consumers',
    icon: <Building className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'processor', 
    name: 'Processor', 
    description: 'I process poultry into various products',
    icon: <Beaker className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'supplier', 
    name: 'Feed/Equipment Supplier', 
    description: 'I supply feed and equipment to farmers',
    icon: <Leaf className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'financial', 
    name: 'Financial Professional',
    description: 'I provide financial services to the poultry industry',
    icon: <BarChart2 className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'trainer', 
    name: 'Training Provider', 
    description: 'I provide training services to the poultry industry',
    icon: <GraduationCap className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'organization', 
    name: 'Organization/Association', 
    description: 'I represent a poultry industry organization',
    icon: <Users className="h-10 w-10 text-[#ea384c]" />
  },
  { 
    id: 'other', 
    name: 'Other', 
    description: 'My role is not listed here',
    icon: <Users className="h-10 w-10 text-[#ea384c]" />
  }
];

// Define farm/business size options
const BUSINESS_SIZES = [
  { id: 'micro', name: 'Micro (< 100 birds)' },
  { id: 'small', name: 'Small (100-500 birds)' },
  { id: 'medium', name: 'Medium (500-2000 birds)' },
  { id: 'large', name: 'Large (2000-10000 birds)' },
  { id: 'enterprise', name: 'Enterprise (10000+ birds)' },
  { id: 'na', name: 'Not Applicable' }
];

// Define poultry types
const POULTRY_TYPES = [
  { id: 'broiler', name: 'Broiler Chickens' },
  { id: 'layer', name: 'Layer Chickens' },
  { id: 'ducks', name: 'Ducks' },
  { id: 'turkey', name: 'Turkeys' },
  { id: 'quail', name: 'Quails' },
  { id: 'mixed', name: 'Mixed Poultry' },
  { id: 'other', name: 'Other' },
  { id: 'na', name: 'Not Applicable' }
];

// Define experience levels
const EXPERIENCE_LEVELS = [
  { id: 'novice', name: 'Novice (< 1 year)' },
  { id: 'beginner', name: 'Beginner (1-3 years)' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)' },
  { id: 'experienced', name: 'Experienced (5-10 years)' },
  { id: 'expert', name: 'Expert (10+ years)' }
];

// Define farming systems
const FARMING_SYSTEMS = [
  { id: 'intensive', name: 'Intensive (Battery Cage)' },
  { id: 'semi_intensive', name: 'Semi-Intensive' },
  { id: 'free_range', name: 'Free Range' },
  { id: 'backyard', name: 'Backyard' },
  { id: 'organic', name: 'Organic' },
  { id: 'mixed', name: 'Mixed System' },
  { id: 'na', name: 'Not Applicable' }
];

// Define financial service types
const FINANCIAL_SERVICES = [
  { id: 'loans', name: 'Loans & Credit' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'investment', name: 'Investment' },
  { id: 'subsidy', name: 'Subsidy Programs' },
  { id: 'consulting', name: 'Financial Consulting' },
  { id: 'banking', name: 'Banking Services' },
  { id: 'other', name: 'Other Financial Services' }
];

// Define training specializations
const TRAINING_SPECIALIZATIONS = [
  { id: 'husbandry', name: 'Poultry Husbandry' },
  { id: 'health', name: 'Poultry Health & Disease Management' },
  { id: 'nutrition', name: 'Nutrition & Feed Management' },
  { id: 'business', name: 'Business Management' },
  { id: 'marketing', name: 'Marketing & Sales' },
  { id: 'biosecurity', name: 'Biosecurity' },
  { id: 'technology', name: 'Technology & Automation' },
  { id: 'other', name: 'Other Specializations' }
];

// Define organization types
const ORGANIZATION_TYPES = [
  { id: 'trade', name: 'Trade Association' },
  { id: 'cooperative', name: 'Cooperative' },
  { id: 'ngo', name: 'NGO' },
  { id: 'govt', name: 'Government Body' },
  { id: 'research', name: 'Research Institution' },
  { id: 'education', name: 'Educational Institution' },
  { id: 'other', name: 'Other Organization Type' }
];

// Define states in India for location selection
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
].sort();

// Define languages spoken in India
const INDIAN_LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 
  'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Assamese', 
  'Odia', 'Urdu', 'Other'
];

interface OnboardingData {
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

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    full_name: '',
    username: '',
    role: '',
    business_name: '',
    business_size: '',
    poultry_types: [],
    farming_system: '',
    farming_capacity: '',
    financial_services: [],
    training_specializations: [],
    organization_type: '',
    organization_scope: '',
    experience_level: '',
    location: '',
    state: '',
    district: '',
    interests: [],
    bio: '',
    preferred_language: 'English',
    secondary_languages: [],
    mobile_number: '',
    whatsapp_number: '',
    email_notifications: true,
    sms_notifications: true,
    website_url: '',
    years_in_business: '',
    certifications: [],
    services_offered: [],
    product_types: []
  });

  // Check if user has already completed onboarding
  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Get user metadata to check onboarding status
      const { data: { user: userData } } = await supabase.auth.getUser();
      const metadata = userData?.user_metadata || {};
      
      if (metadata.onboarding_completed) {
        setOnboardingCompleted(true);
        // If onboarding is complete, redirect to dashboard
        navigate('/');
        return;
      }

      // Pre-fill with existing data if available
      if (metadata.full_name) {
        setOnboardingData(prev => ({
          ...prev,
          full_name: metadata.full_name || '',
          role: metadata.role || '',
          business_name: metadata.business_name || '',
          business_size: metadata.business_size || '',
          experience_level: metadata.experience_level || '',
          location: metadata.location || '',
          state: metadata.state || '',
          district: metadata.district || '',
          mobile_number: metadata.mobile_number || '',
          preferred_language: metadata.preferred_language || 'English'
        }));
      }
      
      // Get profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, bio')
        .eq('user_id', user.id)
        .single();
        
      if (profileData) {
        setOnboardingData(prev => ({
          ...prev,
          username: profileData.username || '',
          bio: profileData.bio || ''
        }));
      }
      
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    setOnboardingData(prev => {
      const currentItems = [...(prev[field] as string[])];
      if (currentItems.includes(item)) {
        return {
          ...prev,
          [field]: currentItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentItems, item]
        };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      return !!onboardingData.full_name && !!onboardingData.username;
    } else if (currentStep === 1) {
      return !!onboardingData.role;
    } else if (currentStep === 2) {
      // Location is required but other fields might be optional based on role
      return !!onboardingData.state;
    } else if (currentStep === 3) {
      // Contact info - require mobile number
      return !!onboardingData.mobile_number && onboardingData.mobile_number.length === 10;
    }
    return true;
  };

  const completeOnboarding = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Validate mobile number
      if (!/^\d{10}$/.test(onboardingData.mobile_number)) {
        toast({
          variant: "destructive",
          title: "Invalid mobile number",
          description: "Please enter a valid 10-digit mobile number",
        });
        setLoading(false);
        return;
      }

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: onboardingData.username,
          bio: onboardingData.bio
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Update user metadata - only include fields relevant to the user's role
      const metadataToUpdate = {
        full_name: onboardingData.full_name,
        role: onboardingData.role,
        business_name: onboardingData.business_name,
        experience_level: onboardingData.experience_level,
        location: onboardingData.location,
        state: onboardingData.state,
        district: onboardingData.district,
        interests: onboardingData.interests,
        preferred_language: onboardingData.preferred_language,
        secondary_languages: onboardingData.secondary_languages,
        mobile_number: onboardingData.mobile_number,
        whatsapp_number: onboardingData.whatsapp_number,
        email_notifications: onboardingData.email_notifications,
        sms_notifications: onboardingData.sms_notifications,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString()
      };

      // Add role-specific fields to metadata
      if (['farmer', 'processor'].includes(onboardingData.role)) {
        Object.assign(metadataToUpdate, {
          business_size: onboardingData.business_size,
          poultry_types: onboardingData.poultry_types,
          farming_system: onboardingData.farming_system,
          farming_capacity: onboardingData.farming_capacity
        });
      } else if (onboardingData.role === 'financial') {
        Object.assign(metadataToUpdate, {
          financial_services: onboardingData.financial_services,
          years_in_business: onboardingData.years_in_business
        });
      } else if (onboardingData.role === 'trainer') {
        Object.assign(metadataToUpdate, {
          training_specializations: onboardingData.training_specializations,
          certifications: onboardingData.certifications
        });
      } else if (onboardingData.role === 'organization') {
        Object.assign(metadataToUpdate, {
          organization_type: onboardingData.organization_type,
          organization_scope: onboardingData.organization_scope,
          website_url: onboardingData.website_url
        });
      } else if (['distributor', 'retailer', 'supplier'].includes(onboardingData.role)) {
        Object.assign(metadataToUpdate, {
          business_size: onboardingData.business_size,
          product_types: onboardingData.product_types,
          services_offered: onboardingData.services_offered
        });
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: metadataToUpdate
      });

      if (metadataError) {
        console.error('Error updating user metadata:', metadataError);
        throw metadataError;
      }

      setCompleted(true);
      
      toast({
        title: "Onboarding completed",
        description: "Your profile has been set up successfully!",
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Onboarding failed",
        description: "There was an error setting up your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Define interests based on user role
  const getInterestsForRole = (role: string) => {
    const commonInterests = ['Market Prices', 'Technology', 'Sustainability', 'Networking'];
    
    const roleSpecificInterests: Record<string, string[]> = {
      'farmer': ['Disease Prevention', 'Feed Management', 'Breeding', 'Housing', 'Waste Management'],
      'distributor': ['Logistics', 'Cold Chain', 'Quality Control', 'Export Markets'],
      'retailer': ['Consumer Trends', 'Retail Display', 'Inventory Management', 'Packaging'],
      'processor': ['Processing Equipment', 'Food Safety', 'Product Development', 'Packaging'],
      'supplier': ['Product Innovation', 'Supply Chain', 'Quality Assurance'],
      'financial': ['Financing', 'Loans', 'Insurance', 'Investment', 'Risk Management'],
      'trainer': ['Training Methods', 'Curriculum Development', 'Certification'],
      'organization': ['Policy', 'Advocacy', 'Research', 'Industry Standards'],
      'other': ['Best Practices', 'Equipment', 'International Trade', 'Regulations']
    };
    
    return [...commonInterests, ...(roleSpecificInterests[role] || roleSpecificInterests['other'])];
  };

  // Role-specific components for step 3
  const renderRoleSpecificFields = () => {
    switch (onboardingData.role) {
      case 'farmer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Poultry Types</Label>
              <div className="grid grid-cols-2 gap-3">
                {POULTRY_TYPES.slice(0, -1).map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`poultry-${type.id}`} 
                      checked={onboardingData.poultry_types.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem('poultry_types', type.id);
                        } else {
                          toggleArrayItem('poultry_types', type.id);
                        }
                      }}
                    />
                    <label 
                      htmlFor={`poultry-${type.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farming_system">Farming System</Label>
              <Select 
                value={onboardingData.farming_system} 
                onValueChange={(value) => handleChange('farming_system', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your farming system" />
                </SelectTrigger>
                <SelectContent>
                  {FARMING_SYSTEMS.slice(0, -1).map(system => (
                    <SelectItem key={system.id} value={system.id}>{system.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farming_capacity">Farming Capacity</Label>
              <Input
                id="farming_capacity"
                placeholder="Number of birds your farm can accommodate"
                value={onboardingData.farming_capacity}
                onChange={(e) => handleChange('farming_capacity', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'financial':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Financial Services Offered</Label>
              <div className="grid grid-cols-2 gap-3">
                {FINANCIAL_SERVICES.slice(0, -1).map(service => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={onboardingData.financial_services.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem('financial_services', service.id);
                        } else {
                          toggleArrayItem('financial_services', service.id);
                        }
                      }}
                    />
                    <label 
                      htmlFor={`service-${service.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_in_business">Years in Financial Services</Label>
              <Input
                id="years_in_business"
                placeholder="How many years have you been in financial services?"
                value={onboardingData.years_in_business}
                onChange={(e) => handleChange('years_in_business', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Company Website (Optional)</Label>
              <Input
                id="website_url"
                placeholder="Your company website URL"
                value={onboardingData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'trainer':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Training Specializations</Label>
              <div className="grid grid-cols-2 gap-3">
                {TRAINING_SPECIALIZATIONS.slice(0, -1).map(specialization => (
                  <div key={specialization.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`spec-${specialization.id}`} 
                      checked={onboardingData.training_specializations.includes(specialization.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem('training_specializations', specialization.id);
                        } else {
                          toggleArrayItem('training_specializations', specialization.id);
                        }
                      }}
                    />
                    <label 
                      htmlFor={`spec-${specialization.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {specialization.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Certifications (Optional)</Label>
              <Input
                placeholder="Enter certification and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newCert = e.currentTarget.value.trim();
                    if (!onboardingData.certifications.includes(newCert)) {
                      setOnboardingData(prev => ({
                        ...prev,
                        certifications: [...prev.certifications, newCert]
                      }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              {onboardingData.certifications.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {onboardingData.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      {cert}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            certifications: prev.certifications.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'organization':
        return (
          <div className="space-y-4">
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
      
      case 'distributor':
      case 'retailer':
      case 'supplier':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Products/Services Offered</Label>
              <Input
                placeholder="Enter product/service and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newItem = e.currentTarget.value.trim();
                    if (!onboardingData.services_offered.includes(newItem)) {
                      setOnboardingData(prev => ({
                        ...prev,
                        services_offered: [...prev.services_offered, newItem]
                      }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              {onboardingData.services_offered.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {onboardingData.services_offered.map((item, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      {item}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            services_offered: prev.services_offered.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Product Types</Label>
              <Input
                placeholder="Enter product type and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newItem = e.currentTarget.value.trim();
                    if (!onboardingData.product_types.includes(newItem)) {
                      setOnboardingData(prev => ({
                        ...prev,
                        product_types: [...prev.product_types, newItem]
                      }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              {onboardingData.product_types.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {onboardingData.product_types.map((item, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      {item}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            product_types: prev.product_types.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_in_business">Years in Business</Label>
              <Input
                id="years_in_business"
                placeholder="How many years have you been in business?"
                value={onboardingData.years_in_business}
                onChange={(e) => handleChange('years_in_business', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'processor':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Poultry Types Processed</Label>
              <div className="grid grid-cols-2 gap-3">
                {POULTRY_TYPES.slice(0, -1).map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`poultry-proc-${type.id}`} 
                      checked={onboardingData.poultry_types.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          toggleArrayItem('poultry_types', type.id);
                        } else {
                          toggleArrayItem('poultry_types', type.id);
                        }
                      }}
                    />
                    <label 
                      htmlFor={`poultry-proc-${type.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Products Manufactured</Label>
              <Input
                placeholder="Enter product and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newItem = e.currentTarget.value.trim();
                    if (!onboardingData.product_types.includes(newItem)) {
                      setOnboardingData(prev => ({
                        ...prev,
                        product_types: [...prev.product_types, newItem]
                      }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              {onboardingData.product_types.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {onboardingData.product_types.map((item, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      {item}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            product_types: prev.product_types.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="processing_capacity">Processing Capacity</Label>
              <Input
                id="processing_capacity"
                placeholder="Processing capacity (e.g., birds per day)"
                value={onboardingData.farming_capacity}
                onChange={(e) => handleChange('farming_capacity', e.target.value)}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="years_in_business">Years in Industry</Label>
              <Input
                id="years_in_business"
                placeholder="How many years have you been in the poultry industry?"
                value={onboardingData.years_in_business}
                onChange={(e) => handleChange('years_in_business', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Main Activities</Label>
              <Input
                placeholder="Enter activity and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newItem = e.currentTarget.value.trim();
                    if (!onboardingData.services_offered.includes(newItem)) {
                      setOnboardingData(prev => ({
                        ...prev,
                        services_offered: [...prev.services_offered, newItem]
                      }));
                    }
                    e.currentTarget.value = '';
                  }
                }}
              />
              {onboardingData.services_offered.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {onboardingData.services_offered.map((item, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm">
                      {item}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => {
                          setOnboardingData(prev => ({
                            ...prev,
                            services_offered: prev.services_offered.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // Generate title based on the user role and current step
  const getStepTitle = (index: number) => {
    const baseTitles = [
      "Basic Information",
      "Your Role",
      "Location & Details",
      `${onboardingData.role ? STAKEHOLDER_ROLES.find(r => r.id === onboardingData.role)?.name || 'Role' : 'Role'}-Specific Information`,
      "Contact & Preferences",
      "Interests"
    ];
    
    return baseTitles[index] || `Step ${index + 1}`;
  };

  // Define onboarding steps
  const steps = [
    {
      title: getStepTitle(0),
      description: "Let's start with your name and username",
      component: (
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
      )
    },
    {
      title: getStepTitle(1),
      description: "Tell us about your role in the poultry industry",
      component: (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Select the option that best describes your role in the poultry industry:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STAKEHOLDER_ROLES.map(role => (
              <div
                key={role.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  onboardingData.role === role.id
                    ? 'border-[#ea384c] bg-red-50 shadow-md'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => handleChange('role', role.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {role.icon}
                  <h3 className="font-medium text-gray-900">{role.name}</h3>
                  <p className="text-xs text-gray-600">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: getStepTitle(2),
      description: "Tell us where you're located and about your business",
      component: (
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

          {(['farmer', 'distributor', 'processor', 'retailer', 'supplier'].includes(onboardingData.role)) && (
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
      )
    },
    {
      title: getStepTitle(3),
      description: `Tell us more about your ${onboardingData.role ? STAKEHOLDER_ROLES.find(r => r.id === onboardingData.role)?.name.toLowerCase() || 'role' : 'role'}`,
      component: renderRoleSpecificFields()
    },
    {
      title: getStepTitle(4),
      description: "Add your contact details and preferences",
      component: (
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
      )
    },
    {
      title: getStepTitle(5),
      description: "Select topics you're interested in",
      component: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll customize your experience based on your interests. Select all that apply:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {onboardingData.role && getInterestsForRole(onboardingData.role).map(interest => (
              <Button
                key={interest}
                type="button"
                variant={onboardingData.interests.includes(interest) ? "default" : "outline"}
                className={`
                  h-auto text-xs py-2 px-3 justify-start normal-case
                  ${onboardingData.interests.includes(interest) ? 
                    'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white' : 
                    ''}
                `}
                onClick={() => toggleArrayItem('interests', interest)}
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>
      )
    }
  ];

  if (loading && !onboardingCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ea384c]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl mb-6"
      >
        <div className="flex items-center justify-center mb-4">
          <img
            src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png"
            alt="22POULTRY"
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
            22POULTRY
          </h1>
        </div>
        
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">
              {steps[currentStep].title}
              {currentStep === 1 && !onboardingData.role && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Required)
                </span>
              )}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-full h-1 rounded-full mx-1 ${
                      index <= currentStep ? 'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Start</span>
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>Complete</span>
              </div>
            </div>
            
            {/* Step content */}
            {steps[currentStep].component}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="border-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={!validateCurrentStep() || loading}
                    className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
                  >
                    {loading ? 'Completing...' : 'Complete Setup'}
                    {!loading && <CheckCircle2 className="h-4 w-4 ml-2" />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Complete Your Onboarding</DialogTitle>
                    <DialogDescription className="text-center py-4">
                      You're all set! Your profile will be created with the information you provided.
                      You can always update your details later from your profile settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <Button 
                      onClick={completeOnboarding} 
                      disabled={loading || completed}
                      className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
                    >
                      {loading ? 'Setting Up...' : 'Finish Setup'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;

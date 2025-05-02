
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OnboardingData } from './OnboardingTypes';
import BasicInfoStep from './steps/BasicInfoStep';
import RoleSelectionStep from './steps/RoleSelectionStep';
import LocationStep from './steps/LocationStep';
import RoleSpecificStep from './steps/RoleSpecificStep';
import ContactStep from './steps/ContactStep';
import InterestsStep from './steps/InterestsStep';

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
    business_name: '', // Will only require if organization or business
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
      
      console.log('User metadata in onboarding flow:', metadata);
      
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

    // Special case: If role changes, do additional handling
    if (field === 'role' && value !== 'organization') {
      // If user is not representing an organization, clear the organization fields
      setOnboardingData(prev => ({
        ...prev,
        [field]: value,
        business_name: '',
        organization_type: '',
        organization_scope: ''
      }));
    }
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
      // For organization role, require business_name
      if (onboardingData.role === 'organization' && !onboardingData.business_name) {
        return false;
      }
      return true;
    } else if (currentStep === 4) {
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

      // Only add business_name if provided (should be required for organizations)
      if (onboardingData.business_name) {
        Object.assign(metadataToUpdate, {
          business_name: onboardingData.business_name
        });
      }

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

  // Define onboarding steps
  const steps = [
    {
      title: "Basic Information",
      description: "Let's start with your name and username",
      component: <BasicInfoStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    },
    {
      title: "Your Role",
      description: "Tell us about your role in the poultry industry",
      component: <RoleSelectionStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    },
    {
      title: "Location & Details",
      description: "Tell us where you're located and about your business",
      component: <LocationStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    },
    {
      title: `Role-Specific Information`,
      description: `Tell us more about your ${onboardingData.role ? onboardingData.role : 'role'}`,
      component: <RoleSpecificStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    },
    {
      title: "Contact & Preferences",
      description: "Add your contact details and preferences",
      component: <ContactStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    },
    {
      title: "Interests",
      description: "Select topics you're interested in",
      component: <InterestsStep 
        onboardingData={onboardingData}
        handleChange={handleChange}
        toggleArrayItem={toggleArrayItem}
      />
    }
  ];

  if (loading && !onboardingCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-[#ea384c]" />
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
            src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png"
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

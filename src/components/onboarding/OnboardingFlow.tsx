
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
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Define stakeholder roles
const STAKEHOLDER_ROLES = [
  { id: 'farmer', name: 'Poultry Farmer', description: 'Manages poultry farming operations' },
  { id: 'distributor', name: 'Distributor', description: 'Distributes poultry products to markets' },
  { id: 'retailer', name: 'Retailer', description: 'Sells poultry products to consumers' },
  { id: 'processor', name: 'Processor', description: 'Processes poultry into various products' },
  { id: 'supplier', name: 'Feed/Equipment Supplier', description: 'Supplies feed and equipment to farmers' },
  { id: 'veterinarian', name: 'Veterinarian', description: 'Provides veterinary services' },
  { id: 'researcher', name: 'Researcher', description: 'Conducts research in poultry industry' },
  { id: 'other', name: 'Other', description: 'Other stakeholder role' }
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

// Define experience levels
const EXPERIENCE_LEVELS = [
  { id: 'novice', name: 'Novice (< 1 year)' },
  { id: 'beginner', name: 'Beginner (1-3 years)' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)' },
  { id: 'experienced', name: 'Experienced (5-10 years)' },
  { id: 'expert', name: 'Expert (10+ years)' }
];

interface OnboardingData {
  full_name: string;
  username: string;
  role: string;
  business_name: string;
  business_size: string;
  experience_level: string;
  location: string;
  interests: string[];
  bio: string;
}

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    full_name: '',
    username: '',
    role: '',
    business_name: '',
    business_size: '',
    experience_level: '',
    location: '',
    interests: [],
    bio: ''
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
          username: '',
          location: metadata.location || ''
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

  const toggleInterest = (interest: string) => {
    setOnboardingData(prev => {
      const currentInterests = [...prev.interests];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...currentInterests, interest]
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
      return !!onboardingData.location;
    }
    return true;
  };

  const completeOnboarding = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: onboardingData.username,
          bio: onboardingData.bio
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: onboardingData.full_name,
          role: onboardingData.role,
          business_name: onboardingData.business_name,
          business_size: onboardingData.business_size,
          experience_level: onboardingData.experience_level,
          location: onboardingData.location,
          interests: onboardingData.interests,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        }
      });

      if (metadataError) throw metadataError;

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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a unique username"
              value={onboardingData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
            />
            <p className="text-xs text-gray-500">This will be your public identity on 22POULTRY</p>
          </div>
        </div>
      )
    },
    {
      title: "Your Role",
      description: "Tell us about your role in the poultry industry",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Select your primary role</Label>
            <Select 
              value={onboardingData.role} 
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {STAKEHOLDER_ROLES.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {onboardingData.role && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900">
                {STAKEHOLDER_ROLES.find(r => r.id === onboardingData.role)?.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {STAKEHOLDER_ROLES.find(r => r.id === onboardingData.role)?.description}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Additional Details",
      description: "Tell us more about your poultry business",
      component: (
        <div className="space-y-4">
          {(['farmer', 'distributor', 'processor', 'retailer'].includes(onboardingData.role)) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="business_name">Business/Farm Name</Label>
                <Input
                  id="business_name"
                  placeholder="Your business or farm name"
                  value={onboardingData.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_size">Business Size</Label>
                <Select 
                  value={onboardingData.business_size} 
                  onValueChange={(value) => handleChange('business_size', value)}
                >
                  <SelectTrigger>
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
              <SelectTrigger>
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
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, State, Country"
              value={onboardingData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself or your business..."
              value={onboardingData.bio || ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="h-24"
            />
          </div>
        </div>
      )
    },
    {
      title: "Interests",
      description: "Select topics you're interested in",
      component: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll customize your experience based on your interests. Select all that apply:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Market Prices', 'Disease Prevention', 'Feed Management', 
              'Technology', 'Financing', 'Training', 
              'Regulations', 'Sustainability', 'Networking',
              'Best Practices', 'Equipment', 'International Trade'
            ].map(interest => (
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
                onClick={() => toggleInterest(interest)}
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
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
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
                <DialogContent>
                  <div className="py-6">
                    <h2 className="text-xl font-bold text-center mb-4">Complete Your Onboarding</h2>
                    <p className="text-center mb-6">
                      You're all set! Your profile will be created with the information you provided.
                      You can always update your details later from your profile settings.
                    </p>
                    <div className="flex justify-center">
                      <Button 
                        onClick={completeOnboarding} 
                        disabled={loading || completed}
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
                      >
                        {loading ? 'Setting Up...' : 'Finish Setup'}
                      </Button>
                    </div>
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

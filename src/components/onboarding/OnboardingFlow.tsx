
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
import { ArrowLeft, ArrowRight, CheckCircle2, Briefcase, Users, Leaf, 
  LandPlot, BarChart2, GraduationCap, Building, Beaker } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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

// Define experience levels
const EXPERIENCE_LEVELS = [
  { id: 'novice', name: 'Novice (< 1 year)' },
  { id: 'beginner', name: 'Beginner (1-3 years)' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)' },
  { id: 'experienced', name: 'Experienced (5-10 years)' },
  { id: 'expert', name: 'Expert (10+ years)' }
];

// Define states in India for location selection
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
].sort();

interface OnboardingData {
  full_name: string;
  username: string;
  role: string;
  business_name: string;
  business_size: string;
  experience_level: string;
  location: string;
  state: string;
  district: string;
  interests: string[];
  bio: string;
  preferred_language: string;
  mobile_number: string;
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
    experience_level: '',
    location: '',
    state: '',
    district: '',
    interests: [],
    bio: '',
    preferred_language: 'English',
    mobile_number: ''
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
      return !!onboardingData.state;
    } else if (currentStep === 3) {
      return !!onboardingData.mobile_number;
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

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: onboardingData.full_name,
          role: onboardingData.role,
          business_name: onboardingData.business_name,
          business_size: onboardingData.business_size,
          experience_level: onboardingData.experience_level,
          location: onboardingData.location,
          state: onboardingData.state,
          district: onboardingData.district,
          interests: onboardingData.interests,
          preferred_language: onboardingData.preferred_language,
          mobile_number: onboardingData.mobile_number,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        }
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

          <div className="space-y-2">
            <Label htmlFor="preferred_language">Preferred Language</Label>
            <Select 
              value={onboardingData.preferred_language} 
              onValueChange={(value) => handleChange('preferred_language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Marathi">Marathi</SelectItem>
                <SelectItem value="Gujarati">Gujarati</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="Punjabi">Punjabi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: "Your Role",
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
      title: "Location & Business Details",
      description: "Tell us where you're located and about your business",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select 
              value={onboardingData.state} 
              onValueChange={(value) => handleChange('state', value)}
            >
              <SelectTrigger>
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
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Village/Town/City</Label>
            <Input
              id="location"
              placeholder="Your village, town or city"
              value={onboardingData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          {(['farmer', 'distributor', 'processor', 'retailer', 'supplier'].includes(onboardingData.role)) && (
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
        </div>
      )
    },
    {
      title: "Contact & Bio",
      description: "Add your contact details and tell us about yourself",
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number</Label>
            <Input
              id="mobile_number"
              type="tel"
              placeholder="10-digit mobile number"
              value={onboardingData.mobile_number}
              onChange={(e) => handleChange('mobile_number', e.target.value.replace(/\D/g, '').substring(0, 10))}
              required
              maxLength={10}
            />
            <p className="text-xs text-gray-500">
              Your 10-digit mobile number for important updates and notifications
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your experience, or your business..."
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

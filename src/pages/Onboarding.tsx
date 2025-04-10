
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is not logged in, redirect to auth page
    if (!loading && !user) {
      console.log('User not logged in, redirecting to auth page');
      navigate('/auth');
    } else if (user) {
      // Check if user has already completed onboarding
      const checkOnboardingStatus = async () => {
        try {
          const { data: { user: userData } } = await supabase.auth.getUser();
          const metadata = userData?.user_metadata || {};
          
          console.log('Checking onboarding status in Onboarding page:', metadata);
          
          if (metadata.onboarding_completed) {
            console.log('User has already completed onboarding, redirecting to home');
            navigate('/');
          } else {
            console.log('User needs to complete onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      };
      
      checkOnboardingStatus();
    }
  }, [user, loading, navigate]);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#ea384c] animate-spin" />
      </div>
    );
  }

  // Don't render the onboarding flow if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div>
      <OnboardingFlow />
    </div>
  );
};

export default Onboarding;

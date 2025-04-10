
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      const checkOnboardingStatus = async () => {
        try {
          const { data: { user: userData } } = await supabase.auth.getUser();
          const metadata = userData?.user_metadata || {};
          
          // If the current path is already /onboarding, no need to redirect again
          if (location.pathname === '/onboarding') {
            setOnboardingCompleted(true);
          } else {
            // If onboarding_completed is explicitly false, redirect to onboarding
            // If it's undefined or null (new user), also redirect to onboarding
            setOnboardingCompleted(!!metadata.onboarding_completed);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "There was a problem verifying your profile status.",
          });
          setOnboardingCompleted(true); // Assume completed in case of error
        } finally {
          setCheckingOnboarding(false);
        }
      };
      
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user, loading, location.pathname]);

  if (loading || checkingOnboarding) {
    // Show loading spinner while checking authentication and onboarding status
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ea384c]"></div>
      </div>
    );
  }

  if (!user) {
    console.log('User not authenticated, redirecting to auth page');
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If onboarding is not completed and not already on onboarding page, redirect to onboarding
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    console.log('Onboarding not completed, redirecting to onboarding page');
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // Render children if authenticated and onboarding is completed
  return <>{children}</>;
};

export default ProtectedRoute;

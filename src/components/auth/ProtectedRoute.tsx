
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

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
            setOnboardingCompleted(!!metadata.onboarding_completed);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
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
    // Redirect to login if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If onboarding is not completed and not already on onboarding page, redirect to onboarding
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // Render children if authenticated and onboarding is completed
  return <>{children}</>;
};

export default ProtectedRoute;

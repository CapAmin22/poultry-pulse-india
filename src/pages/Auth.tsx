
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LocationState {
  initialMode?: 'signin' | 'signup';
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const state = location.state as LocationState;

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('User is signed in, checking onboarding status');
          // Check if onboarding is completed
          const { data: { user: userData } } = await supabase.auth.getUser();
          const metadata = userData?.user_metadata || {};
          
          console.log('User metadata:', metadata);
          if (metadata.onboarding_completed) {
            console.log('Onboarding is completed, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('Onboarding is not completed, redirecting to onboarding');
            navigate('/onboarding');
          }
        } else {
          console.log('No session found, staying on auth page');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-[#ea384c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <img
            src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png"
            alt="22POULTRY"
            className="h-16 w-16 mr-2"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
            22POULTRY
          </h1>
        </div>
        <AuthForm initialMode={state?.initialMode} />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        <p>© {new Date().getFullYear()} 22POULTRY. All rights reserved.</p>
        <p className="mt-1">Empowering poultry stakeholders across India</p>
      </motion.div>
    </div>
  );
};

export default Auth;

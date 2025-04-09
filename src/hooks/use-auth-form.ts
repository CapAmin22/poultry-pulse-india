
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type AuthMode = 'signin' | 'signup';

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
          return;
        }

        toast({
          title: "Signed in successfully",
          description: "Welcome back to 22POULTRY",
        });

        // Check if user has completed onboarding
        const { data: { user: userData } } = await supabase.auth.getUser();
        const metadata = userData?.user_metadata || {};
        
        if (metadata.onboarding_completed) {
          navigate('/');
        } else {
          navigate('/onboarding');
        }
      } else {
        // Signup flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization: organization,
              onboarding_completed: false,
            },
          },
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: error.message,
          });
          return;
        }

        if (data.user) {
          toast({
            title: "Registration successful",
            description: "Your account has been created. Let's set up your profile.",
          });
          navigate('/onboarding');
        } else {
          toast({
            title: "Email confirmation required",
            description: "Please check your email to confirm your account before logging in.",
          });
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    // Clear fields when switching modes
    setPassword('');
  };

  return {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    organization,
    setOrganization,
    showPassword,
    setShowPassword,
    loading,
    handleAuth,
    toggleMode,
  };
}



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type AuthMode = 'signin' | 'signup';

export const useAuthForm = (initialMode: AuthMode = 'signin') => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    // Reset form state when switching modes
    setEmail('');
    setPassword('');
    setFullName('');
    setOrganization('');
    setErrorMessage(undefined);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(undefined);

    try {
      if (mode === 'signin') {
        // Sign in logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        
        navigate('/');
      } else {
        // Sign up logic
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization: organization || null,
              onboarding_completed: false,
            },
          },
        });

        if (error) {
          throw error;
        }

        // Direct sign up completion
        if (data?.user && !data?.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation email to verify your account.",
          });
        } else {
          toast({
            title: "Account created",
            description: "Your account has been created successfully. Let's complete your onboarding.",
          });
          navigate('/onboarding');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setErrorMessage(error.message || 'An error occurred during authentication');
      toast({
        title: "Authentication failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    errorMessage,
  };
};

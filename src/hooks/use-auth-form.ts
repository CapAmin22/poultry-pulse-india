
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

  const validateSignupForm = () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address",
      });
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return false;
    }

    if (!password) {
      toast({
        variant: "destructive",
        title: "Password required",
        description: "Please enter a password",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters",
      });
      return false;
    }

    if (mode === 'signup' && !fullName.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your full name",
      });
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Login failed",
              description: error.message,
            });
          }
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
        console.log('Starting signup with:', { email, password, fullName, organization });
        
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

        console.log('Signup response:', { data, error });

        if (error) {
          console.error('Registration error:', error);
          
          if (error.message.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "Email already registered",
              description: "This email is already in use. Please try logging in instead.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Registration failed",
              description: error.message,
            });
          }
          return;
        }

        if (data.user) {
          // Create profile record
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              username: email.split('@')[0], // Default username from email
              bio: null
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

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

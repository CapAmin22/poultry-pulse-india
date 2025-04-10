
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

  const validateAuthForm = () => {
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

  const handleSignIn = async () => {
    try {
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
        return false;
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
      
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
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
        return false;
      }

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Let's set up your profile.",
        });
        
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
          if (!profileError.message.includes('duplicate')) {
            toast({
              variant: "destructive",
              title: "Profile creation error",
              description: "There was an issue setting up your profile, but you can continue.",
            });
          }
        }
        
        // Always redirect to onboarding after successful signup
        navigate('/onboarding');
        return true;
      } else {
        toast({
          title: "Email confirmation required",
          description: "Please check your email to confirm your account before logging in.",
        });
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAuthForm()) {
      return;
    }
    
    setLoading(true);

    try {
      let success = false;
      
      if (mode === 'signin') {
        success = await handleSignIn();
      } else {
        success = await handleSignUp();
      }
      
      if (!success) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
      });
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

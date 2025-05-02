
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthForm } from '@/hooks/use-auth-form';
import { motion } from 'framer-motion';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthFormProps {
  initialMode?: 'signin' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode }) => {
  const {
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
  } = useAuthForm(initialMode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md mx-auto border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#ea384c]/90 to-[#d02f3d]/90 h-2"></div>
        <AuthHeader mode={mode} />
        
        <CardContent className="p-6">
          {mode === 'signin' ? (
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleAuth}
              errorMessage={errorMessage}
            />
          ) : (
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              fullName={fullName}
              setFullName={setFullName}
              organization={organization}
              setOrganization={setOrganization}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              loading={loading}
              onSubmit={handleAuth}
              errorMessage={errorMessage}
            />
          )}
        </CardContent>
        
        <AuthFooter mode={mode} onToggleMode={toggleMode} />
      </Card>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>By signing in or creating an account, you agree to our</p> 
        <p><a href="#" className="text-[#ea384c] hover:underline">Terms of Service</a> and <a href="#" className="text-[#ea384c] hover:underline">Privacy Policy</a></p>
      </div>
    </motion.div>
  );
};

export default AuthForm;

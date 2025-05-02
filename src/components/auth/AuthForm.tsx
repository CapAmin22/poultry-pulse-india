
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthForm } from '@/hooks/use-auth-form';
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
  } = useAuthForm(initialMode);

  return (
    <Card className="w-full max-w-md mx-auto">
      <AuthHeader mode={mode} />
      
      <CardContent>
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
          />
        )}
      </CardContent>
      
      <AuthFooter mode={mode} onToggleMode={toggleMode} />
    </Card>
  );
};

export default AuthForm;


import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthHeaderProps {
  mode: 'signin' | 'signup';
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-center mb-4">
        <img
          src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png"
          alt="22POULTRY"
          className="h-10 w-10 mr-2"
        />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
          22POULTRY
        </h1>
      </div>
      <CardTitle className="text-center">
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </CardTitle>
      <CardDescription className="text-center">
        {mode === 'signin'
          ? 'Enter your credentials to access your account'
          : 'Fill in the details to create your account'}
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;


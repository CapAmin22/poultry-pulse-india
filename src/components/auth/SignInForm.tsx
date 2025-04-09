
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import AuthFormField from './AuthFormField';

interface SignInFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthFormField
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="name@example.com"
        required
        icon={<Mail className="h-5 w-5" />}
      />

      <AuthFormField
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        required
        icon={<Lock className="h-5 w-5" />}
        rightElement={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        }
      />

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
};

export default SignInForm;


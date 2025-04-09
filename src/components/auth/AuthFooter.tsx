
import React from 'react';
import { CardFooter } from '@/components/ui/card';

interface AuthFooterProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ mode, onToggleMode }) => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-center text-sm">
        {mode === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-[#ea384c] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-[#ea384c] hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </CardFooter>
  );
};

export default AuthFooter;


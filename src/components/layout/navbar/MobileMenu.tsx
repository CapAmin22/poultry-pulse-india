
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export interface MobileMenuProps {
  isAuthenticated: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isAuthenticated, onClose, onSignIn }) => {
  return (
    <div className="fixed inset-x-0 top-16 bg-white z-50 shadow-lg border-t border-gray-100 md:hidden">
      <div className="px-4 py-4">
        <nav className="space-y-2">
          <Link 
            to="/" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Home
          </Link>
          <Link 
            to="/statistics" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Statistics
          </Link>
          <Link 
            to="/marketplace" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Marketplace
          </Link>
          <Link 
            to="/financial" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Financial
          </Link>
          <Link 
            to="/network" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Network
          </Link>
          <Link 
            to="/training" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            Training
          </Link>
          <Link 
            to="/news" 
            onClick={onClose} 
            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#f5565c] hover:bg-gray-100"
          >
            News
          </Link>
        </nav>

        {!isAuthenticated && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col space-y-3">
            <Button 
              className="w-full bg-white border border-[#f5565c] text-[#f5565c] hover:bg-[#f5565c] hover:text-white"
              onClick={() => {
                onSignIn();
                onClose();
              }}
            >
              Sign In
            </Button>
            <Button 
              className="w-full bg-[#f5565c] text-white hover:bg-[#d02f3d]"
              onClick={() => {
                onSignIn();
                onClose();
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;

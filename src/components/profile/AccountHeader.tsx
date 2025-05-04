
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AccountHeaderProps {
  onSignOut: () => Promise<void>;
}

const AccountHeader: React.FC<AccountHeaderProps> = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await onSignOut();
    navigate('/auth');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-gray-500">Manage your profile and account settings</p>
      </div>
      <Button 
        variant="outline" 
        className="mt-4 md:mt-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default AccountHeader;

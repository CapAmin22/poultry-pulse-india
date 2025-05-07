
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const Settings = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account settings"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Account Settings</h3>
        <p className="text-gray-600">Settings content will be added soon.</p>
      </div>
    </div>
  );
};

export default Settings;

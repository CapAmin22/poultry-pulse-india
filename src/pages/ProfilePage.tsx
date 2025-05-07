
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Your Profile" 
        description="Manage your personal information"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Profile Information</h3>
        <p className="text-gray-600">Profile content will be added soon.</p>
      </div>
    </div>
  );
};

export default ProfilePage;

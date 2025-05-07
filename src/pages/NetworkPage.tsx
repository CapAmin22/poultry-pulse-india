
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const NetworkPage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Network" 
        description="Connect with other poultry stakeholders"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Network</h3>
        <p className="text-gray-600">Network content will be added soon.</p>
      </div>
    </div>
  );
};

export default NetworkPage;

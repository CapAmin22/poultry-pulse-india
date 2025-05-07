
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const JobsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Jobs" 
        description="Find jobs in the poultry industry"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Job Listings</h3>
        <p className="text-gray-600">Job content will be added soon.</p>
      </div>
    </div>
  );
};

export default JobsPage;

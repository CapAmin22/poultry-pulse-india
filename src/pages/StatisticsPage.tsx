
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const StatisticsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Statistics" 
        description="View poultry industry statistics"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Industry Statistics</h3>
        <p className="text-gray-600">Statistics content will be added soon.</p>
      </div>
    </div>
  );
};

export default StatisticsPage;


import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const Dashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Dashboard" 
        description="Welcome to your 22POULTRY dashboard"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Dashboard content will go here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-4">Welcome to 22POULTRY</h3>
            <p className="text-gray-600">This is your dashboard. More features will be added soon.</p>
          </div>
        </div>
        <div className="col-span-1 space-y-6">
          {/* Sidebar content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <p className="text-gray-600">Shortcuts will be added here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

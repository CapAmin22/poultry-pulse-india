
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';

const MarketplacePage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Marketplace" 
        description="Buy and sell poultry products and services"
      />
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-medium text-lg mb-4">Marketplace</h3>
        <p className="text-gray-600">Marketplace content will be added soon.</p>
      </div>
    </div>
  );
};

export default MarketplacePage;


import React from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/modules/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialAssistance from '@/components/modules/FinancialAssistance';
import MarketplaceListing from '@/components/modules/MarketplaceListing';

const Index: React.FC = () => {
  return (
    <Layout>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="financial">Financial Assistance</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="financial">
          <FinancialAssistance />
        </TabsContent>
        <TabsContent value="marketplace">
          <MarketplaceListing />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;


import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/modules/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialAssistance from '@/components/modules/FinancialAssistance';
import MarketplaceListing from '@/components/modules/MarketplaceListing';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6 bg-gray-100/80 p-1 rounded-lg shadow-sm">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c] data-[state=active]:shadow-sm"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="financial"
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c] data-[state=active]:shadow-sm"
            >
              Financial Assistance
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace"
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c] data-[state=active]:shadow-sm"
            >
              Marketplace
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>
            <TabsContent value="financial" className="mt-0">
              <FinancialAssistance />
            </TabsContent>
            <TabsContent value="marketplace" className="mt-0">
              <MarketplaceListing />
            </TabsContent>
          </motion.div>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Index;

import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FinancialAssistance from '@/components/modules/FinancialAssistance';

const Financial: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Financial</h1>
          <p className="text-gray-500 mt-1">Manage your finances and explore financial assistance options</p>
        </motion.div>
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="assistance">Assistance</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            Dashboard content here
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            Transactions content here
          </TabsContent>

          <TabsContent value="loans" className="mt-4">
            Loans content here
          </TabsContent>

          <TabsContent value="assistance" className="mt-4">
            <FinancialAssistance />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Financial;

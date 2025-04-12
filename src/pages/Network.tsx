import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const Network: React.FC = () => {
  const [activeTab, setActiveTab] = useState("farmers");

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Network</h1>
          <p className="text-gray-500 mt-1">Connect with farmers, experts, and industry professionals</p>
        </motion.div>
        
        <Tabs defaultValue="farmers" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="farmers" className="mt-4">
            <div>Farmers Content</div>
          </TabsContent>

          <TabsContent value="experts" className="mt-4">
            <div>Experts Content</div>
          </TabsContent>

          <TabsContent value="discussions" className="mt-4">
            <div>Discussions Content</div>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <div>Events Content</div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Network;

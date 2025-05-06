
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Truck, Tags, Settings } from 'lucide-react';

// This component manages marketplace listings, categories, and settings
const AdminMarketplaceManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketplace Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="listings">
          <TabsList className="mb-4">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            <div className="text-center py-10">
              <ShoppingBag className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage Marketplace Listings</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Review, edit or remove product listings in the marketplace.
              </p>
              <Button className="mt-4">View All Listings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="text-center py-10">
              <Tags className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage Categories</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Add, edit or remove product categories and subcategories for the marketplace.
              </p>
              <Button className="mt-4">Edit Categories</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="text-center py-10">
              <Truck className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Transaction History</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                View and monitor marketplace transactions between buyers and sellers.
              </p>
              <Button className="mt-4">View Transactions</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-center py-10">
              <Settings className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Marketplace Settings</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Configure marketplace settings such as featured items, commission rates, and verification requirements.
              </p>
              <Button className="mt-4">Edit Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminMarketplaceManagement;

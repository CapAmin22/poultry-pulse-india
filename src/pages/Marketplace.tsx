
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Filter, Grid, List, Tag, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketplaceListing from '@/components/modules/MarketplaceListing';
import FarmerSellForm from '@/components/marketplace/FarmerSellForm';
import { useAuth } from '@/hooks/use-auth';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'poultry', name: 'Poultry' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'feed', name: 'Feed & Nutrition' },
  { id: 'equipment', name: 'Equipment' },
  { id: 'medicine', name: 'Medicine' },
  { id: 'services', name: 'Services' },
];

const locations = [
  { id: 'all', name: 'All Locations' },
  { id: 'north', name: 'North India' },
  { id: 'south', name: 'South India' },
  { id: 'east', name: 'East India' },
  { id: 'west', name: 'West India' },
  { id: 'central', name: 'Central India' },
];

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6 px-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-gray-600">Buy and sell poultry products and equipment</p>
          </div>
          
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#f5565c]">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Sell Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <FarmerSellForm />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  className="pl-10" 
                  placeholder="Search for products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700 mr-2">Category:</span>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700 mr-2">Location:</span>
                
                <div className="flex flex-wrap gap-2">
                  {locations.map(location => (
                    <Button
                      key={location.id}
                      variant={selectedLocation === location.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      {location.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>All Products</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-8">
            <MarketplaceListing 
              searchQuery={searchQuery} 
              selectedCategory={selectedCategory}
              selectedLocation={selectedLocation}
              viewMode={viewMode}
            />
          </TabsContent>
          
          <TabsContent value="services" className="space-y-8">
            <div className="text-center py-16">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No services available</h3>
              <p className="mt-1 text-sm text-gray-500">Find services in this section coming soon.</p>
              {user && (
                <div className="mt-6">
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add a Service
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Marketplace;

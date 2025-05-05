
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import MarketplaceListing from '@/components/modules/MarketplaceListing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, PlusCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FarmerSellForm from '@/components/marketplace/FarmerSellForm';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

const marketplaceCategories = [
  { id: 'all', name: 'All Categories' },
  { id: 'birds', name: 'Live Birds' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'feed', name: 'Feed & Nutrition' },
  { id: 'equipment', name: 'Equipment & Supplies' },
  { id: 'medicine', name: 'Medicines & Vaccines' },
  { id: 'services', name: 'Services' }
];

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Fetch marketplace listings
    fetchListings();

    // Get user role
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        const role = userMetadata.role || '';
        setUserRole(role);
        
        // If user exists, fetch their listings
        if (user) {
          fetchUserListings(user.id);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    
    getUserRole();
  }, [user]);

  useEffect(() => {
    filterListings();
  }, [selectedCategory, searchQuery, listings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setListings(data);
        setFilteredListings(data);
      }
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      
      // Fallback to mock data
      const mockListings = [
        {
          id: '1',
          title: 'Day-Old Broiler Chicks',
          price: '₹35 per chick',
          location: 'Nashik, Maharashtra',
          category: 'birds',
          description: 'Healthy day-old broiler chicks available for immediate purchase. Vaccinated against common diseases.',
          quantity: '500 chicks',
          image_url: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          created_at: '2023-05-01T08:30:00Z',
        },
        {
          id: '2',
          title: 'Organic Layer Feed',
          price: '₹3,200 per 100kg',
          location: 'Coimbatore, Tamil Nadu',
          category: 'feed',
          description: 'Premium quality organic layer feed formulated for optimal egg production. Made with locally sourced ingredients.',
          quantity: '2 tons available',
          image_url: 'https://images.unsplash.com/photo-1627484164059-c965695234ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          created_at: '2023-04-28T10:15:00Z',
        },
        {
          id: '3',
          title: 'Farm Fresh Brown Eggs',
          price: '₹80 per dozen',
          location: 'Ludhiana, Punjab',
          category: 'eggs',
          description: 'Nutritious farm-fresh brown eggs from cage-free hens. Available for bulk purchase with delivery options.',
          quantity: '200 dozen per week',
          image_url: 'https://images.unsplash.com/photo-1569127959161-2b1297b2d9a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          created_at: '2023-04-25T14:45:00Z',
        },
        {
          id: '4',
          title: 'Used Poultry Incubator (500 capacity)',
          price: '₹45,000',
          location: 'Hyderabad, Telangana',
          category: 'equipment',
          description: 'Slightly used automatic incubator with digital temperature and humidity control. 500 egg capacity. In excellent working condition.',
          condition: 'Used - Like New',
          image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
          created_at: '2023-04-20T09:00:00Z',
        },
      ];
      
      setListings(mockListings);
      setFilteredListings(mockListings);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setMyListings(data);
      }
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  const filterListings = () => {
    let filtered = listings;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredListings(filtered);
  };

  const handleListingCreated = (newListing: any) => {
    setListings(prev => [newListing, ...prev]);
    setMyListings(prev => [newListing, ...prev]);
    setIsDialogOpen(false);
  };

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', listingId);
      
      if (error) throw error;
      
      // Remove from local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      setMyListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  // Determine if user can sell based on role
  const canSell = userRole === 'farmer' || userRole === 'distributor' || userRole === 'supplier' || userRole === 'retailer' || userRole === 'processor';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Poultry Marketplace</h1>
            <p className="text-gray-500">Buy and sell poultry products, equipment, and services</p>
          </div>
          
          {user && canSell && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0 bg-[#f5565c]">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Sell on Marketplace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Marketplace Listing</DialogTitle>
                </DialogHeader>
                <FarmerSellForm onListingCreated={handleListingCreated} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="buy">Buy Products</TabsTrigger>
            {user && canSell && (
              <TabsTrigger value="my_listings">My Listings</TabsTrigger>
            )}
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Available Products</CardTitle>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search marketplace..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filters</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex overflow-x-auto pb-4 mb-6 -mx-1 px-1">
                  {marketplaceCategories.map(category => (
                    <button
                      key={category.id}
                      className={`whitespace-nowrap px-4 py-2 rounded-full mr-2 text-sm ${
                        selectedCategory === category.id
                          ? 'bg-[#f5565c] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {loading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredListings.map(listing => (
                        <MarketplaceListing
                          key={listing.id}
                          listing={listing}
                          canEdit={false}
                        />
                      ))}
                    </div>
                    
                    {filteredListings.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my_listings">
            {user && canSell && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle>My Marketplace Listings</CardTitle>
                    <Button 
                      className="mt-4 md:mt-0 bg-[#f5565c]"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Listing
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {myListings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {myListings.map(listing => (
                        <div key={listing.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                          <div className="grid grid-cols-3 h-full">
                            <div className="aspect-square relative">
                              <img 
                                src={listing.image_url || 'https://via.placeholder.com/300'} 
                                alt={listing.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="col-span-2 p-4 flex flex-col justify-between">
                              <div>
                                <h3 className="font-medium">{listing.title}</h3>
                                <p className="text-[#f5565c] font-medium mt-1">{listing.price}</p>
                                <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{listing.description}</p>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-xs text-gray-500">
                                  Posted: {new Date(listing.created_at).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="border-red-200 text-red-500 hover:bg-red-50"
                                    onClick={() => handleDeleteListing(listing.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No listings yet</h3>
                      <p className="mt-1 text-gray-500">Create your first listing to start selling!</p>
                      <Button 
                        className="mt-4 bg-[#f5565c]"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Listing
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-gray-500">Your purchase history will appear here.</p>
                  <Button 
                    className="mt-4 bg-[#0FA0CE]"
                    onClick={() => setActiveTab('buy')}
                  >
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Marketplace;

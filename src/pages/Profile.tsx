
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import UserProfileForm from '@/components/auth/UserProfileForm';
import UserSettings from '@/components/auth/UserSettings';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, UserCircle, Settings, FileText, Briefcase, ShoppingBag, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of 22POULTRY.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to access your profile.</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-gray-500">Manage your profile and account settings</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Financial Services
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              Job Posts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfileForm />
          </TabsContent>
          
          <TabsContent value="settings">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800">Marketplace</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent marketplace activity.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Financial Applications</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent financial applications.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Network Activity</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent network activity.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Training</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent training activity.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="listings">
            <MyListings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="services">
            <MyFinancialServices userId={user.id} />
          </TabsContent>
          
          <TabsContent value="jobs">
            <MyJobListings userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Component to display user's marketplace listings
const MyListings: React.FC<{ userId: string }> = ({ userId }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Failed to load your listings",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Marketplace Listings</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/marketplace')}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Post New Listing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Category: {listing.category}</p>
                  <p className="text-sm text-gray-600">Price: {listing.price}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(listing.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-gray-500">You haven't posted any marketplace listings yet.</p>
            <Button className="mt-4" onClick={() => navigate('/marketplace')}>
              Create Your First Listing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component to display user's financial services
const MyFinancialServices: React.FC<{ userId: string }> = ({ userId }) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('financial_services')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching financial services:', error);
        toast({
          title: "Failed to load your financial services",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Financial Services</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/financial')}>
            <CreditCard className="h-4 w-4 mr-2" />
            Offer New Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Provider: {service.provider_name}</p>
                  <p className="text-sm text-gray-600">Category: {service.category}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(service.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No financial services found</h3>
            <p className="mt-1 text-gray-500">You haven't offered any financial services yet.</p>
            <Button className="mt-4" onClick={() => navigate('/financial')}>
              Offer Your First Service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component to display user's job listings
const MyJobListings: React.FC<{ userId: string }> = ({ userId }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        toast({
          title: "Failed to load your job listings",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Job Listings</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/network')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Company: {job.company}</p>
                  <p className="text-sm text-gray-600">Location: {job.location}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No job listings found</h3>
            <p className="mt-1 text-gray-500">You haven't posted any job listings yet.</p>
            <Button className="mt-4" onClick={() => navigate('/network')}>
              Post Your First Job
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;

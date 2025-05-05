
import React, { useState, useEffect } from 'react';
import { Database, Filter, Search, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import ServiceProviderForm from '@/components/financial/ServiceProviderForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LoanScheme {
  id: string;
  title: string;
  provider: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  eligibility: string;
  tags: string[];
}

// Interface to match our database structure
interface FinancialService {
  id: string;
  title: string;
  provider_name: string;
  interest_rate: string | null;
  max_amount: string | null;
  tenure: string | null;
  eligibility_criteria: string[] | null;
  category: string;
  tags: string[] | null;
}

const defaultLoanSchemes: LoanScheme[] = [
  {
    id: '1',
    title: 'Poultry Farm Development Loan',
    provider: 'National Bank for Agriculture and Rural Development (NABARD)',
    interestRate: '7-9%',
    maxAmount: '₹50 Lakhs',
    tenure: 'Up to 7 years',
    eligibility: 'Small and medium poultry farmers with at least 2 years of experience',
    tags: ['Subsidy Available', 'Collateral Required']
  },
  {
    id: '2',
    title: 'MUDRA Loan for Poultry Business',
    provider: 'State Bank of India',
    interestRate: '8-11%',
    maxAmount: '₹10 Lakhs',
    tenure: 'Up to 5 years',
    eligibility: 'Small poultry businesses with annual turnover less than ₹5 crore',
    tags: ['No Collateral', 'Quick Approval']
  },
  {
    id: '3',
    title: 'Animal Husbandry Infrastructure Development Fund',
    provider: 'Ministry of Fisheries, Animal Husbandry and Dairying',
    interestRate: '6-8%',
    maxAmount: '₹2 Crore',
    tenure: 'Up to 10 years',
    eligibility: 'Established poultry businesses looking to upgrade infrastructure',
    tags: ['Government Scheme', '3% Interest Subvention']
  },
];

const FinancialAssistance: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loanSchemes, setLoanSchemes] = useState<LoanScheme[]>(defaultLoanSchemes);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationStats, setApplicationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    // Fetch financial services from the database
    const fetchFinancialServices = async () => {
      setLoading(true);
      try {
        // Use type assertion to specify the table and return type
        const { data, error } = await supabase
          .from('financial_services')
          .select('*')
          .order('created_at', { ascending: false }) as { data: FinancialService[] | null, error: any };
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform data to match LoanScheme interface
          const transformedData: LoanScheme[] = data.map(service => ({
            id: service.id,
            title: service.title,
            provider: service.provider_name,
            interestRate: service.interest_rate || 'Not specified',
            maxAmount: service.max_amount || 'Not specified',
            tenure: service.tenure || 'Not specified',
            eligibility: (service.eligibility_criteria && service.eligibility_criteria.length > 0) 
              ? service.eligibility_criteria.join('; ') 
              : 'Contact provider for eligibility criteria',
            tags: [service.category, ...(service.tags || [])]
          }));
          
          // Combine with default schemes
          setLoanSchemes([...transformedData, ...defaultLoanSchemes]);
        }
      } catch (error) {
        console.error('Error fetching financial services:', error);
        toast({
          title: "Failed to load financial services",
          description: "Using default data instead",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialServices();

    // Fetch user role
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        const role = userMetadata.role || '';
        setUserRole(role);

        // If user is a financial provider, fetch applications data
        if (role === 'financial') {
          fetchApplicationsData(user.id);
        } else if (role) {
          // For other roles, fetch their applications
          fetchUserApplications(user.id);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    getUserRole();
  }, [toast, user]);

  // Fetch loan applications for financial providers
  const fetchApplicationsData = async (userId: string) => {
    try {
      // In a real app, this would fetch applications submitted to this financial provider
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setApplications(data);
        
        // Calculate statistics
        const stats = data.reduce((acc: any, app) => {
          acc.total += 1;
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0, reviewing: 0, total: 0 });
        
        setApplicationStats(stats);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Fetch user's own loan applications
  const fetchUserApplications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const filteredSchemes = loanSchemes.filter(scheme => 
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      // Refresh applications data
      if (user && userRole === 'financial') {
        fetchApplicationsData(user.id);
      }
      
      toast({
        title: "Application updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update application status",
      });
    }
  };

  // Render different components based on user role
  const renderRoleSpecificContent = () => {
    if (userRole === 'financial') {
      return (
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-gray-500 text-xs">Total Applications</p>
              <p className="text-2xl font-bold">{applicationStats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-gray-500 text-xs">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-500">{applicationStats.pending || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-gray-500 text-xs">Approved</p>
              <p className="text-2xl font-bold text-green-500">{applicationStats.approved || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <p className="text-gray-500 text-xs">Rejected</p>
              <p className="text-2xl font-bold text-red-500">{applicationStats.rejected || 0}</p>
            </div>
          </div>
          
          <h3 className="font-medium text-lg mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="border rounded-md p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">₹{app.amount} - {app.purpose}</p>
                      <p className="text-sm text-gray-600">Farm Type: {app.farm_type}, Size: {app.farm_size}</p>
                      <p className="text-sm text-gray-600">
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2 justify-end">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateApplicationStatus(app.id, 'reviewing')}
                      disabled={app.status === 'reviewing'}
                    >
                      Review
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-500 text-green-500 hover:bg-green-50"
                      onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                      disabled={app.status === 'approved'}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                      disabled={app.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications to review at this time.</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Database className="h-5 w-5 mr-2 text-poultry-primary" />
              <span>Financial Assistance</span>
            </CardTitle>
            
            {user && userRole === 'financial' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#f5565c]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Offer Financial Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <ServiceProviderForm />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-6">
            Access poultry-specific loan products, financial assistance schemes, and subsidy programs from banks, NBFCs, and government initiatives.
          </div>
          
          <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="browse">Browse Services</TabsTrigger>
              {user && userRole === 'financial' ? (
                <TabsTrigger value="applications">Loan Applications</TabsTrigger>
              ) : (
                <TabsTrigger value="my_applications">My Applications</TabsTrigger>
              )}
              {user && userRole === 'financial' && (
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="browse">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search loan schemes..." 
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
              
              {loading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSchemes.map((scheme) => (
                    <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:border-poultry-primary transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-poultry-primary">{scheme.title}</h3>
                          <p className="text-sm text-gray-600">{scheme.provider}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {scheme.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="text-sm font-medium">{scheme.interestRate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Maximum Amount</p>
                          <p className="text-sm font-medium">{scheme.maxAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tenure</p>
                          <p className="text-sm font-medium">{scheme.tenure}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Eligibility</p>
                        <p className="text-sm">{scheme.eligibility}</p>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        {userRole !== 'financial' && (
                          <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
                            Apply Now
                          </Button>
                        )}
                        {userRole === 'financial' && (
                          <Button variant="outline" size="sm">
                            Edit Service
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredSchemes.length === 0 && (
                    <div className="text-center py-12">
                      <Database className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No financial services found</h3>
                      <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="applications">
              {renderRoleSpecificContent()}
            </TabsContent>
            
            <TabsContent value="analytics">
              {userRole === 'financial' && (
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">Service Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-md shadow">
                      <p className="text-gray-500 text-xs">Application Rate</p>
                      <p className="text-2xl font-bold">24%</p>
                      <p className="text-xs text-green-500">↑ 3% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow">
                      <p className="text-gray-500 text-xs">Approval Rate</p>
                      <p className="text-2xl font-bold">68%</p>
                      <p className="text-xs text-red-500">↓ 2% from last month</p>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow">
                      <p className="text-gray-500 text-xs">Average Loan Amount</p>
                      <p className="text-2xl font-bold">₹45,000</p>
                      <p className="text-xs text-green-500">↑ ₹5,000 from last month</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow mt-4">
                    <h4 className="font-medium mb-4">Regional Distribution</h4>
                    <div className="h-64 flex items-center justify-center bg-gray-50">
                      <p className="text-gray-400">Interactive chart would appear here showing geographic distribution of applications</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my_applications">
              {user && userRole !== 'financial' ? (
                <div className="space-y-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app.id} className="border rounded-md p-4 bg-white">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">₹{app.amount} - {app.purpose}</p>
                            <p className="text-sm text-gray-600">
                              Applied: {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              app.status === 'approved' ? 'bg-green-100 text-green-800' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-700">Your Applications</h3>
                      <p className="text-gray-500 mt-2">Track the status of your financial assistance applications here.</p>
                      <p className="text-gray-400 text-sm mt-6">You don't have any active applications.</p>
                      <Button className="mt-4">Apply for Financial Assistance</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700">Sign in to view your applications</h3>
                  <p className="text-gray-500 mt-2">You need to be signed in to track your applications.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAssistance;

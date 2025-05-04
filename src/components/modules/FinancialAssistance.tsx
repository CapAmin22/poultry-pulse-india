
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

  useEffect(() => {
    // Fetch financial services from the database
    const fetchFinancialServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('financial_services')
          .select('*')
          .order('created_at', { ascending: false });
        
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
  }, [toast]);

  const filteredSchemes = loanSchemes.filter(scheme => 
    scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Database className="h-5 w-5 mr-2 text-poultry-primary" />
              <span>Financial Assistance</span>
            </CardTitle>
            
            {user && (
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
              <TabsTrigger value="my_applications">My Applications</TabsTrigger>
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
                        <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
                          Apply Now
                        </Button>
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
            
            <TabsContent value="my_applications">
              {user ? (
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700">Your Applications</h3>
                  <p className="text-gray-500 mt-2">Track the status of your financial assistance applications here.</p>
                  <p className="text-gray-400 text-sm mt-6">You don't have any active applications.</p>
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

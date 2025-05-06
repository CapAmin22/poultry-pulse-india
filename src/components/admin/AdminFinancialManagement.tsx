
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoanApplication } from '@/types/financial';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Download } from 'lucide-react';
import ApplicationStats from '../financial/ApplicationStats';

const AdminFinancialManagement: React.FC = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [appStats, setAppStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  });
  const [previousStats, setPreviousStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Fetch loan applications
      const { data: appData, error: appError } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (appError) throw appError;
      
      // Fetch financial services
      const { data: servicesData, error: servicesError } = await supabase
        .from('financial_services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (servicesError) throw servicesError;
      
      // Set data
      setApplications(appData || []);
      setServices(servicesData || []);
      
      // Calculate stats
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      // Current stats
      const currentStats = {
        total: appData?.length || 0,
        pending: appData?.filter(app => app.status === 'pending').length || 0,
        reviewing: appData?.filter(app => app.status === 'reviewing').length || 0,
        approved: appData?.filter(app => app.status === 'approved').length || 0,
        rejected: appData?.filter(app => app.status === 'rejected').length || 0
      };
      
      // Mock previous stats (in a real app, you'd query historical data)
      const prevStats = {
        total: Math.floor(currentStats.total * 0.9),
        pending: Math.floor(currentStats.pending * 0.8),
        reviewing: Math.floor(currentStats.reviewing * 0.85),
        approved: Math.floor(currentStats.approved * 0.9),
        rejected: Math.floor(currentStats.rejected * 0.95)
      };
      
      setAppStats(currentStats);
      setPreviousStats(prevStats);
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        variant: "destructive",
        title: "Failed to load financial data",
        description: "There was a problem retrieving financial information."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      
      // Update stats
      setAppStats(prev => ({
        ...prev,
        [status]: prev[status as keyof typeof prev] + 1,
        [selectedApp!.status]: prev[selectedApp!.status as keyof typeof prev] - 1
      }));
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Status update failed",
        description: "Could not update the application status."
      });
    }
  };

  const routeApplicationToProvider = async (applicationId: string, providerId: string) => {
    // In a real app, this would create an assignment in the database
    toast({
      title: "Application routed",
      description: "The application has been assigned to the selected provider.",
    });
  };

  const exportApplicationsCSV = () => {
    // Create CSV content
    const headers = ['Application ID', 'Amount', 'Purpose', 'Status', 'Submitted Date'];
    
    const csvRows = [
      headers.join(','),
      ...applications.map(app => [
        app.id,
        app.amount,
        app.purpose,
        app.status,
        new Date(app.created_at || '').toLocaleDateString()
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `loan_applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.farm_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Services Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applications">
          <TabsList className="mb-4">
            <TabsTrigger value="applications">Loan Applications</TabsTrigger>
            <TabsTrigger value="services">Financial Services</TabsTrigger>
            <TabsTrigger value="providers">Service Providers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <div className="mb-6">
              <ApplicationStats 
                stats={appStats} 
                previousStats={previousStats}
                onFilterByStatus={(status) => setStatusFilter(status)}
              />
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search applications..." 
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportApplicationsCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              {loading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5565c] mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading applications...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <Card key={app.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium">{app.purpose}</h3>
                                <Badge className={`${
                                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">₹{app.amount} - {app.farm_type} farm ({app.farm_size})</p>
                              <p className="text-sm text-gray-500">
                                Submitted: {new Date(app.created_at || '').toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                                    Manage
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Manage Application</DialogTitle>
                                  </DialogHeader>
                                  
                                  {selectedApp && (
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-medium text-lg">{selectedApp.purpose}</h3>
                                        <p className="text-sm text-gray-500">Application ID: {selectedApp.id}</p>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500">Amount</p>
                                          <p className="font-medium">₹{selectedApp.amount}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Duration</p>
                                          <p className="font-medium">{selectedApp.duration}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Farm Type</p>
                                          <p className="font-medium">{selectedApp.farm_type}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Farm Size</p>
                                          <p className="font-medium">{selectedApp.farm_size}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Annual Revenue</p>
                                          <p className="font-medium">₹{selectedApp.annual_revenue}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Collateral</p>
                                          <p className="font-medium">{selectedApp.collateral}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="border-t pt-4">
                                        <p className="font-medium mb-2">Route to Financial Provider</p>
                                        <Select onValueChange={(value) => routeApplicationToProvider(selectedApp.id!, value)}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a provider" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="provider1">National Bank for Agriculture</SelectItem>
                                            <SelectItem value="provider2">State Bank of India</SelectItem>
                                            <SelectItem value="provider3">Rural Cooperative Bank</SelectItem>
                                            <SelectItem value="provider4">Poultry Finance Corp.</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="border-t pt-4">
                                        <p className="font-medium mb-2">Update Status</p>
                                        <div className="flex flex-wrap gap-2">
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                            disabled={selectedApp.status === 'pending'}
                                            onClick={() => handleUpdateStatus(selectedApp.id!, 'pending')}
                                          >
                                            Mark Pending
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                            disabled={selectedApp.status === 'reviewing'}
                                            onClick={() => handleUpdateStatus(selectedApp.id!, 'reviewing')}
                                          >
                                            Mark Reviewing
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-green-500 text-green-600 hover:bg-green-50"
                                            disabled={selectedApp.status === 'approved'}
                                            onClick={() => handleUpdateStatus(selectedApp.id!, 'approved')}
                                          >
                                            Mark Approved
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="border-red-500 text-red-600 hover:bg-red-50"
                                            disabled={selectedApp.status === 'rejected'}
                                            onClick={() => handleUpdateStatus(selectedApp.id!, 'rejected')}
                                          >
                                            Mark Rejected
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-gray-500">No applications match your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Available Financial Services</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-medium text-[#f5565c] mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Provider: {service.provider_name}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.tags && service.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-600 space-y-1 mb-3">
                      <p>Interest Rate: {service.interest_rate || 'Not specified'}</p>
                      <p>Max Amount: {service.max_amount || 'Not specified'}</p>
                      <p>Tenure: {service.tenure || 'Not specified'}</p>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="providers">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">Financial Provider Management</h3>
              <p className="text-gray-600">
                Manage financial institutions, banks, and government agencies that provide financial services 
                through the 22POULTRY platform.
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Provider
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminFinancialManagement;

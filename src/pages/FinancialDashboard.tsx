
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard, Plus, BarChart, Users, FileText, Calendar } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import ServiceProviderForm from '@/components/financial/ServiceProviderForm';
import FinancialServiceList from '@/components/financial/FinancialServiceList';
import ApplicationList from '@/components/financial/ApplicationList';
import LoanApplicationForm from '@/components/financial/LoanApplicationForm';
import TransactionForm from '@/components/financial/TransactionForm';
import TransactionsList from '@/components/financial/TransactionsList';
import ApplicationStats from '@/components/financial/ApplicationStats';
import { useFinancial } from '@/contexts/FinancialContext';

const FinancialDashboard: React.FC = () => {
  const { role, isFinancialProvider } = useRole();
  const { 
    financialServices, 
    loanApplications, 
    userApplications,
    transactions,
    isLoading,
    refreshServices,
    refreshApplications,
    refreshTransactions,
    updateApplicationStatus,
    deleteService
  } = useFinancial();
  
  const [activeTab, setActiveTab] = useState('browse');
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<string | null>(null);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  });
  
  // Mock data for previous stats (for comparison)
  const previousStats = {
    total: applicationStats.total > 0 ? Math.round(applicationStats.total * 0.8) : 0,
    pending: applicationStats.pending > 0 ? Math.round(applicationStats.pending * 0.7) : 0,
    reviewing: applicationStats.reviewing > 0 ? Math.round(applicationStats.reviewing * 0.9) : 0,
    approved: applicationStats.approved > 0 ? Math.round(applicationStats.approved * 0.85) : 0,
    rejected: applicationStats.rejected > 0 ? Math.round(applicationStats.rejected * 0.75) : 0
  };
  
  useEffect(() => {
    if (isFinancialProvider) {
      // Calculate stats for financial providers
      setApplicationStats({
        total: loanApplications.length,
        pending: loanApplications.filter(app => app.status === 'pending').length,
        reviewing: loanApplications.filter(app => app.status === 'reviewing').length,
        approved: loanApplications.filter(app => app.status === 'approved').length,
        rejected: loanApplications.filter(app => app.status === 'rejected').length
      });
    }
  }, [loanApplications, isFinancialProvider]);
  
  const handleUpdateStatus = async (id: string, status: "pending" | "reviewing" | "approved" | "rejected", feedback?: string) => {
    await updateApplicationStatus(id, status, feedback);
  };
  
  const handleDeleteService = async (id: string) => {
    await deleteService(id);
  };
  
  const handleEditService = (id: string) => {
    setServiceToEdit(id);
    setIsServiceDialogOpen(true);
  };
  
  const handleApplyForService = (id: string) => {
    setActiveTab('apply');
  };
  
  const handleServiceFormSuccess = () => {
    setIsServiceDialogOpen(false);
    setServiceToEdit(null);
    refreshServices();
  };
  
  const handleApplicationFormSuccess = () => {
    setActiveTab('myapplications');
    refreshApplications();
  };

  const handleTransactionFormSuccess = () => {
    setIsTransactionDialogOpen(false);
    refreshTransactions();
    setActiveTab('transactions');
  };
  
  const filterByStatus = (status: string) => {
    // This would typically set a filter state
    console.log(`Filtering by status: ${status}`);
    // For now, we'll just scroll to the applications section
    setActiveTab('applications');
    setTimeout(() => {
      const element = document.getElementById('applications-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Services</h1>
          <p className="text-muted-foreground">
            {isFinancialProvider 
              ? 'Manage your financial services and loan applications' 
              : 'Explore financial assistance options for your poultry business'}
          </p>
        </div>
        
        <div className="flex gap-2">
          {isFinancialProvider && (
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#f5565c]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Financial Service</DialogTitle>
                </DialogHeader>
                <ServiceProviderForm 
                  onSuccess={handleServiceFormSuccess}
                  serviceId={serviceToEdit}
                />
              </DialogContent>
            </Dialog>
          )}
          
          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#f5565c] text-[#f5565c]">
                <Plus className="mr-2 h-4 w-4" />
                Record Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Record Financial Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm 
                onSuccess={handleTransactionFormSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isFinancialProvider && (
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-6">
              <ApplicationStats 
                stats={applicationStats} 
                previousStats={previousStats}
                onFilterByStatus={filterByStatus}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="browse">Browse Services</TabsTrigger>
          <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
          {isFinancialProvider ? (
            <TabsTrigger value="applications" id="applications-section">Loan Applications</TabsTrigger>
          ) : (
            <TabsTrigger value="myapplications">My Applications</TabsTrigger>
          )}
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="browse" className="space-y-4">
            <FinancialServiceList 
              services={financialServices.map(service => ({
                id: service.id || '',
                title: service.title,
                provider: service.provider_name,
                interestRate: service.interest_rate,
                maxAmount: service.max_amount,
                tenure: service.tenure,
                eligibility: Array.isArray(service.eligibility_criteria) ? service.eligibility_criteria.join('; ') : (service.eligibility_criteria || 'Contact provider for details'),
                tags: [service.category, ...(service.tags || [])]
              }))}
              loading={isLoading}
              userRole={role}
              onEdit={isFinancialProvider ? handleEditService : undefined}
              onApply={!isFinancialProvider ? handleApplyForService : undefined}
              onDelete={isFinancialProvider ? handleDeleteService : undefined}
            />
          </TabsContent>
          
          <TabsContent value="apply" className="space-y-4">
            <LoanApplicationForm onSuccess={handleApplicationFormSuccess} />
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-4">
            {isFinancialProvider && (
              <ApplicationList 
                applications={loanApplications.map(app => ({
                  id: app.id || '',
                  amount: app.amount,
                  purpose: app.purpose,
                  farm_type: app.farm_type,
                  farm_size: app.farm_size,
                  status: app.status as 'pending' | 'reviewing' | 'approved' | 'rejected',
                  created_at: app.created_at || new Date().toISOString()
                }))}
                isProvider={true}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </TabsContent>
          
          <TabsContent value="myapplications" className="space-y-4">
            {!isFinancialProvider && (
              <ApplicationList 
                applications={userApplications.map(app => ({
                  id: app.id || '',
                  amount: app.amount,
                  purpose: app.purpose,
                  farm_type: app.farm_type,
                  farm_size: app.farm_size,
                  status: app.status as 'pending' | 'reviewing' | 'approved' | 'rejected',
                  created_at: app.created_at || new Date().toISOString()
                }))}
                isProvider={false}
              />
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <TransactionsList transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <FileText className="h-10 w-10 text-[#f5565c] mb-4" />
                  <h3 className="text-lg font-medium mb-2">Loan Documentation Guide</h3>
                  <p className="text-sm text-gray-600">Learn about the documents required for loan applications and how to prepare them.</p>
                  <Button variant="link" className="mt-4">Read Guide</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <BarChart className="h-10 w-10 text-[#f5565c] mb-4" />
                  <h3 className="text-lg font-medium mb-2">Financial Planning Tools</h3>
                  <p className="text-sm text-gray-600">Access calculators and tools to help plan your business finances and loan repayments.</p>
                  <Button variant="link" className="mt-4">Use Tools</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-gray-50 transition-colors">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Calendar className="h-10 w-10 text-[#f5565c] mb-4" />
                  <h3 className="text-lg font-medium mb-2">Financial Workshops</h3>
                  <p className="text-sm text-gray-600">Join upcoming workshops on financial management for poultry businesses.</p>
                  <Button variant="link" className="mt-4">View Schedule</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">How do I qualify for a poultry business loan?</h3>
                  <p className="text-sm text-gray-600">Qualifying for a poultry business loan typically requires having at least 2 years of experience in poultry farming, a viable business plan, and collateral. Financial institutions also look at your credit history and revenue projections.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">What documents do I need to apply for financial assistance?</h3>
                  <p className="text-sm text-gray-600">Common required documents include identity proof, address proof, farm ownership documents, financial statements for the past 2-3 years, business plan, and collateral documentation.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">How long does the loan approval process take?</h3>
                  <p className="text-sm text-gray-600">The process typically takes between 2-4 weeks, depending on the financial institution and the completeness of your application.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Are there government subsidies available for poultry farming?</h3>
                  <p className="text-sm text-gray-600">Yes, several government schemes offer subsidies, including the National Livestock Mission, NABARD schemes, and state-specific agricultural subsidies. Check with your local agricultural department for details.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;

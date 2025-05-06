
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Users, CreditCard, FileText, Settings, ShoppingBag, BookOpen, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminFinancialManagement from '@/components/admin/AdminFinancialManagement';
import AdminContentManagement from '@/components/admin/AdminContentManagement';
import AdminSystemSettings from '@/components/admin/AdminSystemSettings';
import AdminMarketplaceManagement from '@/components/admin/AdminMarketplaceManagement';
import AdminTrainingManagement from '@/components/admin/AdminTrainingManagement';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { role, isAdmin: roleIsAdmin, isLoading: roleLoading } = useRole();
  const [activeTab, setActiveTab] = useState('users');
  const [systemStats, setSystemStats] = useState({
    users: 0,
    loanApplications: 0,
    listings: 0,
    trainingResources: 0,
    reportedContent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemStats = async () => {
      if (!user || (!isAdmin && !roleIsAdmin)) return;
      
      setLoading(true);
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        // Fetch loan applications count
        const { count: loanCount, error: loanError } = await supabase
          .from('loan_applications')
          .select('*', { count: 'exact', head: true });
          
        // Fetch marketplace listings count
        const { count: listingCount, error: listingError } = await supabase
          .from('marketplace_listings')
          .select('*', { count: 'exact', head: true });
          
        setSystemStats({
          users: userCount || 0,
          loanApplications: loanCount || 0,
          listings: listingCount || 0,
          trainingResources: 24, // Mock data
          reportedContent: 3 // Mock data
        });
        
      } catch (error) {
        console.error('Error fetching system stats:', error);
        toast({
          variant: "destructive",
          title: "Failed to load system statistics",
          description: "There was a problem loading the admin dashboard data."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSystemStats();
  }, [user, isAdmin, roleIsAdmin]);

  // Check if user has admin access
  if ((!isAdmin && !roleIsAdmin) && !authLoading && !roleLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <Card className="border-red-300">
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Access Restricted
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4">You don't have permission to access this area. This section requires administrator privileges.</p>
              <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (authLoading || roleLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#f5565c]" />
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">22POULTRY Admin Dashboard</h1>
          <p className="text-gray-600">Manage all aspects of the 22POULTRY platform</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-gray-500 text-xs">Total Users</p>
              <p className="text-2xl font-bold">{systemStats.users}</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-gray-500 text-xs">Loan Applications</p>
              <p className="text-2xl font-bold">{systemStats.loanApplications}</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-gray-500 text-xs">Marketplace Listings</p>
              <p className="text-2xl font-bold">{systemStats.listings}</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-gray-500 text-xs">Training Resources</p>
              <p className="text-2xl font-bold">{systemStats.trainingResources}</p>
            </CardContent>
          </Card>
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <p className="text-gray-500 text-xs">Reported Content</p>
              <p className="text-2xl font-bold text-amber-500">{systemStats.reportedContent}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Financial Services
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Content & Resources
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="financial">
            <AdminFinancialManagement />
          </TabsContent>

          <TabsContent value="content">
            <AdminContentManagement />
          </TabsContent>

          <TabsContent value="marketplace">
            <AdminMarketplaceManagement />
          </TabsContent>

          <TabsContent value="training">
            <AdminTrainingManagement />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

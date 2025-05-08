import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const AdminSecurityPage: React.FC = () => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  // Tables that need RLS policies
  const tables = [
    'financial_services',
    'financial_transactions',
    'job_listings',
    'loan_applications',
    'marketplace_listings',
    'network_connections',
    'network_discussions',
    'network_events',
    'network_experts',
    'network_farmers',
    'profiles'
  ];

  // Define a proper type for the RPC parameters
  type ApplyRlsPolicyParams = {
    table_name: string;
  };

  const applyRlsPolicy = async (tableName: string) => {
    try {
      const { error } = await supabase.rpc<boolean, ApplyRlsPolicyParams>(
        'apply_rls_policy', 
        { table_name: tableName }
      );
      
      if (error) throw error;
      toast({
        title: "Success",
        description: `Successfully applied RLS policy to ${tableName}`
      });
      return true;
    } catch (error) {
      console.error(`Failed to apply RLS policy to ${tableName}:`, error);
      toast({
        title: "Error",
        description: `Failed to apply RLS policy to ${tableName}`,
        variant: "destructive"
      });
      return false;
    }
  };

  const applyAllPolicies = async () => {
    setIsLoading(true);
    try {
      // Call the edge function that applies all RLS policies
      const response = await fetch(
        'https://xtdukbzdbzbemyqaifhp.supabase.co/functions/v1/apply_rls_policies',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession() ? (await supabase.auth.getSession()).data.session?.access_token : ''}`
          }
        }
      );
      
      const result = await response.json();
      
      if (!result.success) throw new Error(result.error);
      
      toast({
        title: "Success",
        description: "Successfully applied all RLS policies"
      });
    } catch (error: any) {
      console.error("Error applying RLS policies:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to apply RLS policies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Security Administration</h1>
          <p className="text-muted-foreground">Manage Row Level Security policies and other security settings</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Row Level Security Policies
              </CardTitle>
              <CardDescription>
                Apply RLS policies to protect your database tables from unauthorized access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-sm">
                  Some tables are missing RLS policies. This could allow unauthorized access to data.
                </span>
              </div>
              
              <ul className="space-y-2 mb-4">
                {tables.map(table => (
                  <li key={table} className="flex justify-between items-center p-2 bg-muted rounded-md">
                    <span>public.{table}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyRlsPolicy(table)}
                    >
                      Apply Policy
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={applyAllPolicies} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying Policies...
                  </>
                ) : "Apply All RLS Policies"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminSecurityPage;

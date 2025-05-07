
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LoanApplication, Transaction, FinancialService } from '@/types/financial';

interface FinancialContextProps {
  financialServices: FinancialService[];
  loanApplications: LoanApplication[];
  isLoading: boolean;
  userApplications: LoanApplication[];
  refreshServices: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  updateApplicationStatus: (id: string, status: "pending" | "reviewing" | "approved" | "rejected", feedback?: string) => Promise<void>;
  submitApplication: (applicationData: any) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  addTransaction: (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
}

const FinancialContext = createContext<FinancialContextProps | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [financialServices, setFinancialServices] = useState<FinancialService[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [userApplications, setUserApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshServices = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFinancialServices(data || []);
    } catch (error) {
      console.error('Error fetching financial services:', error);
      toast({
        title: "Failed to load services",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshApplications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get user role from metadata
      const { data: { user: userData } } = await supabase.auth.getUser();
      const userRole = userData?.user_metadata?.role || '';
      
      if (userRole === 'financial') {
        // Financial providers see all applications
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        // Add proper type assertion to ensure status is of the correct type
        setLoanApplications(data.map(app => ({
          ...app,
          status: app.status as "pending" | "reviewing" | "approved" | "rejected"
        })));
      } else {
        // Other users only see their own applications
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        // Add proper type assertion for status
        setUserApplications(data.map(app => ({
          ...app,
          status: app.status as "pending" | "reviewing" | "approved" | "rejected"
        })));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Failed to load applications",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      // Add proper type assertion for transaction type
      setTransactions(data.map(transaction => ({
        ...transaction,
        type: transaction.type as "income" | "expense"
      })));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Failed to load transactions",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return false;
    
    try {
      // Ensure the transaction type is valid
      if (transactionData.type !== "income" && transactionData.type !== "expense") {
        throw new Error("Invalid transaction type. Must be 'income' or 'expense'");
      }
      
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Transaction added",
        description: "Your financial transaction has been recorded",
      });
      
      await refreshTransactions();
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Failed to add transaction",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateApplicationStatus = async (id: string, status: "pending" | "reviewing" | "approved" | "rejected", feedback?: string) => {
    if (!user) return;
    
    try {
      const updateData: any = { status };
      if (feedback) {
        updateData.additional_info = feedback;
      }
      
      const { error } = await supabase
        .from('loan_applications')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Application has been marked as ${status}`,
      });
      
      await refreshApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the application status",
      });
      throw error;
    }
  };

  const submitApplication = async (applicationData: any) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('loan_applications')
        .insert({
          ...applicationData,
          user_id: user.id,
          status: 'pending' as "pending" | "reviewing" | "approved" | "rejected"
        });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your loan application has been submitted successfully",
      });
      
      await refreshApplications();
      return true;
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your application",
      });
      return false;
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('financial_services')
        .delete()
        .eq('id', serviceId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Service deleted",
        description: "The financial service has been removed successfully",
      });
      
      await refreshServices();
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "There was an error deleting the service",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      refreshServices();
      refreshApplications();
      refreshTransactions();
    }
  }, [user]);

  const value = {
    financialServices,
    loanApplications,
    userApplications,
    transactions,
    isLoading,
    refreshServices,
    refreshApplications,
    refreshTransactions,
    updateApplicationStatus,
    submitApplication,
    deleteService,
    addTransaction
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

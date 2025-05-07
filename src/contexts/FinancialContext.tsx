
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Transaction, LoanApplication, FinancialService } from '@/types/financial';

interface FinancialContextType {
  financialServices: FinancialService[];
  loanApplications: LoanApplication[];
  userApplications: LoanApplication[];
  transactions: Transaction[];
  isLoading: boolean;
  refreshServices: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  updateApplicationStatus: (id: string, status: "pending" | "reviewing" | "approved" | "rejected", feedback?: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType>({
  financialServices: [],
  loanApplications: [],
  userApplications: [],
  transactions: [],
  isLoading: true,
  refreshServices: async () => {},
  refreshApplications: async () => {},
  refreshTransactions: async () => {},
  updateApplicationStatus: async () => {},
  deleteService: async () => {}
});

export const useFinancial = () => useContext(FinancialContext);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialServices, setFinancialServices] = useState<FinancialService[]>([]);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [userApplications, setUserApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isFinancialProvider } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      Promise.all([
        refreshServices(),
        refreshApplications(),
        refreshTransactions()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);
  
  const refreshServices = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_services')
        .select('*');
      
      if (error) throw error;
      
      setFinancialServices(data as FinancialService[]);
    } catch (error: any) {
      console.error("Error loading financial services:", error);
    }
  };
  
  const refreshApplications = async () => {
    if (!user) return;
    
    try {
      // If financial provider, get all applications
      if (isFinancialProvider) {
        const { data, error } = await supabase
          .from('loan_applications')
          .select('*');
        
        if (error) throw error;
        
        // Ensure the data has the correct status type
        const typedData = data.map(app => ({
          ...app,
          status: app.status as "pending" | "reviewing" | "approved" | "rejected"
        }));
        
        setLoanApplications(typedData);
      }
      
      // Get user's own applications
      const { data: userData, error: userError } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id);
      
      if (userError) throw userError;
      
      // Ensure the data has the correct status type
      const typedUserData = userData.map(app => ({
        ...app,
        status: app.status as "pending" | "reviewing" | "approved" | "rejected"
      }));
      
      setUserApplications(typedUserData);
    } catch (error: any) {
      console.error("Error loading loan applications:", error);
    }
  };
  
  const refreshTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Ensure the data has the correct type
      const typedData = data.map(transaction => ({
        ...transaction,
        type: validateTransactionType(transaction.type)
      }));
      
      setTransactions(typedData);
    } catch (error: any) {
      console.error("Error loading transactions:", error);
    }
  };
  
  // Function to validate and convert transaction type to the correct format
  const validateTransactionType = (type: string): "income" | "expense" => {
    if (type === "income" || type === "expense") {
      return type;
    }
    // Default to expense if not valid
    console.warn(`Invalid transaction type: ${type}, defaulting to 'expense'`);
    return "expense";
  };
  
  const updateApplicationStatus = async (
    id: string, 
    status: "pending" | "reviewing" | "approved" | "rejected", 
    feedback?: string
  ) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ 
          status, 
          ...(feedback && { feedback })
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the applications after update
      refreshApplications();
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${status}.`
      });
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update application status."
      });
    }
  };
  
  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh the services after delete
      refreshServices();
      
      toast({
        title: "Service deleted",
        description: "Financial service has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting financial service:", error);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: error.message || "Failed to delete financial service."
      });
    }
  };
  
  return (
    <FinancialContext.Provider
      value={{
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
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

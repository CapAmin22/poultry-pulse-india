
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Check, Clock, ArrowRight, FileText, Calendar, Phone, BriefcaseBusiness } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import FinancialAssistance from '@/components/modules/FinancialAssistance';

interface LoanApplication {
  id: string;
  amount: number;
  farm_type: string;
  farm_size: string;
  duration: string;
  purpose: string;
  annual_revenue: number;
  collateral: string;
  additional_info?: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  created_at: string;
  updated_at: string;
  contact_number?: string;
  existing_loans?: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
  customer?: string;
  notes?: string;
}

const Financial: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [showNewLoanForm, setShowNewLoanForm] = useState(false);
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [newLoan, setNewLoan] = useState<Partial<LoanApplication>>({
    amount: 0,
    farm_type: '',
    farm_size: '',
    duration: '',
    purpose: '',
    annual_revenue: 0,
    collateral: '',
    additional_info: '',
    contact_number: '',
    existing_loans: ''
  });

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    category: '',
    amount: 0,
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    customer: '',
    notes: ''
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        if (!user) return;

        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('financial_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('transaction_date', { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch loan applications
        const { data: loansData, error: loansError } = await supabase
          .from('loan_applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (loansError) throw loansError;
        setLoans(loansData || []);

      } catch (error) {
        console.error("Error fetching financial data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load financial data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [user]);

  const handleSubmitLoanApplication = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You need to be logged in to apply for a loan.",
      });
      return;
    }

    if (!newLoan.amount || !newLoan.farm_type || !newLoan.farm_size || 
        !newLoan.duration || !newLoan.purpose || !newLoan.annual_revenue ||
        !newLoan.collateral) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          ...newLoan,
          user_id: user.id,
          status: 'pending',
        })
        .select();

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your loan application has been submitted successfully.",
      });

      if (data) {
        setLoans([data[0] as LoanApplication, ...loans]);
      }

      setShowNewLoanForm(false);
      setNewLoan({
        amount: 0,
        farm_type: '',
        farm_size: '',
        duration: '',
        purpose: '',
        annual_revenue: 0,
        collateral: '',
        additional_info: '',
        contact_number: '',
        existing_loans: ''
      });
    } catch (error) {
      console.error("Error submitting loan application:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You need to be logged in to add transactions.",
      });
      return;
    }

    if (!newTransaction.type || !newTransaction.category || !newTransaction.amount || 
        !newTransaction.description || !newTransaction.transaction_date) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert({
          ...newTransaction,
          user_id: user.id,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Transaction Added",
        description: "Your transaction has been recorded successfully.",
      });

      if (data) {
        setTransactions([data[0] as Transaction, ...transactions]);
      }

      setShowNewTransactionForm(false);
      setNewTransaction({
        type: 'income',
        category: '',
        amount: 0,
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        customer: '',
        notes: ''
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add transaction. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateLoanStatus = async (loanId: string, newStatus: 'approved' | 'rejected' | 'reviewing') => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only administrators can update loan statuses.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('loan_applications')
        .update({ status: newStatus })
        .eq('id', loanId);

      if (error) throw error;

      // Update local state
      setLoans(prevLoans => prevLoans.map(loan => 
        loan.id === loanId ? { ...loan, status: newStatus } : loan
      ));

      toast({
        title: "Status Updated",
        description: `Loan application status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: "Failed to update loan status. Please try again.",
      });
    }
  };

  // Calculate financial summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpenses;

  // Helper functions for loan applications
  const getLoanStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getLoanStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <Check className="h-4 w-4" />;
      case 'rejected': return <span>✘</span>;
      case 'reviewing': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Transaction categories
  const incomeCategories = ['Sales', 'Subsidies', 'Investments', 'Other Income'];
  const expenseCategories = ['Feed', 'Medication', 'Labor', 'Equipment', 'Utilities', 'Taxes', 'Transport', 'Other Expenses'];
  
  // Loan form options
  const farmTypes = ['Layer', 'Broiler', 'Mixed', 'Processing', 'Other'];
  const farmSizes = ['Small (<500 birds)', 'Medium (500-2000 birds)', 'Large (2000-10000 birds)', 'Enterprise (>10000 birds)'];
  const loanDurations = ['6 months', '1 year', '2 years', '3 years', '5 years', '10 years'];
  const loanPurposes = ['Farm Expansion', 'Equipment Purchase', 'Working Capital', 'Debt Refinancing', 'Infrastructure', 'Other'];
  const collateralTypes = ['Farm Property', 'Equipment', 'Personal Property', 'Inventory', 'Accounts Receivable', 'None'];

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Financial</h1>
          <p className="text-gray-500 mt-1">Manage your finances and explore financial assistance options</p>
        </motion.div>
        
        <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="assistance">Assistance</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Income
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">
                    From {transactions.filter(t => t.type === 'income').length} transactions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">
                    From {transactions.filter(t => t.type === 'expense').length} transactions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Balance
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    ₹{balance.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500">
                    As of today
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-[#ea384c]" />
                    </div>
                  ) : (
                    <div className="divide-y">
                      {transactions.length > 0 ? (
                        transactions.slice(0, 5).map(transaction => (
                          <div key={transaction.id} className="p-4 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline">{transaction.category}</Badge>
                                <span className="text-xs text-gray-500 ml-2">
                                  {new Date(transaction.transaction_date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-center text-gray-500">No transactions found</p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-2">
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('transactions')}>
                    View All Transactions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Applications</CardTitle>
                  <CardDescription>
                    Status of your loan applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-[#ea384c]" />
                    </div>
                  ) : (
                    <div className="divide-y">
                      {loans.length > 0 ? (
                        loans.slice(0, 3).map(loan => (
                          <div key={loan.id} className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">₹{Number(loan.amount).toLocaleString()} - {loan.purpose}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {loan.farm_type} Farm - {loan.duration}
                                </p>
                              </div>
                              <Badge className={getLoanStatusColor(loan.status)}>
                                <span className="flex items-center">
                                  {getLoanStatusIcon(loan.status)}
                                  <span className="ml-1 capitalize">{loan.status}</span>
                                </span>
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Applied on {new Date(loan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="p-4 text-center text-gray-500">No loan applications found</p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 border-t p-2">
                  <Button variant="ghost" className="w-full" onClick={() => setActiveTab('loans')}>
                    View All Applications
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Financial Transactions</h2>
              <Dialog open={showNewTransactionForm} onOpenChange={setShowNewTransactionForm}>
                <DialogTrigger asChild>
                  <Button>Add Transaction</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                      Record a new financial transaction for your poultry business.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-type">Transaction Type</Label>
                        <Select 
                          value={newTransaction.type} 
                          onValueChange={(value: 'income' | 'expense') => setNewTransaction({...newTransaction, type: value})}
                        >
                          <SelectTrigger id="transaction-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-category">Category</Label>
                        <Select 
                          value={newTransaction.category} 
                          onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
                        >
                          <SelectTrigger id="transaction-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {newTransaction.type === 'income' ? (
                              incomeCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))
                            ) : (
                              expenseCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-amount">Amount (₹)</Label>
                        <Input 
                          id="transaction-amount" 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={newTransaction.amount || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-date">Date</Label>
                        <Input 
                          id="transaction-date" 
                          type="date" 
                          value={newTransaction.transaction_date}
                          onChange={(e) => setNewTransaction({...newTransaction, transaction_date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="transaction-description">Description</Label>
                      <Input 
                        id="transaction-description" 
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        placeholder="Brief description of the transaction"
                      />
                    </div>
                    {newTransaction.type === 'income' && (
                      <div className="grid gap-2">
                        <Label htmlFor="transaction-customer">Customer/Source (Optional)</Label>
                        <Input 
                          id="transaction-customer" 
                          value={newTransaction.customer || ''}
                          onChange={(e) => setNewTransaction({...newTransaction, customer: e.target.value})}
                          placeholder="Who paid you"
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="transaction-notes">Additional Notes (Optional)</Label>
                      <Textarea 
                        id="transaction-notes" 
                        value={newTransaction.notes || ''}
                        onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                        placeholder="Any additional details"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewTransactionForm(false)}>Cancel</Button>
                    <Button onClick={handleAddTransaction} disabled={submitting}>
                      {submitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                      ) : (
                        <>Add Transaction</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-green-600">Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-red-600">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg text-blue-600">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View and manage your financial transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {transactions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map((transaction) => (
                              <tr key={transaction.id} className="border-t">
                                <td className="px-4 py-3 text-sm">
                                  {new Date(transaction.transaction_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium">
                                  {transaction.description}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge variant="outline">{transaction.category}</Badge>
                                </td>
                                <td className={`px-4 py-3 text-sm font-medium text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                  {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <p>No transactions found. Add your first transaction to start tracking.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Loan Applications</h2>
              <Dialog open={showNewLoanForm} onOpenChange={setShowNewLoanForm}>
                <DialogTrigger asChild>
                  <Button>Apply for Loan</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px]">
                  <DialogHeader>
                    <DialogTitle>New Loan Application</DialogTitle>
                    <DialogDescription>
                      Fill out the form to apply for a poultry business loan.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                        <Input 
                          id="loan-amount" 
                          type="number"
                          min="0"
                          value={newLoan.amount || ''}
                          onChange={(e) => setNewLoan({...newLoan, amount: parseFloat(e.target.value)})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loan-duration">Duration</Label>
                        <Select 
                          value={newLoan.duration} 
                          onValueChange={(value) => setNewLoan({...newLoan, duration: value})}
                        >
                          <SelectTrigger id="loan-duration">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {loanDurations.map(duration => (
                              <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-farm-type">Farm Type</Label>
                        <Select 
                          value={newLoan.farm_type} 
                          onValueChange={(value) => setNewLoan({...newLoan, farm_type: value})}
                        >
                          <SelectTrigger id="loan-farm-type">
                            <SelectValue placeholder="Select farm type" />
                          </SelectTrigger>
                          <SelectContent>
                            {farmTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loan-farm-size">Farm Size</Label>
                        <Select 
                          value={newLoan.farm_size} 
                          onValueChange={(value) => setNewLoan({...newLoan, farm_size: value})}
                        >
                          <SelectTrigger id="loan-farm-size">
                            <SelectValue placeholder="Select farm size" />
                          </SelectTrigger>
                          <SelectContent>
                            {farmSizes.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-purpose">Loan Purpose</Label>
                        <Select 
                          value={newLoan.purpose} 
                          onValueChange={(value) => setNewLoan({...newLoan, purpose: value})}
                        >
                          <SelectTrigger id="loan-purpose">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            {loanPurposes.map(purpose => (
                              <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loan-annual-revenue">Annual Revenue (₹)</Label>
                        <Input 
                          id="loan-annual-revenue" 
                          type="number"
                          min="0"
                          value={newLoan.annual_revenue || ''}
                          onChange={(e) => setNewLoan({...newLoan, annual_revenue: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="loan-collateral">Collateral</Label>
                        <Select 
                          value={newLoan.collateral} 
                          onValueChange={(value) => setNewLoan({...newLoan, collateral: value})}
                        >
                          <SelectTrigger id="loan-collateral">
                            <SelectValue placeholder="Select collateral" />
                          </SelectTrigger>
                          <SelectContent>
                            {collateralTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="loan-contact">Contact Number</Label>
                        <Input 
                          id="loan-contact" 
                          value={newLoan.contact_number || ''}
                          onChange={(e) => setNewLoan({...newLoan, contact_number: e.target.value})}
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="loan-existing">Existing Loans (Optional)</Label>
                      <Input 
                        id="loan-existing" 
                        value={newLoan.existing_loans || ''}
                        onChange={(e) => setNewLoan({...newLoan, existing_loans: e.target.value})}
                        placeholder="Any existing loans (amount, lender, purpose)"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="loan-additional-info">Additional Information (Optional)</Label>
                      <Textarea 
                        id="loan-additional-info" 
                        value={newLoan.additional_info || ''}
                        onChange={(e) => setNewLoan({...newLoan, additional_info: e.target.value})}
                        placeholder="Any additional information to support your application"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewLoanForm(false)}>Cancel</Button>
                    <Button onClick={handleSubmitLoanApplication} disabled={submitting}>
                      {submitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Application</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <>
                {isAdmin && (
                  <Card className="mb-6 bg-yellow-50 border-yellow-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-amber-800">
                        <BriefcaseBusiness className="h-5 w-5 mr-2" />
                        Financial Service Provider Mode
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-amber-800">
                        You are viewing this page as a financial service provider. 
                        You can review and update the status of loan applications.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <div className="grid gap-6">
                  {loans.length > 0 ? (
                    loans.map((loan) => (
                      <Card key={loan.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>₹{Number(loan.amount).toLocaleString()} Loan Application</CardTitle>
                              <CardDescription className="mt-1">
                                Purpose: {loan.purpose}
                              </CardDescription>
                            </div>
                            <Badge className={getLoanStatusColor(loan.status)}>
                              <span className="flex items-center">
                                {getLoanStatusIcon(loan.status)}
                                <span className="ml-1 capitalize">{loan.status}</span>
                              </span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-500">
                                <FileText className="h-4 w-4 mr-1" />
                                <span>Application Details</span>
                              </div>
                              <p className="font-medium">Farm Type: {loan.farm_type}</p>
                              <p className="font-medium">Farm Size: {loan.farm_size}</p>
                              <p className="font-medium">Duration: {loan.duration}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-500">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>Financial Information</span>
                              </div>
                              <p className="font-medium">Annual Revenue: ₹{Number(loan.annual_revenue).toLocaleString()}</p>
                              <p className="font-medium">Collateral: {loan.collateral}</p>
                              {loan.existing_loans && (
                                <p className="font-medium">Existing Loans: {loan.existing_loans}</p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Application Timeline</span>
                              </div>
                              <p className="font-medium">Applied: {new Date(loan.created_at).toLocaleDateString()}</p>
                              <p className="font-medium">Last Updated: {new Date(loan.updated_at).toLocaleDateString()}</p>
                              {loan.contact_number && (
                                <div className="flex items-center mt-2">
                                  <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{loan.contact_number}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {loan.additional_info && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Additional Information:</h4>
                              <p className="text-sm">{loan.additional_info}</p>
                            </div>
                          )}
                        </CardContent>
                        {isAdmin && (
                          <CardFooter className="flex justify-end gap-2 bg-gray-50 border-t">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                              onClick={() => updateLoanStatus(loan.id, 'reviewing')}
                            >
                              Mark as Reviewing
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => updateLoanStatus(loan.id, 'rejected')}
                            >
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => updateLoanStatus(loan.id, 'approved')}
                            >
                              Approve
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-gray-50 border-dashed">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                          <FileText className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Loan Applications</h3>
                        <p className="text-gray-500 text-center mb-4">
                          You haven't applied for any loans yet. Apply now to get financial support for your poultry business.
                        </p>
                        <Button onClick={() => setShowNewLoanForm(true)}>Apply for Loan</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Financial Assistance Tab */}
          <TabsContent value="assistance" className="mt-4">
            <FinancialAssistance isAdmin={isAdmin} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Financial;

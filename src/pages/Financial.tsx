
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Calendar, 
  Plus, 
  FileText,
  BanknoteIcon,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, LoanApplication } from '@/types/financial';

const Financial: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // New transaction dialog state
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionCustomer, setTransactionCustomer] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  
  // New loan application dialog state
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [farmType, setFarmType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [collateral, setCollateral] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [existingLoans, setExistingLoans] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Loan status dialog
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [newStatus, setNewStatus] = useState<"pending" | "approved" | "rejected" | "reviewing">("pending");
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchLoanApplications();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Type assertion to ensure data matches our Transaction type
      const typedData = data as Transaction[];
      setTransactions(typedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        variant: "destructive",
        title: "Error fetching transactions",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanApplications = async () => {
    try {
      setLoading(true);
      let query = supabase.from('loan_applications').select('*');
      
      // If not admin, only fetch user's own applications
      if (!isAdmin) {
        query = query.eq('user_id', user?.id);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Type assertion to ensure data matches our LoanApplication type
      const typedData = data as LoanApplication[];
      setLoans(typedData);
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      toast({
        variant: "destructive",
        title: "Error fetching loan applications",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddLoan = async () => {
    if (!user) return;
    
    try {
      const loan: LoanApplication = {
        user_id: user.id,
        amount: Number(loanAmount),
        purpose: loanPurpose,
        duration: loanDuration,
        farm_type: farmType,
        farm_size: farmSize,
        annual_revenue: Number(annualRevenue),
        collateral: collateral,
        status: "pending",
        contact_number: contactNumber,
        existing_loans: existingLoans,
        additional_info: additionalInfo
      };
      
      const { data, error } = await supabase
        .from('loan_applications')
        .insert(loan);
      
      if (error) throw error;
      
      toast({
        title: "Loan application submitted",
        description: "We'll review your application and get back to you soon."
      });
      
      setShowLoanDialog(false);
      fetchLoanApplications();
      
      // Reset form
      setLoanAmount('');
      setLoanPurpose('');
      setLoanDuration('');
      setFarmType('');
      setFarmSize('');
      setAnnualRevenue('');
      setCollateral('');
      setContactNumber('');
      setExistingLoans('');
      setAdditionalInfo('');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast({
        variant: "destructive",
        title: "Error submitting loan application",
        description: "Please try again later."
      });
    }
  };

  const handleAddTransaction = async () => {
    if (!user) return;
    
    if (!transactionAmount || !transactionCategory || !transactionDescription || !transactionDate) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    try {
      const transaction: Transaction = {
        user_id: user.id,
        type: transactionType,
        category: transactionCategory,
        amount: Number(transactionAmount),
        description: transactionDescription,
        transaction_date: transactionDate,
        customer: transactionCustomer,
        notes: transactionNotes
      };
      
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transaction);
      
      if (error) throw error;
      
      toast({
        title: "Transaction recorded",
        description: "Your transaction has been successfully recorded."
      });
      
      setShowTransactionDialog(false);
      fetchTransactions();
      
      // Reset form
      setTransactionType('income');
      setTransactionCategory('');
      setTransactionAmount('');
      setTransactionDescription('');
      setTransactionDate('');
      setTransactionCustomer('');
      setTransactionNotes('');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        variant: "destructive",
        title: "Error adding transaction",
        description: "Please try again later."
      });
    }
  };
  
  const handleUpdateLoanStatus = async () => {
    if (!selectedLoan) return;
    
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update({ status: newStatus })
        .eq('id', selectedLoan.id);
      
      if (error) throw error;
      
      toast({
        title: "Loan status updated",
        description: `The loan application status has been updated to ${newStatus}.`
      });
      
      setShowStatusDialog(false);
      fetchLoanApplications();
    } catch (error) {
      console.error('Error updating loan status:', error);
      toast({
        variant: "destructive",
        title: "Error updating loan status",
        description: "Please try again later."
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const calculateTotalByType = (type: 'income' | 'expense') => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const totalIncome = calculateTotalByType('income');
  const totalExpense = calculateTotalByType('expense');
  const balance = totalIncome - totalExpense;
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    let matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = transaction.transaction_date === today;
    } else if (dateFilter === 'thisWeek') {
      const today = new Date();
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const transactionDate = new Date(transaction.transaction_date);
      matchesDate = transactionDate >= oneWeekAgo && transactionDate <= today;
    } else if (dateFilter === 'thisMonth') {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const transactionDate = new Date(transaction.transaction_date);
      matchesDate = transactionDate >= firstDayOfMonth && transactionDate <= today;
    }
    
    return matchesCategory && matchesDate;
  });
  
  // Get unique categories for filter
  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Financial Services</h1>
              <p className="text-gray-600 mt-2">Track your finances and apply for financial assistance tailored for poultry farmers</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => setShowTransactionDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Record Transaction
              </Button>
              <Button 
                className="bg-[#ea384c] hover:bg-[#d02f3d] text-white"
                onClick={() => setShowLoanDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" /> Apply for Loan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Financial Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Income</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{totalIncome.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-rose-50 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{totalExpense.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <ArrowDownRight className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Balance</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{balance.toLocaleString()}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="transactions">Financial Tracker</TabsTrigger>
            <TabsTrigger value="loans">Loan Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="thisMonth">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArrowRightLeft className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No transactions found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    {transactions.length === 0 
                      ? "You haven't recorded any transactions yet. Start tracking your income and expenses."
                      : "No transactions match your current filters. Try changing your filter criteria."}
                  </p>
                  {transactions.length === 0 && (
                    <Button 
                      className="mt-4 bg-[#ea384c] hover:bg-[#d02f3d]"
                      onClick={() => setShowTransactionDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add First Transaction
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {new Date(transaction.transaction_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    transaction.type === 'income' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {transaction.category}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600 max-w-[300px] truncate">
                                  {transaction.description}
                                </td>
                                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${
                                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="loans" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-semibold">Loan Applications</h2>
                  <p className="text-gray-500 text-sm mt-1">Track your loan applications and their status</p>
                </div>
                <Button 
                  onClick={() => setShowLoanDialog(true)}
                  className="bg-[#ea384c] hover:bg-[#d02f3d] mt-3 md:mt-0"
                >
                  <Plus className="h-4 w-4 mr-2" /> Apply for Loan
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading loan applications...</p>
                </div>
              ) : loans.length === 0 ? (
                <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BanknoteIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No loan applications</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    You haven't applied for any loans yet. Apply for financial assistance tailored for poultry farmers.
                  </p>
                  <Button 
                    className="mt-4 bg-[#ea384c] hover:bg-[#d02f3d]"
                    onClick={() => setShowLoanDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" /> Apply Now
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {loans.map((loan) => (
                    <Card key={loan.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">₹{loan.amount.toLocaleString()}</CardTitle>
                            <CardDescription>
                              Applied on {new Date(loan.created_at || '').toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="text-xs text-gray-500">Purpose</p>
                              <p className="text-sm font-medium">{loan.purpose}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Duration</p>
                              <p className="text-sm font-medium">{loan.duration}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Farm Type</p>
                              <p className="text-sm font-medium">{loan.farm_type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Farm Size</p>
                              <p className="text-sm font-medium">{loan.farm_size}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between bg-gray-50 border-t border-gray-100 pt-3 pb-3">
                        <p className="text-xs text-gray-500">ID: {loan.id}</p>
                        
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setNewStatus(loan.status);
                              setShowStatusDialog(true);
                            }}
                          >
                            Update Status
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </motion.div>
              )}
              
              {/* Financial Institution Offerings for Users */}
              {!isAdmin && (
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4">Financial Institutions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                          alt="Agricultural Bank of India" 
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-5">
                          <h4 className="font-semibold mb-1">Agricultural Bank of India</h4>
                          <p className="text-sm text-gray-600 mb-2">Special loans for poultry farmers at 4% interest</p>
                          <div className="flex items-center text-[#ea384c] text-sm font-medium mt-2">
                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                          alt="Rural Finance Corporation" 
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-5">
                          <h4 className="font-semibold mb-1">Rural Finance Corporation</h4>
                          <p className="text-sm text-gray-600 mb-2">Equipment financing with flexible repayment options</p>
                          <div className="flex items-center text-[#ea384c] text-sm font-medium mt-2">
                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <img 
                          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                          alt="Poultry Development Fund" 
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-5">
                          <h4 className="font-semibold mb-1">Poultry Development Fund</h4>
                          <p className="text-sm text-gray-600 mb-2">Government-backed subsidies and grants for expansion</p>
                          <div className="flex items-center text-[#ea384c] text-sm font-medium mt-2">
                            Learn More <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Record New Transaction</DialogTitle>
            <DialogDescription>
              Keep track of your income and expenses related to your poultry business.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={(value: 'income' | 'expense') => setTransactionType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-category">Category</Label>
                <Select value={transactionCategory} onValueChange={setTransactionCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionType === 'income' ? (
                      <>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Subsidy">Subsidy</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Other Income">Other Income</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Feed">Feed</SelectItem>
                        <SelectItem value="Medicine">Medicine</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Other Expense">Other Expense</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-amount">Amount (₹)</Label>
                <Input 
                  id="transaction-amount"
                  placeholder="Enter amount"
                  type="number"
                  min="0"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-date">Date</Label>
                <Input 
                  id="transaction-date"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-description">Description</Label>
              <Textarea 
                id="transaction-description"
                placeholder="Brief description of the transaction"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-customer">Customer/Vendor (Optional)</Label>
              <Input 
                id="transaction-customer"
                placeholder="Name of customer or vendor"
                value={transactionCustomer}
                onChange={(e) => setTransactionCustomer(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction-notes">Notes (Optional)</Label>
              <Textarea 
                id="transaction-notes"
                placeholder="Additional notes or details"
                value={transactionNotes}
                onChange={(e) => setTransactionNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransactionDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Apply for Loan Dialog */}
      <Dialog open={showLoanDialog} onOpenChange={setShowLoanDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for Financial Assistance</DialogTitle>
            <DialogDescription>
              Fill out the form below to apply for a loan or financial assistance for your poultry business.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
              <Input 
                id="loan-amount"
                placeholder="Enter amount required"
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-purpose">Loan Purpose</Label>
              <Select value={loanPurpose} onValueChange={setLoanPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farm Expansion">Farm Expansion</SelectItem>
                  <SelectItem value="Equipment Purchase">Equipment Purchase</SelectItem>
                  <SelectItem value="Working Capital">Working Capital</SelectItem>
                  <SelectItem value="Feed Purchase">Feed Purchase</SelectItem>
                  <SelectItem value="Infrastructure Development">Infrastructure Development</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="loan-duration">Loan Duration</Label>
              <Select value={loanDuration} onValueChange={setLoanDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                  <SelectItem value="10 Years">10 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <h3 className="text-base font-medium">Farm Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farm-type">Farm Type</Label>
                <Select value={farmType} onValueChange={setFarmType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Layer Farm">Layer Farm</SelectItem>
                    <SelectItem value="Broiler Farm">Broiler Farm</SelectItem>
                    <SelectItem value="Breeding Farm">Breeding Farm</SelectItem>
                    <SelectItem value="Hatchery">Hatchery</SelectItem>
                    <SelectItem value="Mixed Farm">Mixed Farm</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="farm-size">Farm Size</Label>
                <Select value={farmSize} onValueChange={setFarmSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small (<5,000 birds)">Small (&lt;5,000 birds)</SelectItem>
                    <SelectItem value="Medium (5,000-20,000 birds)">Medium (5,000-20,000 birds)</SelectItem>
                    <SelectItem value="Large (20,000-50,000 birds)">Large (20,000-50,000 birds)</SelectItem>
                    <SelectItem value="Very Large (>50,000 birds)">Very Large (&gt;50,000 birds)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annual-revenue">Annual Revenue (₹)</Label>
              <Input 
                id="annual-revenue"
                placeholder="Approximate annual revenue"
                type="number"
                min="0"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
              />
            </div>
            
            <Separator />
            
            <h3 className="text-base font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input 
                id="contact-number"
                placeholder="Your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collateral">Collateral Available</Label>
              <Select value={collateral} onValueChange={setCollateral}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collateral type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Land Property">Land Property</SelectItem>
                  <SelectItem value="Farm Equipment">Farm Equipment</SelectItem>
                  <SelectItem value="Livestock">Livestock</SelectItem>
                  <SelectItem value="Fixed Deposits">Fixed Deposits</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="existing-loans">Existing Loans (Optional)</Label>
              <Textarea 
                id="existing-loans"
                placeholder="Details of any existing loans"
                value={existingLoans}
                onChange={(e) => setExistingLoans(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional-info">Additional Information (Optional)</Label>
              <Textarea 
                id="additional-info"
                placeholder="Any other information that might help with your application"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoanDialog(false)}>Cancel</Button>
            <Button onClick={handleAddLoan} className="bg-[#ea384c] hover:bg-[#d02f3d]">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Loan Status Dialog (Admin Only) */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Loan Status</DialogTitle>
            <DialogDescription>
              Change the status of this loan application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="loan-status">Loan Status</Label>
              <Select value={newStatus} onValueChange={(value: "pending" | "approved" | "rejected" | "reviewing") => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateLoanStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Financial;

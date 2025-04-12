
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FinancialAssistance from '@/components/modules/FinancialAssistance';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  Calculator,
  CreditCard,
  FileText,
  IndianRupee,
  Landmark,
  BarChart4,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  AlertCircle,
  FileSpreadsheet,
  FileHeart,
  Search,
  Wallet,
  PiggyBank,
  TrendingUp,
  Banknote,
  Building2,
  CircleDollarSign,
  Package
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Revenue data for charts
const revenueData = [
  { month: 'Jan', eggs: 25000, meat: 35000, totalCosts: 30000 },
  { month: 'Feb', eggs: 28000, meat: 32000, totalCosts: 28000 },
  { month: 'Mar', eggs: 26000, meat: 34000, totalCosts: 29000 },
  { month: 'Apr', eggs: 29000, meat: 38000, totalCosts: 31000 },
  { month: 'May', eggs: 33000, meat: 36000, totalCosts: 32000 },
  { month: 'Jun', eggs: 37000, meat: 39000, totalCosts: 33000 },
];

// Expense breakdown data
const expenseData = [
  { name: 'Feed', value: 55 },
  { name: 'Labor', value: 15 },
  { name: 'Utilities', value: 10 },
  { name: 'Healthcare', value: 8 },
  { name: 'Equipment', value: 7 },
  { name: 'Other', value: 5 },
];

// Cost per unit data
const costPerUnitData = [
  { name: 'Jan', eggCost: 4.2, chickenCost: 85 },
  { name: 'Feb', eggCost: 4.3, chickenCost: 87 },
  { name: 'Mar', eggCost: 4.1, chickenCost: 86 },
  { name: 'Apr', eggCost: 4.0, chickenCost: 88 },
  { name: 'May', eggCost: 4.2, chickenCost: 90 },
  { name: 'Jun', eggCost: 4.3, chickenCost: 92 },
];

// Colors for charts
const COLORS = ['#0FA0CE', '#8ED1FC', '#FF8A65', '#EA384C', '#7986CB', '#9CCC65'];

// Recent transactions data
const transactions = [
  {
    id: 1, 
    description: 'Feed purchase - Layer Feed',
    amount: -25000,
    date: new Date(2025, 3, 10),
    category: 'Feed',
    status: 'completed'
  },
  {
    id: 2, 
    description: 'Egg sales - Local distributor',
    amount: 42500,
    date: new Date(2025, 3, 9),
    category: 'Sales',
    status: 'completed'
  },
  {
    id: 3, 
    description: 'Equipment maintenance',
    amount: -8500,
    date: new Date(2025, 3, 7),
    category: 'Maintenance',
    status: 'completed'
  },
  {
    id: 4, 
    description: 'Broiler sales - Restaurant chain',
    amount: 38000,
    date: new Date(2025, 3, 5),
    category: 'Sales',
    status: 'completed'
  },
  {
    id: 5, 
    description: 'Vaccine purchase',
    amount: -12000,
    date: new Date(2025, 3, 3),
    category: 'Healthcare',
    status: 'completed'
  },
];

// Current loans data
const loans = [
  {
    id: 1,
    lender: 'Agricultural Bank of India',
    purpose: 'Farm Expansion',
    amount: 500000,
    remainingAmount: 350000,
    interestRate: 7.5,
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2029, 6, 15),
    status: 'active'
  },
  {
    id: 2,
    lender: 'Rural Finance Corporation',
    purpose: 'Equipment Purchase',
    amount: 250000,
    remainingAmount: 100000,
    interestRate: 8.0,
    startDate: new Date(2023, 3, 10),
    endDate: new Date(2026, 3, 10),
    status: 'active'
  }
];

// Form schemas
const expenseFormSchema = z.object({
  description: z.string().min(3, "Description is required"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string(),
  date: z.string(),
  notes: z.string().optional(),
});

const incomeFormSchema = z.object({
  description: z.string().min(3, "Description is required"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string(),
  date: z.string(),
  customer: z.string().optional(),
  notes: z.string().optional(),
});

const loanApplicationSchema = z.object({
  purpose: z.string().min(5, "Purpose is required"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  duration: z.string(),
  farmSize: z.string(),
  farmType: z.string(),
  collateral: z.string(),
  existingLoans: z.string().optional(),
  annualRevenue: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Annual revenue must be a positive number",
  }),
  contactNumber: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const Financial: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  
  // Forms
  const expenseForm = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "feed",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });
  
  const incomeForm = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "egg_sales",
      date: new Date().toISOString().split('T')[0],
      customer: "",
      notes: "",
    },
  });
  
  const loanForm = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      purpose: "",
      amount: "",
      duration: "3_years",
      farmSize: "medium",
      farmType: "layer",
      collateral: "property",
      existingLoans: "",
      annualRevenue: "",
      contactNumber: "",
      additionalInfo: "",
    },
  });
  
  // Submit expense
  const onSubmitExpense = async (values: z.infer<typeof expenseFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to record expenses",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Here you would save to database in a real implementation
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user.id,
          description: values.description,
          amount: -Math.abs(Number(values.amount)),
          category: values.category,
          transaction_date: values.date,
          notes: values.notes,
          type: 'expense',
        });
        
      if (error) throw error;
      
      toast({
        title: "Expense recorded",
        description: `₹${values.amount} has been recorded as an expense.`,
      });
      
      // Reset form and close dialog
      expenseForm.reset();
      setExpenseDialogOpen(false);
    } catch (error) {
      console.error('Error recording expense:', error);
      toast({
        title: "Failed to record expense",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Submit income
  const onSubmitIncome = async (values: z.infer<typeof incomeFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to record income",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Here you would save to database in a real implementation
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user.id,
          description: values.description,
          amount: Math.abs(Number(values.amount)),
          category: values.category,
          transaction_date: values.date,
          customer: values.customer,
          notes: values.notes,
          type: 'income',
        });
        
      if (error) throw error;
      
      toast({
        title: "Income recorded",
        description: `₹${values.amount} has been recorded as income.`,
      });
      
      // Reset form and close dialog
      incomeForm.reset();
      setIncomeDialogOpen(false);
    } catch (error) {
      console.error('Error recording income:', error);
      toast({
        title: "Failed to record income",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Submit loan application
  const onSubmitLoanApplication = async (values: z.infer<typeof loanApplicationSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for a loan",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Here you would save to database in a real implementation
      const { error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: user.id,
          purpose: values.purpose,
          amount: Number(values.amount),
          duration: values.duration,
          farm_size: values.farmSize,
          farm_type: values.farmType,
          collateral: values.collateral,
          existing_loans: values.existingLoans,
          annual_revenue: Number(values.annualRevenue),
          contact_number: values.contactNumber,
          additional_info: values.additionalInfo,
          status: 'pending',
        });
        
      if (error) throw error;
      
      toast({
        title: "Loan application submitted",
        description: "Your loan application has been submitted successfully.",
      });
      
      // Reset form and close dialog
      loanForm.reset();
      setLoanDialogOpen(false);
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast({
        title: "Failed to submit application",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-gray-500 mt-1">Track your farm finances, access loans, and monitor performance</p>
        </motion.div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="dashboard">Financial Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions & Records</TabsTrigger>
            <TabsTrigger value="loans">Loans & Assistance</TabsTrigger>
          </TabsList>
          
          {/* Financial Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                      <div className="text-2xl font-bold">₹73,000</div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>+8.2%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Compared to last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Monthly Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                      <div className="text-2xl font-bold">₹33,000</div>
                    </div>
                    <div className="flex items-center text-red-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>+3.5%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Compared to last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-gray-500 mr-2" />
                      <div className="text-2xl font-bold">₹40,000</div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>+12.3%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Compared to last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">54.8%</div>
                    <div className="flex items-center text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>+2.1%</span>
                    </div>
                  </div>
                  <Progress value={54.8} className="h-2 mt-2" />
                  <p className="text-xs text-gray-500 mt-2">Compared to last month</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue & Cost Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2 text-gray-500" />
                    Revenue vs. Costs
                  </CardTitle>
                  <CardDescription>Monthly comparison of revenue streams and total costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, '']} />
                        <Legend />
                        <Bar dataKey="eggs" name="Egg Sales" stackId="a" fill="#0FA0CE" />
                        <Bar dataKey="meat" name="Meat Sales" stackId="a" fill="#EA384C" />
                        <Bar dataKey="totalCosts" name="Total Costs" fill="#9CCC65" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <PiggyBank className="h-5 w-5 mr-2 text-gray-500" />
                    Expense Breakdown
                  </CardTitle>
                  <CardDescription>Where your money is being spent</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                    {expenseData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-xs">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Cost Per Unit Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                  Cost Per Unit Trend
                </CardTitle>
                <CardDescription>Production cost per egg and chicken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={costPerUnitData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#0FA0CE" />
                      <YAxis yAxisId="right" orientation="right" stroke="#EA384C" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="eggCost" 
                        name="Cost per Egg (₹)" 
                        stroke="#0FA0CE" 
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="chickenCost" 
                        name="Cost per Chicken (₹)" 
                        stroke="#EA384C" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Financial Health & Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-gray-500" />
                  Financial Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg flex">
                    <ArrowUp className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-800">Positive cash flow trend</h4>
                      <p className="text-sm text-green-700">Your operation has maintained positive cash flow for 6 consecutive months.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg flex">
                    <Wallet className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">Optimization opportunity</h4>
                      <p className="text-sm text-blue-700">Feed costs are 5% higher than industry average. Consider bulk purchasing to reduce costs.</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 rounded-lg flex">
                    <Banknote className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800">Price fluctuation alert</h4>
                      <p className="text-sm text-amber-700">Local egg prices have decreased by 3% in the last month. Consider adjusting production or seeking new markets.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" className="flex gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Download Financial Report
                </Button>
                <Button className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90 flex gap-2">
                  <Calculator className="h-4 w-4" />
                  Financial Calculator
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Transactions & Records Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-9 max-w-md"
                />
              </div>
              <div className="flex gap-3">
                <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Record Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Record an Expense</DialogTitle>
                      <DialogDescription>
                        Enter the details of your expense for financial tracking.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...expenseForm}>
                      <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-4">
                        <FormField
                          control={expenseForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="What was this expense for?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={expenseForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input placeholder="0.00" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={expenseForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="feed">Feed</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="labor">Labor</SelectItem>
                                    <SelectItem value="equipment">Equipment</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="transport">Transport</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={expenseForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={expenseForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any additional information..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setExpenseDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          >
                            Save Expense
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90 flex gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Record Income
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Record Income</DialogTitle>
                      <DialogDescription>
                        Enter the details of your income for financial tracking.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...incomeForm}>
                      <form onSubmit={incomeForm.handleSubmit(onSubmitIncome)} className="space-y-4">
                        <FormField
                          control={incomeForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="What was this income for?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={incomeForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input placeholder="0.00" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={incomeForm.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="egg_sales">Egg Sales</SelectItem>
                                    <SelectItem value="meat_sales">Meat Sales</SelectItem>
                                    <SelectItem value="chick_sales">Chick Sales</SelectItem>
                                    <SelectItem value="manure_sales">Manure Sales</SelectItem>
                                    <SelectItem value="subsidy">Subsidy/Grant</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={incomeForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={incomeForm.control}
                            name="customer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Customer/Source (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Who paid you?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={incomeForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Any additional information..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIncomeDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          >
                            Save Income
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-500" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
                        <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-center font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="bg-white">
                          <td className="px-4 py-3">{transaction.description}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{transaction.category}</Badge>
                          </td>
                          <td className={`px-4 py-3 text-right font-medium ${
                            transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.amount < 0 ? '-' : '+'} ₹{Math.abs(transaction.amount).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center">
                              <Badge 
                                className={
                                  transaction.status === 'completed' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                    : transaction.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline">View All Transactions</Button>
                <Button variant="outline" className="flex gap-2">
                  <FileHeart className="h-4 w-4" />
                  Export Financial Records
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
                    Recurring Expenses
                  </CardTitle>
                  <CardDescription>Regular payments tracked automatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-medium">Feed Supplier - Premium Feed</h4>
                        <p className="text-sm text-gray-500">Monthly subscription</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">₹25,000</p>
                        <p className="text-xs text-gray-500">Next: May 1, 2025</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-medium">Farm Insurance</h4>
                        <p className="text-sm text-gray-500">Quarterly payment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">₹15,000</p>
                        <p className="text-xs text-gray-500">Next: Jun 15, 2025</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <h4 className="font-medium">Farm Workers Salary</h4>
                        <p className="text-sm text-gray-500">Monthly payment</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">₹18,000</p>
                        <p className="text-xs text-gray-500">Next: May 1, 2025</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Equipment Maintenance</h4>
                        <p className="text-sm text-gray-500">Bi-monthly service</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">₹8,000</p>
                        <p className="text-xs text-gray-500">Next: May 20, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">Manage Recurring Expenses</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <IndianRupee className="h-5 w-5 mr-2 text-gray-500" />
                    Tax Planning
                  </CardTitle>
                  <CardDescription>Manage your farm tax information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-1">FY 2024-25 Tax Preparation</h4>
                      <p className="text-sm text-amber-700 mb-2">Your estimated tax liability based on current income and expenses.</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Tax Liability:</span>
                        <span className="font-medium">₹85,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax Paid/Withheld:</span>
                        <span className="font-medium">₹45,000</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2 pt-2 border-t border-amber-200">
                        <span className="text-gray-600 font-medium">Remaining Due:</span>
                        <span className="font-medium">₹40,000</span>
                      </div>
                      <p className="text-xs text-amber-700 mt-2">Next filing deadline: July 31, 2025</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Tax Deductions Available</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span>Agricultural equipment depreciation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span>Farm vehicle expenses</span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span>Livestock feed and healthcare costs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                          <span>Farm insurance premiums</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Tax Calculator</Button>
                  <Button variant="outline">Download Tax Forms</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Loans & Assistance Tab */}
          <TabsContent value="loans" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-gray-500" />
                    Current Loans
                  </CardTitle>
                  <CardDescription>Manage your active loans and repayments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loans.length > 0 ? (
                    <div className="space-y-5">
                      {loans.map((loan) => (
                        <div key={loan.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{loan.purpose}</h4>
                              <p className="text-sm text-gray-500">{loan.lender}</p>
                            </div>
                            <Badge 
                              className={
                                loan.status === 'active' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              }
                            >
                              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                            <div>
                              <p className="text-gray-500">Loan Amount</p>
                              <p className="font-medium">₹{loan.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Remaining</p>
                              <p className="font-medium">₹{loan.remainingAmount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Interest Rate</p>
                              <p className="font-medium">{loan.interestRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">{loan.endDate.toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Repayment Progress</span>
                              <span>{Math.round((1 - loan.remainingAmount/loan.amount) * 100)}%</span>
                            </div>
                            <Progress value={Math.round((1 - loan.remainingAmount/loan.amount) * 100)} className="h-2" />
                          </div>
                          
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="outline" size="sm">Make Payment</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No active loans</h3>
                      <p className="text-gray-500 mb-4">You don't have any active loans at the moment.</p>
                      <Button onClick={() => setLoanDialogOpen(true)} className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90">
                        Apply for a Loan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CircleDollarSign className="h-5 w-5 mr-2 text-gray-500" />
                    Loan Eligibility
                  </CardTitle>
                  <CardDescription>Check your eligibility for loans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-green-50">
                      <h4 className="font-medium text-green-800 mb-2">Farm Development Loan</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Eligibility Score:</span>
                        <span className="font-medium text-green-700">85/100</span>
                      </div>
                      <Progress value={85} className="h-2 bg-green-200" />
                      <p className="text-xs text-green-700 mt-2">You qualify for up to ₹10,00,000</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-amber-50">
                      <h4 className="font-medium text-amber-800 mb-2">Equipment Financing</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Eligibility Score:</span>
                        <span className="font-medium text-amber-700">70/100</span>
                      </div>
                      <Progress value={70} className="h-2 bg-amber-200" />
                      <p className="text-xs text-amber-700 mt-2">You qualify for up to ₹5,00,000</p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-blue-50">
                      <h4 className="font-medium text-blue-800 mb-2">Working Capital Loan</h4>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Eligibility Score:</span>
                        <span className="font-medium text-blue-700">78/100</span>
                      </div>
                      <Progress value={78} className="h-2 bg-blue-200" />
                      <p className="text-xs text-blue-700 mt-2">You qualify for up to ₹3,50,000</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Dialog open={loanDialogOpen} onOpenChange={setLoanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90">
                        Apply for a Loan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Loan Application</DialogTitle>
                        <DialogDescription>
                          Fill out this form to apply for a loan. Our team will review your application.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...loanForm}>
                        <form onSubmit={loanForm.handleSubmit(onSubmitLoanApplication)} className="space-y-4">
                          <FormField
                            control={loanForm.control}
                            name="purpose"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Loan Purpose</FormLabel>
                                <FormControl>
                                  <Input placeholder="What will this loan be used for?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={loanForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Loan Amount (₹)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="0.00" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loanForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Loan Duration</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="1_year">1 year</SelectItem>
                                      <SelectItem value="3_years">3 years</SelectItem>
                                      <SelectItem value="5_years">5 years</SelectItem>
                                      <SelectItem value="10_years">10 years</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={loanForm.control}
                              name="farmSize"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Farm Size</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select size" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="small">Small (< 5,000 birds)</SelectItem>
                                      <SelectItem value="medium">Medium (5,000-10,000 birds)</SelectItem>
                                      <SelectItem value="large">Large (> 10,000 birds)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loanForm.control}
                              name="farmType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Farm Type</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="layer">Layer</SelectItem>
                                      <SelectItem value="broiler">Broiler</SelectItem>
                                      <SelectItem value="integrated">Integrated</SelectItem>
                                      <SelectItem value="hatchery">Hatchery</SelectItem>
                                      <SelectItem value="breeding">Breeding</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={loanForm.control}
                            name="collateral"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Collateral Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select collateral" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="property">Property/Land</SelectItem>
                                    <SelectItem value="equipment">Farm Equipment</SelectItem>
                                    <SelectItem value="livestock">Livestock</SelectItem>
                                    <SelectItem value="vehicle">Farm Vehicle</SelectItem>
                                    <SelectItem value="none">No Collateral</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loanForm.control}
                            name="existingLoans"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Existing Loans (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="List any existing loans with amounts and lenders..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loanForm.control}
                            name="annualRevenue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Annual Farm Revenue (₹)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loanForm.control}
                            name="contactNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 9876543210" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={loanForm.control}
                            name="additionalInfo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Information (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Any other details that may support your application..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setLoanDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                            >
                              Submit Application
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Package className="h-5 w-5 mr-2 text-gray-500" />
                  Available Financial Assistance Programs
                </CardTitle>
                <CardDescription>Government schemes and other assistance programs for poultry farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <FinancialAssistance />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// CheckIcon component for the checkmarks
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Financial;

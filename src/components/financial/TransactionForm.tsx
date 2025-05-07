
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { format } from 'date-fns';

const TransactionForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { addTransaction } = useFinancial();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    customer: '',
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.description || !formData.transaction_date) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await addTransaction({
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        transaction_date: formData.transaction_date,
        customer: formData.customer || undefined,
        notes: formData.notes || undefined
      });
      
      if (success) {
        setFormData({
          type: 'income',
          category: '',
          amount: '',
          description: '',
          transaction_date: format(new Date(), 'yyyy-MM-dd'),
          customer: '',
          notes: ''
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const incomeCategories = [
    'Sales', 'Investment', 'Subsidy', 'Loan', 'Refund', 'Other'
  ];
  
  const expenseCategories = [
    'Feed', 'Medication', 'Equipment', 'Utilities', 'Labor', 'Rent', 
    'Transportation', 'Marketing', 'Insurance', 'Taxes', 'Loan Payment', 'Other'
  ];
  
  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Financial Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Transaction Date</Label>
              <Input
                id="transaction_date"
                name="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          {formData.type === 'income' && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer/Source</Label>
              <Input
                id="customer"
                name="customer"
                placeholder="Enter customer or income source"
                value={formData.customer}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any additional notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#f5565c] hover:bg-[#e4484e]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Record Transaction'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;

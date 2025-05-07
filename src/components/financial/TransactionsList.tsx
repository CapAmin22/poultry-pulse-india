
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, DollarSign, ArrowDown, ArrowUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Transaction } from '@/types/financial';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg mb-2 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${
          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {transaction.type === 'income' ? (
            <ArrowUp className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-sm text-gray-600">{transaction.category} • {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</p>
          {transaction.customer && <p className="text-xs text-gray-500">Source: {transaction.customer}</p>}
        </div>
      </div>
      <div className={`text-right ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}>
        <p className="font-bold">₹{transaction.amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customer && transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transactions</CardTitle>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center" onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <div>
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No transactions found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || typeFilter !== 'all' 
                ? "Try changing your search filters" 
                : "Start by adding your income and expenses"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;

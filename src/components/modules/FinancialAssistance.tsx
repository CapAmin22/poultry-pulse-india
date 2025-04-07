
import React from 'react';
import { Database, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LoanScheme {
  id: number;
  title: string;
  provider: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  eligibility: string;
  tags: string[];
}

const loanSchemes: LoanScheme[] = [
  {
    id: 1,
    title: 'Poultry Farm Development Loan',
    provider: 'National Bank for Agriculture and Rural Development (NABARD)',
    interestRate: '7-9%',
    maxAmount: '₹50 Lakhs',
    tenure: 'Up to 7 years',
    eligibility: 'Small and medium poultry farmers with at least 2 years of experience',
    tags: ['Subsidy Available', 'Collateral Required']
  },
  {
    id: 2,
    title: 'MUDRA Loan for Poultry Business',
    provider: 'State Bank of India',
    interestRate: '8-11%',
    maxAmount: '₹10 Lakhs',
    tenure: 'Up to 5 years',
    eligibility: 'Small poultry businesses with annual turnover less than ₹5 crore',
    tags: ['No Collateral', 'Quick Approval']
  },
  {
    id: 3,
    title: 'Animal Husbandry Infrastructure Development Fund',
    provider: 'Ministry of Fisheries, Animal Husbandry and Dairying',
    interestRate: '6-8%',
    maxAmount: '₹2 Crore',
    tenure: 'Up to 10 years',
    eligibility: 'Established poultry businesses looking to upgrade infrastructure',
    tags: ['Government Scheme', '3% Interest Subvention']
  },
];

const FinancialAssistance: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Database className="h-5 w-5 mr-2 text-poultry-primary" />
            <span>Financial Assistance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-6">
            Access poultry-specific loan products, financial assistance schemes, and subsidy programs from banks, NBFCs, and government initiatives.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search loan schemes..." className="pl-8" />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
            </Button>
          </div>
          
          <div className="space-y-4">
            {loanSchemes.map((scheme) => (
              <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:border-poultry-primary transition-colors">
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-poultry-primary">{scheme.title}</h3>
                    <p className="text-sm text-gray-600">{scheme.provider}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scheme.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="text-sm font-medium">{scheme.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Maximum Amount</p>
                    <p className="text-sm font-medium">{scheme.maxAmount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tenure</p>
                    <p className="text-sm font-medium">{scheme.tenure}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500">Eligibility</p>
                  <p className="text-sm">{scheme.eligibility}</p>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="default" size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAssistance;

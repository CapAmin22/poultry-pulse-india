
import React, { useState } from 'react';
import { Database, Filter, Search } from 'lucide-react';
import FinancialServiceCard from './FinancialServiceCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FinancialService {
  id: string;
  title: string;
  provider: string;
  interestRate?: string;
  maxAmount?: string;
  tenure?: string;
  eligibility: string;
  tags: string[];
}

interface FinancialServiceListProps {
  services: FinancialService[];
  loading: boolean;
  userRole?: string;
  onEdit?: (id: string) => void;
  onApply?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FinancialServiceList: React.FC<FinancialServiceListProps> = ({
  services,
  loading,
  userRole,
  onEdit,
  onApply,
  onDelete
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Get unique categories from services
  const categories = Array.from(new Set(services.flatMap(service => service.tags)))
    .filter(Boolean)
    .sort();
  
  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = searchQuery.trim() === '' || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
      (service.tags && service.tags.includes(categoryFilter));
    
    return matchesSearch && matchesCategory;
  });
  
  const handleApply = (id: string) => {
    if (!onApply) return;
    
    try {
      onApply(id);
      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application failed",
        description: "There was an error submitting your application.",
      });
    }
  };
  
  const handleDelete = (id: string) => {
    if (!onDelete) return;
    
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        onDelete(id);
        toast({
          title: "Service deleted",
          description: "The financial service has been removed successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Deletion failed",
          description: "There was an error deleting the service.",
        });
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }
  
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No financial services found</h3>
        <p className="mt-1 text-gray-500">
          {userRole === 'financial' 
            ? 'You have not added any financial services yet.'
            : 'Try adjusting your search or check back later.'}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search services..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center" onClick={() => {
            setSearchQuery('');
            setCategoryFilter('all');
          }}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <FinancialServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            provider={service.provider}
            interestRate={service.interestRate}
            maxAmount={service.maxAmount}
            tenure={service.tenure}
            eligibility={service.eligibility}
            tags={service.tags}
            userRole={userRole}
            onEdit={userRole === 'financial' ? () => onEdit && onEdit(service.id) : undefined}
            onApply={userRole !== 'financial' ? () => handleApply(service.id) : undefined}
            onDelete={userRole === 'financial' ? () => handleDelete(service.id) : undefined}
          />
        ))}
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No services match your current filters.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialServiceList;

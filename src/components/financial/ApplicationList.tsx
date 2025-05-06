
import React, { useState } from 'react';
import LoanApplicationCard from './LoanApplicationCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  amount: number;
  purpose: string;
  farm_type: string;
  farm_size: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  created_at: string;
}

interface ApplicationListProps {
  applications: Application[];
  isProvider?: boolean;
  onUpdateStatus?: (id: string, status: string) => void;
}

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  isProvider = false,
  onUpdateStatus
}) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  
  // Filter applications based on status
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });
  
  // Group applications by status for statistics
  const stats = applications.reduce((acc, app) => {
    if (!acc[app.status]) acc[app.status] = 0;
    acc[app.status]++;
    return acc;
  }, {} as Record<string, number>);
  
  const handleBulkAction = (action: string) => {
    if (!onUpdateStatus) return;
    
    // Apply action to all pending applications
    const pendingApplications = applications.filter(app => app.status === 'pending');
    
    if (pendingApplications.length === 0) {
      toast({
        title: "No pending applications",
        description: "There are no pending applications to process.",
        variant: "destructive"
      });
      return;
    }
    
    pendingApplications.forEach(app => {
      onUpdateStatus(app.id, action);
    });
    
    toast({
      title: `Bulk action complete`,
      description: `${pendingApplications.length} applications have been marked as ${action}.`,
    });
  };
  
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{isProvider ? 'No applications to review at this time.' : 'You have no active applications.'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {isProvider && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-4 bg-gray-50 rounded-md">
          <div>
            <h3 className="text-sm font-medium">Application Statistics</h3>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-yellow-500">Pending: {stats.pending || 0}</span>
              <span className="text-blue-500">Reviewing: {stats.reviewing || 0}</span>
              <span className="text-green-500">Approved: {stats.approved || 0}</span>
              <span className="text-red-500">Rejected: {stats.rejected || 0}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            {onUpdateStatus && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-500 border-blue-200 hover:bg-blue-50"
                  onClick={() => handleBulkAction('reviewing')}
                >
                  Review All Pending
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-500 border-green-200 hover:bg-green-50"
                  onClick={() => handleBulkAction('approved')}
                >
                  Approve All Pending
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {filteredApplications.map((application) => (
        <LoanApplicationCard
          key={application.id}
          application={application}
          isProvider={isProvider}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
      
      {filteredApplications.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} applications found.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;

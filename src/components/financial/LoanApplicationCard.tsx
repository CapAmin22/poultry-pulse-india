
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface LoanApplicationProps {
  application: {
    id: string;
    amount: number;
    purpose: string;
    farm_type: string;
    farm_size: string;
    status: 'pending' | 'reviewing' | 'approved' | 'rejected';
    created_at: string;
  };
  isProvider?: boolean;
  onUpdateStatus?: (id: string, status: string, feedback?: string) => void;
}

const LoanApplicationCard: React.FC<LoanApplicationProps> = ({ 
  application, 
  isProvider = false,
  onUpdateStatus
}) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  
  const statusMessages = {
    pending: 'Your application is pending review.',
    reviewing: 'Your application is currently being reviewed.',
    approved: 'Congratulations! Your loan has been approved.',
    rejected: 'Unfortunately, your loan application was not approved at this time.'
  };
  
  const handleStatusUpdate = (status: string) => {
    if (status === 'approved' || status === 'rejected') {
      setStatusToUpdate(status);
      setIsDialogOpen(true);
    } else {
      handleSubmitUpdate(status);
    }
  };
  
  const handleSubmitUpdate = async (status?: string) => {
    if (!onUpdateStatus) return;
    
    setIsSubmitting(true);
    try {
      // Use the passed status or the one from state
      const updatedStatus = status || statusToUpdate;
      await onUpdateStatus(application.id, updatedStatus, feedback);
      
      toast({
        title: "Status updated",
        description: `Application has been marked as ${updatedStatus}.`,
      });
      
      setIsDialogOpen(false);
      setFeedback('');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the application status.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="border rounded-md p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{formatCurrency(application.amount)} - {application.purpose}</p>
          <p className="text-sm text-gray-600">Farm Type: {application.farm_type}, Size: {application.farm_size}</p>
          <p className="text-sm text-gray-600">
            Applied: {formatDate(application.created_at)}
          </p>
          
          {!isProvider && (
            <div className="mt-2 p-2 rounded bg-gray-50">
              <p className="text-sm">{statusMessages[application.status]}</p>
            </div>
          )}
        </div>
        <div>
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            statusClasses[application.status]
          }`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>
      
      {isProvider && onUpdateStatus && (
        <>
          <div className="mt-4 flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStatusUpdate('reviewing')}
              disabled={application.status === 'reviewing'}
            >
              Review
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-green-500 text-green-500 hover:bg-green-50"
              onClick={() => handleStatusUpdate('approved')}
              disabled={application.status === 'approved'}
            >
              Approve
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleStatusUpdate('rejected')}
              disabled={application.status === 'rejected'}
            >
              Reject
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {statusToUpdate === 'approved' ? 'Approve Application' : 'Reject Application'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="feedback">Add Feedback (Optional)</Label>
                  <Textarea 
                    id="feedback" 
                    placeholder="Add any notes or feedback for the applicant..." 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className={statusToUpdate === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    onClick={() => handleSubmitUpdate()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : statusToUpdate === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default LoanApplicationCard;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, Info, Edit, Trash, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface FinancialServiceCardProps {
  id: string;
  title: string;
  provider: string;
  interestRate?: string;
  maxAmount?: string;
  tenure?: string;
  eligibility: string;
  tags: string[];
  onEdit?: () => void;
  onApply?: () => void;
  onDelete?: () => void;
  userRole?: string;
}

const FinancialServiceCard: React.FC<FinancialServiceCardProps> = ({
  id,
  title,
  provider,
  interestRate,
  maxAmount,
  tenure,
  eligibility,
  tags,
  onEdit,
  onApply,
  onDelete,
  userRole
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleApply = () => {
    if (onApply) {
      onApply();
      setIsApplyDialogOpen(false);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleDownloadInfo = () => {
    // Create a text representation of the service
    const content = `
      Financial Service Information
      ----------------------------
      Title: ${title}
      Provider: ${provider}
      Interest Rate: ${interestRate || 'Not specified'}
      Maximum Amount: ${maxAmount || 'Not specified'}
      Tenure: ${tenure || 'Not specified'}
      
      Eligibility Criteria:
      ${eligibility}
      
      Categories: ${tags.join(', ')}
    `;
    
    // Create a blob and download it
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Information downloaded",
      description: "Service information has been downloaded as a text file.",
    });
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:border-poultry-primary transition-colors ${expanded ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className="font-medium text-poultry-primary">{title}</h3>
              <p className="text-sm text-gray-600">{provider}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Interest Rate</p>
              <p className="text-sm font-medium">{interestRate || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Maximum Amount</p>
              <p className="text-sm font-medium">{maxAmount || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Tenure</p>
              <p className="text-sm font-medium">{tenure || 'Not specified'}</p>
            </div>
          </div>
          
          {expanded && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Eligibility</p>
              <p className="text-sm p-3 bg-gray-50 rounded-md border border-gray-100">{eligibility}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show More
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadInfo}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Info
          </Button>
          
          {userRole === 'financial' ? (
            <div className="flex gap-2">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onEdit}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              )}
              
              {onDelete && (
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-500 hover:bg-red-50"
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Financial Service</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this financial service? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : (
            onApply && (
              <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-poultry-primary hover:bg-poultry-primary/90"
                  >
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for {title}</DialogTitle>
                    <DialogDescription>
                      You're about to apply for this financial service from {provider}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-md mb-4">
                      <Info className="h-5 w-5" />
                      <p className="text-sm">
                        When you apply, your farm information will be shared with the provider for review.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Interest Rate:</span>
                        <p className="font-medium">{interestRate || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Maximum Amount:</span>
                        <p className="font-medium">{maxAmount || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tenure:</span>
                        <p className="font-medium">{tenure || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Provider:</span>
                        <p className="font-medium">{provider}</p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApply} className="bg-poultry-primary hover:bg-poultry-primary/90">
                      Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialServiceCard;

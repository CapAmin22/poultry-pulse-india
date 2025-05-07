
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useFinancial } from '@/contexts/FinancialContext';
import { useToast } from '@/hooks/use-toast';

interface LoanApplicationFormProps {
  onSuccess?: () => void;
  preselectedAmount?: number;
  preselectedPurpose?: string;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ 
  onSuccess,
  preselectedAmount,
  preselectedPurpose
}) => {
  const { submitApplication } = useFinancial();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: preselectedAmount?.toString() || '',
    purpose: preselectedPurpose || '',
    duration: '',
    farm_type: '',
    farm_size: '',
    annual_revenue: '',
    collateral: '',
    contact_number: '',
    existing_loans: '',
    additional_info: ''
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
    
    // Validate form
    const requiredFields = ['amount', 'purpose', 'farm_type', 'farm_size', 'annual_revenue', 'collateral'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    // Validate amount is a number
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid loan amount",
      });
      return;
    }
    
    // Validate annual revenue is a number
    if (isNaN(Number(formData.annual_revenue)) || Number(formData.annual_revenue) < 0) {
      toast({
        variant: "destructive",
        title: "Invalid revenue",
        description: "Please enter a valid annual revenue amount",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for submission
      const applicationData = {
        ...formData,
        amount: Number(formData.amount),
        annual_revenue: Number(formData.annual_revenue)
      };
      
      const success = await submitApplication(applicationData);
      
      if (success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const farmTypes = [
    "Broiler Farm",
    "Layer Farm",
    "Breeder Farm",
    "Hatchery",
    "Integrated Poultry Farm",
    "Free-Range Poultry",
    "Organic Poultry",
    "Backyard Poultry",
    "Other"
  ];
  
  const farmSizes = [
    "Small (< 5,000 birds)",
    "Medium (5,000 - 20,000 birds)",
    "Large (20,000 - 50,000 birds)",
    "Very Large (> 50,000 birds)"
  ];
  
  const loanDurations = [
    "6 months",
    "1 year",
    "2 years",
    "3 years",
    "5 years",
    "7 years",
    "10 years",
    "Other"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for Financial Assistance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="required">Loan Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter loan amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="required">Loan Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan duration" />
                </SelectTrigger>
                <SelectContent>
                  {loanDurations.map((duration) => (
                    <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose" className="required">Loan Purpose</Label>
            <Textarea
              id="purpose"
              name="purpose"
              placeholder="Describe how you plan to use this loan"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="farm_type" className="required">Farm Type</Label>
              <Select
                value={formData.farm_type}
                onValueChange={(value) => handleSelectChange('farm_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  {farmTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="farm_size" className="required">Farm Size</Label>
              <Select
                value={formData.farm_size}
                onValueChange={(value) => handleSelectChange('farm_size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select farm size" />
                </SelectTrigger>
                <SelectContent>
                  {farmSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual_revenue" className="required">Annual Revenue (₹)</Label>
              <Input
                id="annual_revenue"
                name="annual_revenue"
                type="number"
                placeholder="Enter your annual revenue"
                value={formData.annual_revenue}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collateral" className="required">Collateral</Label>
              <Input
                id="collateral"
                name="collateral"
                placeholder="What can you offer as collateral?"
                value={formData.collateral}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_number">Contact Number</Label>
              <Input
                id="contact_number"
                name="contact_number"
                placeholder="Your contact number"
                value={formData.contact_number}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="existing_loans">Existing Loans</Label>
              <Input
                id="existing_loans"
                name="existing_loans"
                placeholder="Any existing loans? (Optional)"
                value={formData.existing_loans}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea
              id="additional_info"
              name="additional_info"
              placeholder="Any additional details you'd like to share (Optional)"
              value={formData.additional_info}
              onChange={handleChange}
              rows={3}
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
                Submitting Application...
              </>
            ) : (
              'Submit Loan Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';

const serviceCategories = [
  { value: "loan", label: "Loan" },
  { value: "insurance", label: "Insurance" },
  { value: "subsidy", label: "Subsidy Program" },
  { value: "financial_consulting", label: "Financial Consulting" },
  { value: "investment", label: "Investment" },
  { value: "banking", label: "Banking Services" },
];

interface Eligibility {
  id: string;
  criterion: string;
}

interface Document {
  id: string;
  name: string;
}

// Define interface for financial service
interface FinancialService {
  title: string;
  category: string;
  provider_name: string;
  interest_rate: string;
  max_amount: string;
  tenure: string;
  description: string;
  contact_number: string;
  email: string;
  eligibility_criteria: string[];
  required_documents: string[];
  image_url?: string | null;
  tags?: string[] | null;
  user_id: string;
}

interface ServiceProviderFormProps {
  onSuccess?: () => void;
  serviceId?: string | null;
}

const ServiceProviderForm: React.FC<ServiceProviderFormProps> = ({ onSuccess, serviceId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!serviceId);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eligibilityCriteria, setEligibilityCriteria] = useState<Eligibility[]>([
    { id: uuidv4(), criterion: '' }
  ]);
  const [requiredDocuments, setRequiredDocuments] = useState<Document[]>([
    { id: uuidv4(), name: '' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    providerName: '',
    interestRate: '',
    maxAmount: '',
    tenure: '',
    description: '',
    contactNumber: '',
    email: '',
  });
  
  useEffect(() => {
    if (serviceId) {
      fetchServiceData(serviceId);
    }
  }, [serviceId]);
  
  const fetchServiceData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('financial_services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || '',
          category: data.category || '',
          providerName: data.provider_name || '',
          interestRate: data.interest_rate || '',
          maxAmount: data.max_amount || '',
          tenure: data.tenure || '',
          description: data.description || '',
          contactNumber: data.contact_number || '',
          email: data.email || '',
        });
        
        if (data.eligibility_criteria && data.eligibility_criteria.length > 0) {
          setEligibilityCriteria(data.eligibility_criteria.map((criterion: string) => ({
            id: uuidv4(),
            criterion
          })));
        }
        
        if (data.required_documents && data.required_documents.length > 0) {
          setRequiredDocuments(data.required_documents.map((doc: string) => ({
            id: uuidv4(),
            name: doc
          })));
        }
        
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast({
        title: "Failed to load service data",
        description: "There was a problem retrieving service information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setServiceImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addEligibilityCriterion = () => {
    setEligibilityCriteria([...eligibilityCriteria, { id: uuidv4(), criterion: '' }]);
  };

  const removeEligibilityCriterion = (id: string) => {
    if (eligibilityCriteria.length === 1) return;
    setEligibilityCriteria(eligibilityCriteria.filter(item => item.id !== id));
  };

  const updateEligibilityCriterion = (id: string, value: string) => {
    setEligibilityCriteria(eligibilityCriteria.map(item => 
      item.id === id ? { ...item, criterion: value } : item
    ));
  };

  const addRequiredDocument = () => {
    setRequiredDocuments([...requiredDocuments, { id: uuidv4(), name: '' }]);
  };

  const removeRequiredDocument = (id: string) => {
    if (requiredDocuments.length === 1) return;
    setRequiredDocuments(requiredDocuments.filter(item => item.id !== id));
  };

  const updateRequiredDocument = (id: string, value: string) => {
    setRequiredDocuments(requiredDocuments.map(item => 
      item.id === id ? { ...item, name: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to offer financial services",
        variant: "destructive"
      });
      return;
    }
    
    // Validate form
    const requiredFields = ['title', 'category', 'providerName', 'description', 'contactNumber', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = imagePreview;
      
      // Upload image if a new one is provided
      if (serviceImage) {
        // Check if financial_services bucket exists and create if it doesn't
        const { data: buckets } = await supabase.storage.listBuckets();
        
        if (!buckets?.some(b => b.name === 'financial_services')) {
          await supabase.storage.createBucket('financial_services', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
          });
        }
        
        // Upload image
        const fileExt = serviceImage.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('financial_services')
          .upload(fileName, serviceImage);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('financial_services')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      const filteredEligibilityCriteria = eligibilityCriteria
        .filter(item => item.criterion.trim() !== '')
        .map(item => item.criterion);
        
      const filteredRequiredDocuments = requiredDocuments
        .filter(item => item.name.trim() !== '')
        .map(item => item.name);
        
      // Set default tags based on category
      let tags = [];
      if (formData.category === 'loan') {
        tags = ['Loan', 'Credit'];
      } else if (formData.category === 'insurance') {
        tags = ['Insurance', 'Protection'];
      } else if (formData.category === 'subsidy') {
        tags = ['Subsidy', 'Government'];
      } else {
        tags = [formData.category];
      }
      
      // Create financial service listing
      const serviceData: FinancialService = {
        title: formData.title,
        category: formData.category,
        provider_name: formData.providerName,
        interest_rate: formData.interestRate,
        max_amount: formData.maxAmount,
        tenure: formData.tenure,
        description: formData.description,
        contact_number: formData.contactNumber,
        email: formData.email,
        eligibility_criteria: filteredEligibilityCriteria,
        required_documents: filteredRequiredDocuments,
        image_url: imageUrl,
        tags,
        user_id: user.id,
      };
      
      if (serviceId) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('financial_services')
          .update(serviceData as any)
          .eq('id', serviceId);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Service updated successfully",
          description: "Your financial service has been updated",
        });
      } else {
        // Create new service
        const { error: insertError } = await supabase
          .from('financial_services')
          .insert(serviceData as any);
          
        if (insertError) throw insertError;
        
        toast({
          title: "Service listed successfully",
          description: "Your financial service is now available for users to view",
        });
      }
      
      // Reset form if not editing
      if (!serviceId) {
        setFormData({
          title: '',
          category: '',
          providerName: '',
          interestRate: '',
          maxAmount: '',
          tenure: '',
          description: '',
          contactNumber: '',
          email: '',
        });
        setServiceImage(null);
        setImagePreview(null);
        setEligibilityCriteria([{ id: uuidv4(), criterion: '' }]);
        setRequiredDocuments([{ id: uuidv4(), name: '' }]);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      console.error('Error listing financial service:', error);
      toast({
        title: "Error saving service",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="title" className="required">Service Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Poultry Farm Development Loan"
            value={formData.title}
            onChange={handleFormChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="category" className="required">Service Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="providerName" className="required">Provider Name</Label>
            <Input
              id="providerName"
              name="providerName"
              placeholder="e.g., National Bank for Agriculture"
              value={formData.providerName}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="interestRate">Interest Rate</Label>
            <Input
              id="interestRate"
              name="interestRate"
              placeholder="e.g., 7-9%"
              value={formData.interestRate}
              onChange={handleFormChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="maxAmount">Maximum Amount</Label>
            <Input
              id="maxAmount"
              name="maxAmount"
              placeholder="e.g., ₹50 Lakhs"
              value={formData.maxAmount}
              onChange={handleFormChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="tenure">Tenure</Label>
            <Input
              id="tenure"
              name="tenure"
              placeholder="e.g., Up to 7 years"
              value={formData.tenure}
              onChange={handleFormChange}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="description" className="required">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your financial service in detail"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Eligibility Criteria</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addEligibilityCriterion}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Criterion
            </Button>
          </div>
          
          {eligibilityCriteria.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={`Criterion ${index + 1}`}
                value={item.criterion}
                onChange={(e) => updateEligibilityCriterion(item.id, e.target.value)}
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={() => removeEligibilityCriterion(item.id)}
                disabled={eligibilityCriteria.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Required Documents</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addRequiredDocument}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Document
            </Button>
          </div>
          
          {requiredDocuments.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={`Document ${index + 1}`}
                value={item.name}
                onChange={(e) => updateRequiredDocument(item.id, e.target.value)}
              />
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={() => removeRequiredDocument(item.id)}
                disabled={requiredDocuments.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="contactNumber" className="required">Contact Number</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              placeholder="Enter contact number"
              value={formData.contactNumber}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="email" className="required">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter contact email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Service Image/Logo</Label>
          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            {imagePreview ? (
              <div className="relative w-full">
                <img 
                  src={imagePreview} 
                  alt="Service image preview" 
                  className="mx-auto max-h-48 object-contain rounded-md"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setServiceImage(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2 flex text-sm text-gray-600">
                  <label
                    htmlFor="service-image-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Upload an image</span>
                    <input
                      id="service-image-upload"
                      name="service-image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#f5565c]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {serviceId ? 'Updating Service...' : 'Publishing Service...'}
            </>
          ) : (
            serviceId ? 'Update Financial Service' : 'Publish Financial Service'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuidv4 } from 'uuid';

const productCategories = [
  { value: "eggs", label: "Eggs" },
  { value: "poultry", label: "Poultry" },
  { value: "equipment", label: "Equipment" },
  { value: "feed", label: "Feed" },
  { value: "medicine", label: "Medicine" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" }
];

const FarmerSellForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    quantity: '',
    location: '',
    description: '',
    contactNumber: '',
    condition: 'new',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductImage(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to sell products",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (productImage) {
        // Check if avatars bucket exists and create if it doesn't
        const { data: buckets } = await supabase.storage.listBuckets();
        
        if (!buckets?.some(b => b.name === 'marketplace')) {
          await supabase.storage.createBucket('marketplace', {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
          });
        }
        
        // Upload image
        const fileExt = productImage.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('marketplace')
          .upload(fileName, productImage);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('marketplace')
          .getPublicUrl(fileName);
          
        imageUrl = data.publicUrl;
      }
      
      // Create marketplace listing
      const { error: insertError } = await supabase
        .from('marketplace_listings')
        .insert({
          title: formData.title,
          category: formData.category,
          price: formData.price,
          description: formData.description,
          condition: formData.condition,
          location: formData.location,
          contact_number: formData.contactNumber,
          image_url: imageUrl,
          user_id: user.id,
          quantity: formData.quantity,
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Product listed successfully",
        description: "Your product is now available in the marketplace",
      });
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        price: '',
        quantity: '',
        location: '',
        description: '',
        contactNumber: '',
        condition: 'new',
      });
      setProductImage(null);
      setImagePreview(null);
      
    } catch (error: any) {
      console.error('Error listing product:', error);
      toast({
        title: "Error listing product",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell Your Products</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="condition">Condition *</Label>
              <Select 
                value={formData.condition} 
                onValueChange={(value) => handleSelectChange('condition', value)}
              >
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used_like_new">Used - Like New</SelectItem>
                  <SelectItem value="used_good">Used - Good</SelectItem>
                  <SelectItem value="used_fair">Used - Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="quantity">Quantity/Unit *</Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="e.g., 100 kg, 500 boxes"
                value={formData.quantity}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., Delhi NCR"
              value={formData.location}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product in detail"
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              name="contactNumber"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={handleFormChange}
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Product Image</Label>
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative w-full">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="mx-auto max-h-48 object-contain rounded-md"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setProductImage(null);
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
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload an image</span>
                      <input
                        id="file-upload"
                        name="file-upload"
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
                Listing Product...
              </>
            ) : (
              'List Product'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FarmerSellForm;


import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookmarkIcon, Clock, Filter, MapPin, PackagePlus, Phone, Search, ShoppingCart, Star, Tags, Plus, X, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import MarketplaceListing from '@/components/modules/MarketplaceListing';

// Define the form schema for new listings
const listingFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string(),
  subcategory: z.string().optional(),
  price: z.string(),
  location: z.string(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  condition: z.string().optional(),
  contactNumber: z.string().optional(),
});

// Types for listings
interface Listing {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  price: string;
  location: string;
  description: string;
  condition?: string;
  contact_number?: string;
  created_at: string;
  user_id: string;
  seller_name?: string;
  image_url?: string;
}

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form definition
  const form = useForm<z.infer<typeof listingFormSchema>>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: "",
      category: "equipment",
      price: "",
      location: "",
      description: "",
      condition: "new",
      contactNumber: "",
    },
  });
  
  // Load saved items from local storage
  useEffect(() => {
    const loadSavedItems = () => {
      const saved = localStorage.getItem('savedMarketplaceItems');
      if (saved) {
        setSavedItems(JSON.parse(saved));
      }
    };
    
    loadSavedItems();
  }, []);
  
  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('*, profiles(username)')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching listings:', error);
          throw error;
        }
        
        // Transform data to match our Listing interface
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
          price: item.price,
          location: item.location,
          description: item.description,
          condition: item.condition,
          contact_number: item.contact_number,
          created_at: item.created_at,
          user_id: item.user_id,
          seller_name: item.profiles?.username || 'Unknown Seller',
          image_url: item.image_url,
        }));
        
        setListings(formattedData);
      } catch (error) {
        toast({
          title: "Failed to load listings",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  // Toggle saving an item
  const toggleSaveItem = (itemId: string) => {
    let newSavedItems;
    
    if (savedItems.includes(itemId)) {
      newSavedItems = savedItems.filter(id => id !== itemId);
      toast({
        title: "Item removed from saved list",
      });
    } else {
      newSavedItems = [...savedItems, itemId];
      toast({
        title: "Item saved",
        description: "You can find this item in your saved items.",
      });
    }
    
    setSavedItems(newSavedItems);
    localStorage.setItem('savedMarketplaceItems', JSON.stringify(newSavedItems));
  };
  
  // Handle contact seller
  const handleContactSeller = (listing: Listing) => {
    if (listing.contact_number) {
      toast({
        title: "Contact information",
        description: `Contact ${listing.seller_name} at ${listing.contact_number}`,
      });
    } else {
      toast({
        title: "Contact seller",
        description: "Connecting you with the seller...",
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `marketplace/${fileName}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);
        
      setUploadedImage(urlData.publicUrl);
      
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Failed to upload image",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Submit new listing
  const onSubmit = async (values: z.infer<typeof listingFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a listing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .insert([
          {
            title: values.title,
            category: values.category,
            subcategory: values.subcategory,
            price: values.price,
            location: values.location,
            description: values.description,
            condition: values.condition,
            contact_number: values.contactNumber,
            user_id: user.id,
            image_url: uploadedImage,
          }
        ]);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Listing created successfully",
        description: "Your listing has been published to the marketplace",
      });
      
      // Reset form and close dialog
      form.reset();
      setUploadedImage(null);
      setIsDialogOpen(false);
      
      // Refresh listings
      const { data: newData, error: newError } = await supabase
        .from('marketplace_listings')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
        
      if (!newError) {
        const formattedData = newData.map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
          price: item.price,
          location: item.location,
          description: item.description,
          condition: item.condition,
          contact_number: item.contact_number,
          created_at: item.created_at,
          user_id: item.user_id,
          seller_name: item.profiles?.username || 'Unknown Seller',
          image_url: item.image_url,
        }));
        
        setListings(formattedData);
      }
    } catch (error: any) {
      console.error('Error creating listing:', error);
      toast({
        title: "Failed to create listing",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };
  
  // Filter listings based on search and filters
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      searchTerm === '' || 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === 'all' || 
      listing.category === selectedCategory;
      
    const matchesLocation = 
      selectedLocation === 'all' || 
      listing.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
    return matchesSearch && matchesCategory && matchesLocation;
  });
  
  // Group listings by category
  const equipmentListings = filteredListings.filter(listing => listing.category === 'equipment');
  const suppliesListings = filteredListings.filter(listing => listing.category === 'supplies');
  const livestockListings = filteredListings.filter(listing => listing.category === 'livestock');
  
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-gray-500 mt-1">
            Buy and sell poultry equipment, supplies, and livestock
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search marketplace..." 
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90 w-full flex items-center gap-2"
                >
                  <PackagePlus className="h-4 w-4" />
                  Sell Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>List an item for sale</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to create a new listing in the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a descriptive title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="supplies">Feed & Supplies</SelectItem>
                                <SelectItem value="livestock">Livestock</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="refurbished">Refurbished</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="₹10,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, State" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your item in detail" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Product Image</FormLabel>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                        {uploadedImage ? (
                          <div className="relative w-full">
                            <img 
                              src={uploadedImage} 
                              alt="Product preview" 
                              className="mx-auto max-h-[200px] object-contain"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                              onClick={() => setUploadedImage(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer text-blue-600 hover:text-blue-700">
                                  <span>Upload a file</span>
                                  <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                  />
                                </label>
                                <p className="mt-1">PNG, JPG, or WebP up to 5MB</p>
                              </div>
                            </div>
                            {isUploading && (
                              <div className="mt-4 flex items-center">
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                <span>Uploading...</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        disabled={isUploading || form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Posting...
                          </>
                        ) : (
                          "Post Listing"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <Select 
              defaultValue="all" 
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="supplies">Feed & Supplies</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              defaultValue="all" 
              onValueChange={(value) => setSelectedLocation(value)}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All India</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="kolkata">Kolkata</SelectItem>
                <SelectItem value="hyderabad">Hyderabad</SelectItem>
                <SelectItem value="bengaluru">Bengaluru</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
        
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="equipment" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              Equipment & Tools
            </TabsTrigger>
            <TabsTrigger 
              value="supplies" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              Feed & Supplies
            </TabsTrigger>
            <TabsTrigger 
              value="livestock" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              Livestock
            </TabsTrigger>
          </TabsList>
          
          {/* Equipment Tab */}
          <TabsContent value="equipment" className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : equipmentListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {equipmentListings.map((listing) => (
                  <motion.div 
                    key={listing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={listing.image_url || "/placeholder.svg"} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.className = "w-full h-full object-cover bg-gray-100";
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          onClick={() => toggleSaveItem(listing.id)}
                        >
                          <BookmarkIcon className={`h-5 w-5 ${savedItems.includes(listing.id) ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                          <span className="font-bold">{listing.price}</span>
                          <Badge className={
                            listing.condition === 'new' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : listing.condition === 'used'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          }>
                            {listing.condition || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2" title={listing.title}>
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span>{listing.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Seller: {listing.seller_name}</p>
                          <p>Posted: {new Date(listing.created_at).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactSeller(listing)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No equipment listings found</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            )}
            
            {equipmentListings.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Supplies Tab */}
          <TabsContent value="supplies" className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : suppliesListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suppliesListings.map((listing) => (
                  <motion.div 
                    key={listing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={listing.image_url || "/placeholder.svg"} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.className = "w-full h-full object-cover bg-gray-100";
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          onClick={() => toggleSaveItem(listing.id)}
                        >
                          <BookmarkIcon className={`h-5 w-5 ${savedItems.includes(listing.id) ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                          <span className="font-bold">{listing.price}</span>
                          <Badge className={
                            'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          }>
                            Supplies
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2" title={listing.title}>
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span>{listing.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Seller: {listing.seller_name}</p>
                          <p>Posted: {new Date(listing.created_at).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactSeller(listing)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                        >
                          Order Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No supplies listings found</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            )}
            
            {suppliesListings.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Livestock Tab */}
          <TabsContent value="livestock" className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : livestockListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {livestockListings.map((listing) => (
                  <motion.div 
                    key={listing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={listing.image_url || "/placeholder.svg"} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.className = "w-full h-full object-cover bg-gray-100";
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          onClick={() => toggleSaveItem(listing.id)}
                        >
                          <BookmarkIcon className={`h-5 w-5 ${savedItems.includes(listing.id) ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                          <span className="font-bold">{listing.price}</span>
                          <Badge className={
                            'bg-green-100 text-green-800 hover:bg-green-100'
                          }>
                            Livestock
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-2" title={listing.title}>
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span>{listing.location}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <p className="text-sm text-gray-600 line-clamp-3">{listing.description}</p>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Seller: {listing.seller_name}</p>
                          <p>Posted: {new Date(listing.created_at).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactSeller(listing)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                        >
                          Book Order
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No livestock listings found</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Listing
                </Button>
              </div>
            )}
            
            {livestockListings.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Marketplace;

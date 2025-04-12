
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Grid, ListFilter, Package, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  price: string;
  location: string;
  description: string;
  condition?: string;
  contact_number?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string(),
  subcategory: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  condition: z.string().optional(),
  contactNumber: z.string().optional(),
  imageUrl: z.string().optional(),
});

const MarketplaceListing: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      category: "feed",
      subcategory: "",
      price: "",
      location: "",
      description: "",
      condition: "new",
      contactNumber: "",
      imageUrl: "",
    },
  });

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast({
        title: "Error fetching products",
        description: "There was a problem loading marketplace listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit new listing
  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
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
        .insert({
          user_id: user.id,
          title: values.title,
          category: values.category,
          subcategory: values.subcategory,
          price: values.price,
          location: values.location,
          description: values.description,
          condition: values.condition,
          contact_number: values.contactNumber,
          image_url: values.imageUrl,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Listing created successfully",
        description: "Your product has been listed in the marketplace",
      });

      setDialogOpen(false);
      form.reset();
      fetchProducts();
    } catch (err) {
      console.error('Error creating listing:', err);
      toast({
        title: "Error creating listing",
        description: "There was a problem creating your listing",
        variant: "destructive",
      });
    }
  };

  // Delete listing
  const deleteListing = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('marketplace_listings')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Listing deleted",
        description: "Your listing has been removed from the marketplace",
      });

      setDetailsOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast({
        title: "Error deleting listing",
        description: "There was a problem deleting your listing",
        variant: "destructive",
      });
    }
  };

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // View product details
  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsOpen(true);
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-poultry-primary" />
            <span>Marketplace</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-6">
            Connect with suppliers, traders, and buyers in the Indian poultry industry marketplace.
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-2.5">
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <Button variant="outline" className="flex items-center gap-1">
                  <ListFilter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-poultry-primary hover:bg-poultry-primary/90">
                  + Add Listing
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Create New Listing</DialogTitle>
                  <DialogDescription>
                    Add your product to the marketplace for other poultry professionals to see.
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
                            <Input placeholder="Product name" {...field} />
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
                                <SelectItem value="feed">Feed</SelectItem>
                                <SelectItem value="equipment">Equipment</SelectItem>
                                <SelectItem value="birds">Live Birds</SelectItem>
                                <SelectItem value="medicine">Medicine</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="₹" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                <SelectItem value="used_like_new">Used - Like New</SelectItem>
                                <SelectItem value="used_good">Used - Good</SelectItem>
                                <SelectItem value="used_fair">Used - Fair</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your product in detail"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a URL for your product image. You can use image hosting services like Imgur.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-poultry-primary hover:bg-poultry-primary/90"
                      >
                        List Product
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              variant={activeCategory === "all" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("all")}
            >
              All Categories
            </Button>
            <Button 
              variant={activeCategory === "feed" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("feed")}
            >
              Feed
            </Button>
            <Button 
              variant={activeCategory === "equipment" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("equipment")}
            >
              Equipment
            </Button>
            <Button 
              variant={activeCategory === "birds" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("birds")}
            >
              Live Birds
            </Button>
            <Button 
              variant={activeCategory === "medicine" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("medicine")}
            >
              Medicine
            </Button>
            <Button 
              variant={activeCategory === "services" ? "default" : "outline"} 
              className="text-sm"
              onClick={() => setActiveCategory("services")}
            >
              Services
            </Button>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                <span>View</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-poultry-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500">Loading marketplace listings...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewProductDetails(product)}
                >
                  <div className="h-40 bg-gray-100 relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                          target.className = "w-full h-full object-contain p-4";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-gray-800 hover:bg-gray-100">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 truncate" title={product.title}>
                      {product.title}
                    </h3>
                    <p className="text-poultry-primary font-medium">{product.price}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{product.location}</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <Badge variant="outline">
                        {product.condition ? product.condition.replace(/_/g, ' ') : 'Not specified'}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {format(new Date(product.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No listings found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "No products match your search criteria"
                  : "Be the first to add a listing in this category"}
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-poultry-primary hover:bg-poultry-primary/90"
              >
                Add Listing
              </Button>
            </div>
          )}
          
          {filteredProducts.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}

          {/* Product Details Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="sm:max-w-[650px]">
              {selectedProduct && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedProduct.title}</DialogTitle>
                    <DialogDescription>
                      Listed in {selectedProduct.category} • {format(new Date(selectedProduct.created_at), 'MMMM d, yyyy')}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-60 md:h-full bg-gray-100 rounded-md overflow-hidden">
                      {selectedProduct.image_url ? (
                        <img
                          src={selectedProduct.image_url}
                          alt={selectedProduct.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                            target.className = "w-full h-full object-contain p-4";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-16 w-16 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-poultry-primary">{selectedProduct.price}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{selectedProduct.location}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Description</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <div>
                      {user && user.id === selectedProduct.user_id && (
                        <Button 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteListing(selectedProduct.id)}
                        >
                          Delete Listing
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                        Close
                      </Button>
                      {selectedProduct.contact_number && (
                        <Button className="bg-poultry-primary hover:bg-poultry-primary/90">
                          Contact Seller
                        </Button>
                      )}
                    </div>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceListing;

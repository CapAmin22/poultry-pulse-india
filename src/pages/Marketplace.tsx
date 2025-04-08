
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BookmarkIcon, Clock, DollarSign, ExternalLink, Filter, MapPin, PackagePlus, Phone, Search, ShoppingCart, Star, Tags } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data for products
const products = [
  {
    id: 1,
    title: 'Automatic Poultry Feeder System',
    seller: 'AgriTech Solutions',
    price: '₹15,500',
    rating: 4.7,
    reviews: 24,
    location: 'Delhi NCR',
    category: 'Equipment',
    condition: 'New',
    image: 'https://i.pravatar.cc/300?img=31',
    description: 'Advanced automatic feeder system with programmable feeding schedule and capacity for up to 5,000 birds.',
    isSaved: false
  },
  {
    id: 2,
    title: 'Layer Cages (Set of 100)',
    seller: 'Poultry Supplies Ltd.',
    price: '₹48,000',
    rating: 4.5,
    reviews: 18,
    location: 'Mumbai',
    category: 'Housing',
    condition: 'New',
    image: 'https://i.pravatar.cc/300?img=32',
    description: 'Durable galvanized steel layer cages with automatic feeding and egg collection systems. Easy to clean and maintain.',
    isSaved: true
  },
  {
    id: 3,
    title: 'Broiler Processing Equipment',
    seller: 'Farm Solutions',
    price: '₹2,25,000',
    rating: 4.8,
    reviews: 7,
    location: 'Hyderabad',
    category: 'Processing',
    condition: 'Used',
    image: 'https://i.pravatar.cc/300?img=33',
    description: 'Complete broiler processing setup including stunner, scalder, plucker, and evisceration equipment. Lightly used, excellent condition.',
    isSaved: false
  },
  {
    id: 4,
    title: 'High-Efficiency Ventilation System',
    seller: 'Climate Control Systems',
    price: '₹85,000',
    rating: 4.9,
    reviews: 15,
    location: 'Pune',
    category: 'Equipment',
    condition: 'New',
    image: 'https://i.pravatar.cc/300?img=34',
    description: 'Complete ventilation solution for poultry houses including fans, inlets, controllers, and alarms. Energy-efficient design.',
    isSaved: false
  }
];

// Sample data for supplies
const supplies = [
  {
    id: 1,
    title: 'Premium Layer Feed',
    seller: 'Nutrition Plus',
    price: '₹2,200/quintal',
    minOrder: '5 quintals',
    category: 'Feed',
    location: 'Multiple Locations',
    inStock: true,
    description: 'High-quality layer feed with balanced nutrition for optimal egg production. Contains essential vitamins and minerals.',
    image: 'https://i.pravatar.cc/300?img=41'
  },
  {
    id: 2,
    title: 'Broiler Starter Feed',
    seller: 'Nutrition Plus',
    price: '₹2,450/quintal',
    minOrder: '5 quintals',
    category: 'Feed',
    location: 'Multiple Locations',
    inStock: true,
    description: 'Nutritionally balanced starter feed for broiler chicks from day 1-21. Enhanced with growth promoters.',
    image: 'https://i.pravatar.cc/300?img=42'
  },
  {
    id: 3,
    title: 'Poultry Vaccines Combo Pack',
    seller: 'VetPharma Supplies',
    price: '₹4,500',
    minOrder: '1 pack',
    category: 'Healthcare',
    location: 'Nationwide Delivery',
    inStock: true,
    description: 'Essential vaccine combo including Newcastle Disease, Infectious Bronchitis, and Gumboro Disease vaccines. Cold chain maintained.',
    image: 'https://i.pravatar.cc/300?img=43'
  },
  {
    id: 4,
    title: 'Disinfectant Solution (20L)',
    seller: 'Biosecurity Products',
    price: '₹1,850',
    minOrder: '2 cans',
    category: 'Biosecurity',
    location: 'Nationwide Delivery',
    inStock: false,
    description: 'Broad-spectrum disinfectant effective against bacteria, viruses, and fungi. Safe for use in occupied poultry houses.',
    image: 'https://i.pravatar.cc/300?img=44'
  }
];

// Sample data for livestock
const livestock = [
  {
    id: 1,
    title: 'Day-Old Broiler Chicks',
    seller: 'Quality Hatchery',
    price: '₹40/chick',
    minOrder: '100 chicks',
    breed: 'Cobb 500',
    location: 'Haryana',
    availability: 'Weekly',
    description: 'Healthy day-old broiler chicks with excellent feed conversion ratio and growth rate. Vaccinated for ND and IBD.',
    image: 'https://i.pravatar.cc/300?img=51'
  },
  {
    id: 2,
    title: 'Day-Old Layer Chicks',
    seller: 'Premium Poultry',
    price: '₹35/chick',
    minOrder: '100 chicks',
    breed: 'BV-300',
    location: 'Punjab',
    availability: 'Weekly',
    description: 'High-quality layer chicks with excellent egg production potential. Vaccinated and debeaked.',
    image: 'https://i.pravatar.cc/300?img=52'
  },
  {
    id: 3,
    title: 'Ready-to-Lay Pullets',
    seller: 'Farm Fresh Poultry',
    price: '₹450/bird',
    minOrder: '50 birds',
    breed: 'Lohmann Brown',
    location: 'Karnataka',
    availability: 'Limited Stock',
    description: '16-week old pullets ready to start laying within 2-3 weeks. Fully vaccinated and dewormed.',
    image: 'https://i.pravatar.cc/300?img=53'
  },
  {
    id: 4,
    title: 'Breeding Roosters',
    seller: 'Heritage Poultry Farm',
    price: '₹650/bird',
    minOrder: '5 birds',
    breed: 'Rhode Island Red',
    location: 'Maharashtra',
    availability: 'Limited Stock',
    description: 'Mature, healthy breeding roosters from pure genetic line. Excellent for breeding programs.',
    image: 'https://i.pravatar.cc/300?img=54'
  }
];

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState<number[]>([2]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  const toggleSaveItem = (itemId: number) => {
    if (savedItems.includes(itemId)) {
      setSavedItems(savedItems.filter(id => id !== itemId));
      toast({
        title: "Item removed from saved list",
      });
    } else {
      setSavedItems([...savedItems, itemId]);
      toast({
        title: "Item saved",
        description: "You can find this item in your saved items.",
      });
    }
  };
  
  const handleContactSeller = (itemId: number) => {
    toast({
      title: "Contact seller",
      description: "Connecting you with the seller...",
    });
  };
  
  const handleAddToCart = (itemId: number) => {
    toast({
      title: "Added to cart",
      description: "Item has been added to your cart.",
    });
  };
  
  const handlePostItem = () => {
    toast({
      title: "Sell item",
      description: "Let's create your marketplace listing.",
    });
  };
  
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
            <Button 
              className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90 w-full flex items-center gap-2"
              onClick={handlePostItem}
            >
              <PackagePlus className="h-4 w-4" />
              Sell Item
            </Button>
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
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="feed">Feed & Nutrition</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
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
                <SelectItem value="north">North India</SelectItem>
                <SelectItem value="south">South India</SelectItem>
                <SelectItem value="east">East India</SelectItem>
                <SelectItem value="west">West India</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isSaved = savedItems.includes(product.id);
                
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                          onClick={() => toggleSaveItem(product.id)}
                        >
                          <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                          <span className="font-bold">{product.price}</span>
                          <Badge className={
                            product.condition === 'New' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                          }>
                            {product.condition}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <CardDescription className="flex justify-between items-center">
                          <span>{product.seller}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating} ({product.reviews})</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex justify-between text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Tags className="h-4 w-4 text-gray-500" />
                            <span>{product.category}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{product.location}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleContactSeller(product.id)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View More Equipment</Button>
            </div>
          </TabsContent>
          
          {/* Supplies Tab */}
          <TabsContent value="supplies" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplies.map((supply) => (
                <motion.div 
                  key={supply.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img 
                        src={supply.image} 
                        alt={supply.title} 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                        onClick={() => toggleSaveItem(supply.id)}
                      >
                        <BookmarkIcon className={`h-5 w-5 ${savedItems.includes(supply.id) ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                        <span className="font-bold">{supply.price}</span>
                        <Badge className={
                          supply.inStock 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }>
                          {supply.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{supply.title}</CardTitle>
                      <CardDescription>
                        {supply.seller}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <div className="flex justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Tags className="h-4 w-4 text-gray-500" />
                          <span>{supply.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{supply.location}</span>
                        </div>
                      </div>
                      <div className="text-sm mb-3">
                        <span className="text-gray-500">Minimum Order: </span>
                        <span>{supply.minOrder}</span>
                      </div>
                      <p className="text-sm text-gray-600">{supply.description}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactSeller(supply.id)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        size="sm"
                        onClick={() => handleAddToCart(supply.id)}
                        disabled={!supply.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View More Supplies</Button>
            </div>
          </TabsContent>
          
          {/* Livestock Tab */}
          <TabsContent value="livestock" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {livestock.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
                        onClick={() => toggleSaveItem(item.id)}
                      >
                        <BookmarkIcon className={`h-5 w-5 ${savedItems.includes(item.id) ? 'text-[#ea384c] fill-[#ea384c]' : ''}`} />
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-1.5 flex justify-between items-center">
                        <span className="font-bold">{item.price}</span>
                        <Badge className={
                          item.availability === 'Weekly' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                        }>
                          {item.availability}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        {item.seller}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <div className="flex justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Tags className="h-4 w-4 text-gray-500" />
                          <span>Breed: {item.breed}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <div className="text-sm mb-3">
                        <span className="text-gray-500">Minimum Order: </span>
                        <span>{item.minOrder}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactSeller(item.id)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        size="sm"
                        onClick={() => handleAddToCart(item.id)}
                      >
                        Book Order
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View More Livestock</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Marketplace;

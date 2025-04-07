
import React from 'react';
import { ShoppingCart, Grid, ListFilter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  location: string;
  seller: string;
  rating: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Layer Chicken Feed - Premium Quality',
    category: 'Feed',
    price: '₹1,800 per 50kg',
    location: 'Pune, Maharashtra',
    seller: 'AgriFeeds Ltd',
    rating: 4.5,
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Automatic Poultry Drinkers',
    category: 'Equipment',
    price: '₹2,500 per set',
    location: 'Chennai, Tamil Nadu',
    seller: 'PoultryTech Solutions',
    rating: 4.2,
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Day-Old Broiler Chicks',
    category: 'Live Birds',
    price: '₹45 per chick',
    location: 'Hyderabad, Telangana',
    seller: 'National Hatcheries',
    rating: 4.8,
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Poultry Health Supplements',
    category: 'Medicine',
    price: '₹950 per kg',
    location: 'Coimbatore, Tamil Nadu',
    seller: 'VetCare India',
    rating: 4.0,
    image: '/placeholder.svg'
  },
];

const MarketplaceListing: React.FC = () => {
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
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="outline" className="text-sm">All Categories</Button>
            <Button variant="outline" className="text-sm">Feed</Button>
            <Button variant="outline" className="text-sm">Equipment</Button>
            <Button variant="outline" className="text-sm">Live Birds</Button>
            <Button variant="outline" className="text-sm">Medicine</Button>
            <Button variant="outline" className="text-sm">Services</Button>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Grid className="h-4 w-4" />
                <span>View</span>
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              24 products found
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-40 object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                    target.className = "w-full h-40 object-contain bg-gray-100 p-4";
                  }}
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-medium mb-1 truncate" title={product.name}>{product.name}</h3>
                  <p className="text-poultry-primary font-medium">{product.price}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{product.location}</span>
                    <span className="mx-1">•</span>
                    <span>{product.seller}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-xs">{product.rating}</span>
                    </div>
                    <Button size="sm" className="bg-poultry-primary hover:bg-poultry-primary/90">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceListing;

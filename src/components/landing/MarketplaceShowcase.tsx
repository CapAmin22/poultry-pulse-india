import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, ChevronRight, Tag, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const MarketplaceShowcase: React.FC = () => {
  const navigate = useNavigate();
  const marketplaceItems = [{
    name: "Premium Layer Farming Equipment",
    price: "₹12,500",
    description: "Complete setup for layer poultry farming with automated feeding and watering systems",
    image: "https://i.pravatar.cc/150?img=1",
    category: "Equipment",
    trending: true
  }, {
    name: "High-Protein Poultry Feed - 50kg",
    price: "₹1,800",
    description: "Premium quality feed with all essential nutrients for optimal bird health and egg production",
    image: "https://i.pravatar.cc/150?img=2",
    category: "Feed",
    trending: false
  }, {
    name: "Advanced Incubators - 500 Egg Capacity",
    price: "₹45,000",
    description: "Fully automated incubator with precise temperature and humidity controls for maximum hatchability",
    image: "https://i.pravatar.cc/150?img=3",
    category: "Equipment",
    trending: true
  }];
  return <section id="marketplace" className="bg-white py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{
        y: 20,
        opacity: 0
      }} whileInView={{
        y: 0,
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-block px-4 py-1 bg-amber-100 rounded-full mb-4">
              <span className="text-amber-600 text-sm font-medium flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" /> Marketplace
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Buy & Sell Everything for Your Poultry Business</h2>
            <p className="text-lg text-gray-600">
              Our dedicated marketplace connects you with trusted suppliers and buyers across India. 
              Find quality equipment, feed, medicine, and more, all in one place with verified sellers and competitive prices.
            </p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <Tag className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Best Prices</h3>
                  <p className="text-sm text-gray-500">Direct from manufacturers and bulk suppliers</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Verified Sellers</h3>
                  <p className="text-sm text-gray-500">All sellers are vetted and verified</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Quick Delivery</h3>
                  <p className="text-sm text-gray-500">Fast shipping across India</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <ShoppingCart className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Sell Your Products</h3>
                  <p className="text-sm text-gray-500">Reach thousands of potential buyers</p>
                </div>
              </div>
            </div>
            
            <Button onClick={() => navigate('/auth')} className="mt-8 bg-amber-500 hover:bg-amber-600">
              Explore Marketplace <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl shadow-lg">
            <div className="relative">
              <div className="absolute -top-6 -right-6 bg-white text-amber-500 font-bold px-4 py-2 rounded-lg shadow-lg">
                5,000+ Products
              </div>
              <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="Marketplace Preview" className="w-full h-auto object-cover rounded-lg shadow-md" />
              <div className="absolute -bottom-6 -left-6 bg-white text-[#ea384c] font-bold px-4 py-2 rounded-lg shadow-lg">
                1,200+ Sellers
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <h3 className="text-2xl font-bold mb-8 text-center">Featured Products</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {marketplaceItems.map((item, index) => <motion.div key={index} initial={{
          y: 20,
          opacity: 0
        }} whileInView={{
          y: 0,
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1,
          duration: 0.6
        }} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                
                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                  {item.category}
                </div>
                {item.trending && <div className="absolute top-3 right-3 bg-[#ea384c] px-2 py-1 rounded-md text-xs font-medium text-white flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> Trending
                  </div>}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className="text-[#ea384c] font-semibold">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <Button variant="outline" onClick={() => navigate('/auth')} className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                  <ExternalLink className="mr-2 h-4 w-4" /> View Details
                </Button>
              </div>
            </motion.div>)}
        </div>
        
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.4,
        duration: 0.6
      }} className="mt-16 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our marketplace with thousands of products and connect directly with suppliers and buyers. 
            Create your free account today and start exploring.
          </p>
          <Button onClick={() => navigate('/auth')} variant="outline" size="lg" className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white">
            Create Free Account
          </Button>
        </motion.div>
      </div>
    </section>;
};
export default MarketplaceShowcase;
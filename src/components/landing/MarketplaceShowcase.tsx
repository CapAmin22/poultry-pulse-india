
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceShowcase: React.FC = () => {
  const navigate = useNavigate();
  
  const marketplaceItems = [
    { 
      name: "Layer Farming Equipment", 
      price: "₹12,500", 
      description: "Complete setup for layer poultry farming with automated systems",
      image: "https://i.pravatar.cc/150?img=1"
    },
    { 
      name: "Quality Feed - 50kg", 
      price: "₹1,800", 
      description: "Premium quality feed with all essential nutrients for healthy birds",
      image: "https://i.pravatar.cc/150?img=2"
    },
    { 
      name: "Incubators - 500 Egg", 
      price: "₹45,000", 
      description: "Fully automated incubator with temperature and humidity controls",
      image: "https://i.pravatar.cc/150?img=3"
    }
  ];
  
  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Marketplace</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Find everything you need for your poultry business in our dedicated marketplace.
              Buy and sell equipment, feed, birds, and more.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/auth')} 
            className="mt-6 md:mt-0 bg-[#ea384c] hover:bg-[#d02f3d]"
          >
            Explore Marketplace <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {marketplaceItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className="text-[#ea384c] font-semibold">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <ExternalLink className="mr-1 h-4 w-4" /> View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Join our marketplace with thousands of products and connect directly with suppliers and buyers.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="outline" 
            className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
          >
            Register to Access Marketplace
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplaceShowcase;

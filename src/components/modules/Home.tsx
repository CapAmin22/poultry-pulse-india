
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatHighlight from '@/components/home/StatHighlight';
import NewsHighlight from '@/components/home/NewsHighlight';
import WeatherSummary from '@/components/home/WeatherSummary';
import { Egg, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Sample news data (this would come from an API in a real application)
const newsHighlights = [
  {
    id: 1,
    title: 'Government Announces New Subsidy for Poultry Farmers',
    summary: 'The Ministry of Agriculture has announced a new subsidy scheme to boost poultry production across India.',
    date: 'Today',
  },
  {
    id: 2,
    title: 'Avian Influenza Alert in Northern States',
    summary: 'Authorities have issued preventive guidelines following reports of avian influenza in neighboring countries.',
    date: 'Yesterday',
  }
];

// Sample weather data (this would come from an API in a real application)
const weatherData = {
  location: 'Delhi NCR',
  temperature: 32,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  alert: 'Heat wave expected next week. Prepare your farms accordingly.'
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#f5565c] to-[#0066b2] p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to 22POULTRY</h1>
            <p className="text-white/90 text-lg">
              Your integrated digital platform for the Indian poultry industry
            </p>
            <div className="flex items-center space-x-2 text-sm font-medium text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>Market insights updated today at 11:30 AM</span>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-2">
              <Button 
                className="bg-white text-[#f5565c] hover:bg-white/90" 
                onClick={() => navigate('/marketplace')}
              >
                Browse Marketplace
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white/20"
                onClick={() => navigate('/network')}
              >
                Connect with Farmers
              </Button>
            </div>
          </div>
          
          <img 
            src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" 
            alt="22POULTRY" 
            className="h-32 w-auto mt-6 lg:mt-0" 
          />
        </div>
        
        <div className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute top-10 right-32 w-6 h-6 rounded-full bg-white/20"></div>
      </motion.div>
      
      {/* Key Stats Section - Simplified */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Market Overview</h2>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <StatHighlight 
            title="Current Egg Price"
            value="₹5.20"
            unit="/piece"
            change={3.5}
            icon={<Egg className="h-5 w-5 text-[#f5565c]" />}
          />
          <StatHighlight 
            title="Broiler Price"
            value="₹112"
            unit="/kg"
            change={-1.8}
            icon={<TrendingUp className="h-5 w-5 text-[#f5565c]" />}
          />
        </motion.div>
      </div>
      
      {/* Quick Access Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/financial')}
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Financial Assistance</h3>
              <p className="text-sm text-gray-500">Explore loans and financial schemes for poultry farmers</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/marketplace')}
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Marketplace</h3>
              <p className="text-sm text-gray-500">Buy and sell poultry equipment and products</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/network')}
          >
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Network</h3>
              <p className="text-sm text-gray-500">Connect with farmers, experts, and industry professionals</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* News and Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-none shadow-md">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-xl flex items-center">
                Latest Industry News
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Live</span>
              </CardTitle>
              <CardDescription>Stay updated with the latest happenings in the poultry industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {newsHighlights.map((news) => (
                <NewsHighlight key={news.id} {...news} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <WeatherSummary weather={weatherData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

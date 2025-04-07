
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatHighlight from '@/components/home/StatHighlight';
import NewsHighlight from '@/components/home/NewsHighlight';
import WeatherSummary from '@/components/home/WeatherSummary';
import WelcomeHero from '@/components/home/WelcomeHero';
import { Egg, BarChart3, Database } from 'lucide-react';
import { motion } from 'framer-motion';

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
  alert: 'Heat wave expected next week. Prepare your farms accordingly.'
};

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeHero />
      
      {/* Key Stats Highlights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatHighlight 
          title="Current Egg Price"
          value="₹5.20"
          unit="/piece"
          change={3.5}
          icon={<Egg className="h-5 w-5 text-poultry-primary" />}
        />
        <StatHighlight 
          title="Broiler Price"
          value="₹112"
          unit="/kg"
          change={-1.8}
          icon={<BarChart3 className="h-5 w-5 text-poultry-primary" />}
        />
        <StatHighlight 
          title="Feed Price Index"
          value="124.5"
          unit=""
          change={5.2}
          icon={<Database className="h-5 w-5 text-poultry-primary" />}
        />
      </motion.div>
      
      {/* News and Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                Latest Industry News
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">Live</span>
              </CardTitle>
              <CardDescription>Stay updated with the latest happenings in the poultry industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {newsHighlights.map((news) => (
                <NewsHighlight key={news.id} {...news} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <WeatherSummary weather={weatherData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

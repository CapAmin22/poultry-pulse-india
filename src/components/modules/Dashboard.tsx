
import React from 'react';
import { BarChart3, Egg, ChevronRight, CloudSun, Users, Database, Info } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import PriceChart from '../dashboard/PriceChart';
import FeedRatioChart from '../dashboard/FeedRatioChart';
import ProductionStats from '../dashboard/ProductionStats';
import NewsCard from '../dashboard/NewsCard';
import WeatherCard from '../dashboard/WeatherCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Sample data - this would be replaced with actual API data
const newsData = [
  {
    id: 1,
    title: 'Government Announces New Subsidy for Poultry Farmers',
    summary: 'The Ministry of Agriculture has announced a new subsidy scheme to boost poultry production across India.',
    source: 'The Economic Times',
    date: 'Today',
    url: '#',
  },
  {
    id: 2,
    title: 'Avian Influenza Alert in Northern States',
    summary: 'Authorities have issued preventive guidelines following reports of avian influenza in neighboring countries.',
    source: 'India Today',
    date: 'Yesterday',
    url: '#',
  },
  {
    id: 3,
    title: 'Export of Indian Poultry Products Sees 15% Growth',
    summary: 'Indian poultry exports reached a new high with 15% year-on-year growth in the last quarter.',
    source: 'Business Standard',
    date: '2 days ago',
    url: '#',
  },
];

const weatherData = {
  location: 'Delhi NCR',
  temperature: 32,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: 'Today', temp: 32, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', temp: 33, condition: 'Sunny' },
    { day: 'Day After', temp: 30, condition: 'Light Rain' },
  ],
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Comprehensive data insights for poultry stakeholders</p>
        </div>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 mr-2" /> Data Sources
          </Button>
          <Button size="sm">
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Stats Row */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard 
          title="Current Egg Price" 
          value="₹5.20 / piece" 
          change={3.5} 
          icon={<Egg className="h-4 w-4 text-[#ea384c]" />} 
        />
        <StatCard 
          title="Broiler Price" 
          value="₹112 / kg" 
          change={-1.8} 
          icon={<BarChart3 className="h-4 w-4 text-[#ea384c]" />} 
        />
        <StatCard 
          title="National Production" 
          value="98.3 million eggs/day" 
          change={2.1} 
        />
        <StatCard 
          title="Feed Price Index" 
          value="124.5" 
          change={5.2} 
        />
      </motion.div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="market">
        <TabsList className="mb-4">
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="production">Production Data</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts & Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="space-y-6">
          {/* Charts Row */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <PriceChart />
            <FeedRatioChart />
          </motion.div>
          
          {/* Module Highlights */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-5">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <Database className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Financial Assistance</h2>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                3 new loan schemes available for poultry farmers with subsidized interest rates.
              </p>
              <a href="/financial" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 hover:underline">
                Explore Options <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Card>
            
            <Card className="p-5">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <Users className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Networking</h2>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Connect with 1,200+ poultry professionals across India. 5 local events this month.
              </p>
              <a href="/network" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 hover:underline">
                Join Community <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Card>
            
            <Card className="p-5">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <CloudSun className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Weather Alert</h2>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Heatwave expected in Northern India next week. Prepare your farms accordingly.
              </p>
              <a href="/news" className="flex items-center text-sm text-[#ea384c] font-medium mt-4 hover:underline">
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="production">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <ProductionStats />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="forecasts">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card className="p-5">
              <h3 className="font-medium text-lg mb-3">Market Forecast (Next Quarter)</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Egg Price Trend</p>
                  <p className="font-medium">Projected to increase by 5-7%</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Broiler Price Trend</p>
                  <p className="font-medium">Expected to remain stable (±2%)</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Feed Cost Projection</p>
                  <p className="font-medium">Likely to increase by 8-10%</p>
                  <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-5">
              <h3 className="font-medium text-lg mb-3">Industry Analysts' Reports</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                  <p className="font-medium">CLFMA Annual Report 2023</p>
                  <p className="text-sm text-gray-600">Comprehensive analysis of feed industry trends</p>
                  <a href="#" className="text-xs text-[#ea384c] hover:underline">Download PDF</a>
                </div>
                <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                  <p className="font-medium">Poultry Federation Market Outlook</p>
                  <p className="text-sm text-gray-600">Future projections for the next 2 years</p>
                  <a href="#" className="text-xs text-[#ea384c] hover:underline">Download PDF</a>
                </div>
                <div className="border-l-4 border-[#ea384c] pl-3 py-1">
                  <p className="font-medium">ICAR Poultry Technical Bulletin</p>
                  <p className="text-sm text-gray-600">Latest research findings and advisories</p>
                  <a href="#" className="text-xs text-[#ea384c] hover:underline">Download PDF</a>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      {/* News and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-4">
          <NewsCard news={newsData} />
        </div>
        <div className="lg:col-span-3">
          <WeatherCard weather={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

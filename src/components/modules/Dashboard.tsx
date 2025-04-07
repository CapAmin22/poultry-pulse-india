
import React from 'react';
import { BarChart3, Egg, ChevronRight, CloudSun, Users, Database } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import PriceChart from '../dashboard/PriceChart';
import FeedRatioChart from '../dashboard/FeedRatioChart';
import NewsCard from '../dashboard/NewsCard';
import WeatherCard from '../dashboard/WeatherCard';

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
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Current Egg Price" 
          value="₹5.20 / piece" 
          change={3.5} 
          icon={<Egg className="h-4 w-4 text-poultry-primary" />} 
        />
        <StatCard 
          title="Broiler Price" 
          value="₹112 / kg" 
          change={-1.8} 
          icon={<BarChart3 className="h-4 w-4 text-poultry-primary" />} 
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
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart />
        <FeedRatioChart />
      </div>
      
      {/* Module Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="module-card">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-poultry-primary/10 mr-3">
              <Database className="h-5 w-5 text-poultry-primary" />
            </div>
            <h2 className="text-lg font-medium">Financial Assistance</h2>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            3 new loan schemes available for poultry farmers with subsidized interest rates.
          </p>
          <a href="/financial" className="flex items-center text-sm text-poultry-primary font-medium mt-4 hover:underline">
            Explore Options <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        <div className="module-card">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-poultry-primary/10 mr-3">
              <Users className="h-5 w-5 text-poultry-primary" />
            </div>
            <h2 className="text-lg font-medium">Networking</h2>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Connect with 1,200+ poultry professionals across India. 5 local events this month.
          </p>
          <a href="/network" className="flex items-center text-sm text-poultry-primary font-medium mt-4 hover:underline">
            Join Community <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        <div className="module-card">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-poultry-primary/10 mr-3">
              <CloudSun className="h-5 w-5 text-poultry-primary" />
            </div>
            <h2 className="text-lg font-medium">Weather Alert</h2>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Heatwave expected in Northern India next week. Prepare your farms accordingly.
          </p>
          <a href="/news" className="flex items-center text-sm text-poultry-primary font-medium mt-4 hover:underline">
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
      
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

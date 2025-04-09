
import React from 'react';
import { BarChart3, Users, Database, Info, ChevronRight, CloudSun, BookOpen, Newspaper } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import PriceChart from '../dashboard/PriceChart';
import FeedRatioChart from '../dashboard/FeedRatioChart';
import NewsCard from '../dashboard/NewsCard';
import WeatherCard from '../dashboard/WeatherCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

// Sample data for all stakeholders (not personal farm data)
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
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}</h1>
          <p className="text-gray-500">National Poultry Data & Insights</p>
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
      
      {/* National Stats Row */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard 
          title="National Average Egg Price" 
          value="₹5.20 / piece" 
          change={3.5} 
          className="bg-white rounded-lg border p-4 shadow-sm"
        />
        <StatCard 
          title="National Broiler Price" 
          value="₹112 / kg" 
          change={-1.8} 
          className="bg-white rounded-lg border p-4 shadow-sm"
        />
        <StatCard 
          title="Total Production Volume" 
          value="98.3 million eggs/day" 
          change={2.1}
          className="bg-white rounded-lg border p-4 shadow-sm" 
        />
        <StatCard 
          title="Poultry Employment" 
          value="5.2 million jobs" 
          change={1.6}
          className="bg-white rounded-lg border p-4 shadow-sm" 
        />
      </motion.div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="market">
        <TabsList className="mb-4">
          <TabsTrigger value="market">Market Trends</TabsTrigger>
          <TabsTrigger value="industry">Industry Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="space-y-6">
          {/* Charts Row */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="p-5 shadow-sm">
              <h3 className="text-lg font-medium mb-4">National Egg Price Trends (12 Months)</h3>
              <PriceChart />
            </Card>
            <Card className="p-5 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Feed-to-Meat Price Ratio</h3>
              <FeedRatioChart />
            </Card>
          </motion.div>
          
          {/* National Stats Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-50 mr-3">
                  <Database className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-medium">Domestic Consumption</h2>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Eggs per capita (yearly)</span>
                    <span className="font-medium">68</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chicken meat per capita</span>
                    <span className="font-medium">3.7 kg</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-50 mr-3">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <h2 className="text-lg font-medium">Industry Size</h2>
              </div>
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Farm Operations</span>
                    <span className="font-medium">160,000+</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Annual Revenue</span>
                    <span className="font-medium">₹95,000 Cr</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full mt-1">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-amber-50 mr-3">
                  <CloudSun className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-lg font-medium">Weather Impact Alert</h2>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Heat wave expected in Northern India next week. Poultry farmers should take precautionary measures to ensure bird health and productivity.
              </p>
              <a href="/news" className="flex items-center text-sm text-blue-600 font-medium mt-4 hover:underline">
                View Advisory <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="industry">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5 shadow-sm">
                <h3 className="font-medium text-lg mb-3">Regional Production Distribution</h3>
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Southern Region</span>
                      <span className="font-medium">40.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-[#ea384c] h-2 rounded-full" style={{ width: '40.2%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Northern Region</span>
                      <span className="font-medium">26.4%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '26.4%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Eastern Region</span>
                      <span className="font-medium">18.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '18.7%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Western Region</span>
                      <span className="font-medium">14.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '14.7%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-5 shadow-sm">
                <h3 className="font-medium text-lg mb-3">Key Industry Statistics</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Annual Egg Production</p>
                    <p className="text-xl font-semibold">120 billion</p>
                    <p className="text-xs text-green-600">↑ 4.2% YoY</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Broiler Production</p>
                    <p className="text-xl font-semibold">5.2 million tons</p>
                    <p className="text-xs text-green-600">↑ 3.8% YoY</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Export Value</p>
                    <p className="text-xl font-semibold">₹720 Crore</p>
                    <p className="text-xs text-green-600">↑ 12.5% YoY</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Feed Production</p>
                    <p className="text-xl font-semibold">18.4 million tons</p>
                    <p className="text-xs text-green-600">↑ 2.1% YoY</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card className="p-5 shadow-sm">
              <h3 className="font-medium text-lg mb-3">Industry Growth Projection (5 Years)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="border-l-4 border-[#ea384c] pl-3 py-2">
                  <p className="font-medium">Consumption Growth</p>
                  <p className="text-2xl font-bold">6.8%</p>
                  <p className="text-sm text-gray-600">Rising protein demand and growing middle class</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <p className="font-medium">Production Capacity</p>
                  <p className="text-2xl font-bold">7.2%</p>
                  <p className="text-sm text-gray-600">Increasing farm sizes and modernization</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3 py-2">
                  <p className="font-medium">Export Potential</p>
                  <p className="text-2xl font-bold">11.4%</p>
                  <p className="text-sm text-gray-600">Growing international market demand</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="resources">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <Database className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Financial Resources</h2>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">NABARD Poultry Loan Scheme</p>
                  <p className="text-sm text-gray-600 mt-1">Subsidized interest rates for poultry farmers</p>
                  <a href="/financial" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Learn More →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Poultry Venture Capital Fund</p>
                  <p className="text-sm text-gray-600 mt-1">Funding for farm expansion and modernization</p>
                  <a href="/financial" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Learn More →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Rural Insurance Programs</p>
                  <p className="text-sm text-gray-600 mt-1">Protecting your farm against risks</p>
                  <a href="/financial" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Learn More →</a>
                </li>
              </ul>
            </Card>
            
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <BookOpen className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Training Resources</h2>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Disease Management Webinar</p>
                  <p className="text-sm text-gray-600 mt-1">Learn best practices from experts</p>
                  <p className="text-xs text-gray-500 mt-1">June 15, 2025 • Online</p>
                  <a href="/training" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Register →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Feed Optimization Workshop</p>
                  <p className="text-sm text-gray-600 mt-1">Increase efficiency and reduce costs</p>
                  <p className="text-xs text-gray-500 mt-1">July 8, 2025 • Delhi</p>
                  <a href="/training" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Register →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Farm Management Courses</p>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive training programs</p>
                  <p className="text-xs text-gray-500 mt-1">Online & In-person options</p>
                  <a href="/training" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">View Courses →</a>
                </li>
              </ul>
            </Card>
            
            <Card className="p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-[#ea384c]/10 mr-3">
                  <Newspaper className="h-5 w-5 text-[#ea384c]" />
                </div>
                <h2 className="text-lg font-medium">Latest Publications</h2>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Poultry Market Report 2025</p>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive analysis of trends</p>
                  <p className="text-xs text-gray-500 mt-1">Published by CLFMA</p>
                  <a href="/news" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Download PDF →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Biosecurity Best Practices</p>
                  <p className="text-sm text-gray-600 mt-1">Practical guide for farm management</p>
                  <p className="text-xs text-gray-500 mt-1">By Poultry Federation</p>
                  <a href="/news" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Download PDF →</a>
                </li>
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Export Market Opportunities</p>
                  <p className="text-sm text-gray-600 mt-1">Analysis of international markets</p>
                  <p className="text-xs text-gray-500 mt-1">By APEDA</p>
                  <a href="/news" className="text-sm text-[#ea384c] hover:underline mt-2 inline-block">Download PDF →</a>
                </li>
              </ul>
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


import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Search, ThumbsUp, MessageCircle, Share2, BookmarkPlus, AlertCircle, ExternalLink } from 'lucide-react';
import WeatherCard from '@/components/dashboard/WeatherCard';
import { motion } from 'framer-motion';

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Sample weather data for the WeatherCard component
  const weatherData = {
    current: {
      temp_c: 28,
      condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
      wind_kph: 15,
      humidity: 65,
      precip_mm: 0,
    },
    forecast: {
      forecastday: [
        {
          date: '2025-04-08',
          day: {
            maxtemp_c: 30,
            mintemp_c: 22,
            condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
          },
        },
        {
          date: '2025-04-09',
          day: {
            maxtemp_c: 29,
            mintemp_c: 21,
            condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
          },
        },
        {
          date: '2025-04-10',
          day: {
            maxtemp_c: 28,
            mintemp_c: 20,
            condition: { text: 'Moderate rain', icon: '//cdn.weatherapi.com/weather/64x64/day/302.png' },
          },
        },
      ],
    },
    location: {
      name: 'Bengaluru',
      region: 'Karnataka',
      country: 'India',
    },
  };

  // Sample news articles
  const newsArticles = [
    {
      id: 1,
      title: 'New Poultry Feed Formulation Increases Egg Production by 15%',
      description: 'Research shows that a new feed formulation with enhanced proteins and minerals is helping farmers significantly boost egg production.',
      image: 'https://i.pravatar.cc/150?img=1',
      source: 'Poultry World',
      date: '2025-04-07',
      category: 'research',
      likes: 45,
      comments: 12,
    },
    {
      id: 2,
      title: 'Government Announces New Subsidies for Small Poultry Farmers',
      description: 'The Ministry of Agriculture has announced a new subsidy program aimed at supporting small-scale poultry farmers with equipment and training.',
      image: 'https://i.pravatar.cc/150?img=2',
      source: 'Rural Times',
      date: '2025-04-06',
      category: 'policy',
      likes: 87,
      comments: 34,
    },
    {
      id: 3,
      title: 'Prevention Strategies for Common Poultry Diseases This Season',
      description: 'Experts share important preventative measures farmers should take now to protect their flocks from seasonal disease outbreaks.',
      image: 'https://i.pravatar.cc/150?img=3',
      source: 'Veterinary Journal',
      date: '2025-04-05',
      category: 'health',
      likes: 62,
      comments: 18,
    },
    {
      id: 4,
      title: 'Market Analysis: Poultry Prices Expected to Rise in Coming Months',
      description: 'Economic analysts predict a significant increase in poultry prices due to rising feed costs and increased consumer demand.',
      image: 'https://i.pravatar.cc/150?img=4',
      source: 'Market Insights',
      date: '2025-04-04',
      category: 'market',
      likes: 53,
      comments: 21,
    },
    {
      id: 5,
      title: 'New Mobile App Helps Farmers Track Poultry Health and Production',
      description: 'A new smartphone application is helping farmers monitor their flock health, feeding patterns, and production metrics in real-time.',
      image: 'https://i.pravatar.cc/150?img=5',
      source: 'Tech Farm Today',
      date: '2025-04-03',
      category: 'technology',
      likes: 76,
      comments: 29,
    },
  ];

  // Filter news articles based on active tab
  const filteredArticles = activeTab === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeTab);

  // Weather alerts data
  const weatherAlerts = [
    {
      id: 1,
      title: 'Heat Wave Warning',
      description: 'Extreme temperatures expected for the next 3 days. Take precautions to keep your poultry cool.',
      severity: 'high',
    },
    {
      id: 2,
      title: 'Heavy Rain Alert',
      description: 'Heavy rainfall predicted in eastern regions starting tomorrow evening.',
      severity: 'medium',
    }
  ];

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>News & Updates</CardTitle>
                    <CardDescription>Latest news and updates from the poultry industry</CardDescription>
                  </div>
                  <div className="w-full md:w-64">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search news..." className="pl-8" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                    <TabsTrigger value="policy">Policy</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="technology">Tech</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab} className="space-y-4 mt-6">
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((article) => (
                        <Card key={article.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/4 h-48 md:h-auto">
                              <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-full md:w-3/4 p-4 space-y-3">
                              <div>
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 mb-2 capitalize">{article.category}</span>
                                <h3 className="text-xl font-bold">{article.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                                  <span>{article.source}</span>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    <CalendarDays className="h-4 w-4 mr-1" />
                                    {article.date}
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600">{article.description}</p>
                              <div className="flex flex-wrap items-center justify-between pt-2">
                                <div className="flex space-x-4">
                                  <Button variant="ghost" size="sm" className="flex items-center">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    {article.likes}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {article.comments}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="flex items-center">
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Share
                                  </Button>
                                </div>
                                <Button variant="outline" size="sm" className="flex items-center">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  Read More
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <p>No news articles found for this category.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredArticles.length} of {newsArticles.length} news items
                </div>
                <Button variant="outline" size="sm">
                  View All News
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar with Weather and Alerts */}
          <div className="w-full md:w-80 space-y-6">
            {/* Weather Card */}
            <WeatherCard weather={weatherData} className="h-auto" />
            
            {/* Weather Alerts */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  Weather Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weatherAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'high' ? 'border-red-200 bg-red-50' : 
                      alert.severity === 'medium' ? 'border-amber-200 bg-amber-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <h4 className={`font-medium ${
                      alert.severity === 'high' ? 'text-red-700' : 
                      alert.severity === 'medium' ? 'text-amber-700' : 
                      'text-blue-700'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className="text-sm mt-1">{alert.description}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
            
            {/* Related Resources */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Related Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Weather Impact on Poultry
                  </Button>
                  <Button variant="outline" className="justify-start" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Heat Stress Management Guide
                  </Button>
                  <Button variant="outline" className="justify-start" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Cold Weather Preparation Tips
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NewsPage;

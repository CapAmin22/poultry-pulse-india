
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import WeatherCard from '@/components/dashboard/WeatherCard';
import NewsCard, { NewsArticle } from '@/components/news/NewsCard';
import WeatherAlertCard, { WeatherAlert } from '@/components/news/WeatherAlertCard';
import RelatedResourcesCard from '@/components/news/RelatedResourcesCard';
import NewsFilters, { NewsCategory } from '@/components/news/NewsFilters';

const NewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewsCategory>('all');

  // Sample weather data formatted to match the WeatherData type from WeatherCard
  const weatherData = {
    location: 'Bengaluru, Karnataka',
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 15,
    forecast: [{
      day: 'Today',
      temp: 28,
      condition: 'Sunny'
    }, {
      day: 'Tomorrow',
      temp: 29,
      condition: 'Partly cloudy'
    }, {
      day: 'Wed',
      temp: 28,
      condition: 'Moderate rain'
    }]
  };

  // Sample news articles
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: 'New Poultry Feed Formulation Increases Egg Production by 15%',
      description: 'Research shows that a new feed formulation with enhanced proteins and minerals is helping farmers significantly boost egg production.',
      image: 'https://i.pravatar.cc/150?img=1',
      source: 'Poultry World',
      date: '2025-04-07',
      category: 'research',
      likes: 45,
      comments: 12
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
      comments: 34
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
      comments: 18
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
      comments: 21
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
      comments: 29
    }
  ];

  // Filter news articles based on active tab
  const filteredArticles = activeTab === 'all' ? newsArticles : newsArticles.filter(article => article.category === activeTab);

  // Weather alerts data
  const weatherAlerts: WeatherAlert[] = [
    {
      id: 1,
      title: 'Heat Wave Warning',
      description: 'Extreme temperatures expected for the next 3 days. Take precautions to keep your poultry cool.',
      severity: 'high'
    },
    {
      id: 2,
      title: 'Heavy Rain Alert',
      description: 'Heavy rainfall predicted in eastern regions starting tomorrow evening.',
      severity: 'medium'
    }
  ];

  // Related resources
  const relatedResources = [
    { id: 1, title: 'Weather Impact on Poultry' },
    { id: 2, title: 'Heat Stress Management Guide' },
    { id: 3, title: 'Cold Weather Preparation Tips' }
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
                <NewsFilters activeTab={activeTab} onTabChange={setActiveTab}>
                  <TabsContent value={activeTab} className="space-y-4 mt-6">
                    {filteredArticles.length > 0 ? filteredArticles.map(article => (
                      <NewsCard key={article.id} article={article} />
                    )) : (
                      <div className="text-center py-10 text-gray-500">
                        <p>No news articles found for this category.</p>
                      </div>
                    )}
                  </TabsContent>
                </NewsFilters>
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
            <WeatherCard weather={weatherData} />
            
            {/* Weather Alerts */}
            <WeatherAlertCard alerts={weatherAlerts} onViewAllClick={() => console.log('View all alerts clicked')} />
            
            {/* Related Resources */}
            <RelatedResourcesCard resources={relatedResources} />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NewsPage;

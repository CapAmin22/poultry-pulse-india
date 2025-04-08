
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { BookmarkIcon, Calendar, Clock, CloudRain, Droplets, ExternalLink, Eye, Filter, Newspaper, Search, Share2, Sun, ThermometerIcon, ThermometerSnowflake, Umbrella, User, Wind } from 'lucide-react';
import WeatherCard from '@/components/dashboard/WeatherCard';
import { toast } from '@/hooks/use-toast';

// Sample news data
const newsArticles = [
  {
    id: 1,
    title: "New Government Policy to Boost Poultry Export",
    source: "Poultry Times",
    category: "Policy",
    date: "April 6, 2025",
    readTime: "4 min read",
    image: "https://i.pravatar.cc/300?img=1",
    summary: "The Ministry of Agriculture announced a new policy framework aimed at boosting poultry exports by providing incentives to farmers and exporters.",
    views: 1248,
    isSaved: false
  },
  {
    id: 2,
    title: "Breakthrough in Poultry Disease Prevention",
    source: "Veterinary Science Journal",
    category: "Research",
    date: "April 4, 2025",
    readTime: "6 min read",
    image: "https://i.pravatar.cc/300?img=2",
    summary: "Scientists have developed a new vaccine that provides broader protection against multiple strains of avian influenza, potentially revolutionizing disease management in poultry farming.",
    views: 956,
    isSaved: true
  },
  {
    id: 3,
    title: "Egg Prices Expected to Rise Due to Feed Costs",
    source: "Agricultural Economics Report",
    category: "Market",
    date: "April 2, 2025",
    readTime: "3 min read",
    image: "https://i.pravatar.cc/300?img=3",
    summary: "Analysts predict a 10-15% increase in egg prices in the coming months due to rising feed costs and supply chain disruptions affecting the poultry industry.",
    views: 2100,
    isSaved: false
  },
  {
    id: 4,
    title: "Sustainable Poultry Farming Practices Gaining Traction",
    source: "Environment Today",
    category: "Sustainability",
    date: "March 30, 2025",
    readTime: "5 min read",
    image: "https://i.pravatar.cc/300?img=4",
    summary: "More poultry farmers are adopting sustainable practices like solar power, water recycling, and organic waste management to reduce environmental impact and meet consumer demands.",
    views: 1587,
    isSaved: false
  },
  {
    id: 5,
    title: "International Poultry Expo Announces Dates for 2026",
    source: "Industry Events Weekly",
    category: "Event",
    date: "March 28, 2025",
    readTime: "2 min read",
    image: "https://i.pravatar.cc/300?img=5",
    summary: "The International Poultry Expo has announced its 2026 dates and will feature a special focus on technology innovation and sustainability in poultry production.",
    views: 872,
    isSaved: false
  }
];

// Sample market updates data
const marketUpdates = [
  {
    id: 1,
    product: "Broiler Chicken",
    price: "₹110/kg",
    change: "+2.5%",
    trend: "up",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 2,
    product: "Eggs (Brown)",
    price: "₹75/dozen",
    change: "+5.6%",
    trend: "up",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 3,
    product: "Eggs (White)",
    price: "₹70/dozen",
    change: "+4.8%",
    trend: "up",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 4,
    product: "Layer Feed",
    price: "₹2,850/quintal",
    change: "+1.2%",
    trend: "up",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 5,
    product: "Broiler Feed",
    price: "₹3,100/quintal",
    change: "+0.8%",
    trend: "up",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 6,
    product: "Day-Old Chicks (Broiler)",
    price: "₹42/chick",
    change: "-1.5%",
    trend: "down",
    location: "National Average",
    date: "April 8, 2025"
  },
  {
    id: 7,
    product: "Day-Old Chicks (Layer)",
    price: "₹38/chick",
    change: "-0.5%",
    trend: "down",
    location: "National Average",
    date: "April 8, 2025"
  }
];

// Sample weather forecast data
const forecasts = [
  {
    day: "Tomorrow",
    date: "April 9",
    high: 32,
    low: 24,
    condition: "Partly Cloudy",
    precipitation: "10%",
    humidity: "65%",
    wind: "12 km/h",
    icon: <Sun className="h-8 w-8 text-amber-500" />
  },
  {
    day: "Wednesday",
    date: "April 10",
    high: 33,
    low: 25,
    condition: "Sunny",
    precipitation: "0%",
    humidity: "60%",
    wind: "10 km/h",
    icon: <Sun className="h-8 w-8 text-amber-500" />
  },
  {
    day: "Thursday",
    date: "April 11",
    high: 30,
    low: 23,
    condition: "Thunderstorms",
    precipitation: "70%",
    humidity: "75%",
    wind: "18 km/h",
    icon: <CloudRain className="h-8 w-8 text-gray-500" />
  },
  {
    day: "Friday",
    date: "April 12",
    high: 28,
    low: 22,
    condition: "Rain",
    precipitation: "80%",
    humidity: "80%",
    wind: "15 km/h",
    icon: <Umbrella className="h-8 w-8 text-blue-500" />
  },
  {
    day: "Saturday",
    date: "April 13",
    high: 29,
    low: 23,
    condition: "Partly Cloudy",
    precipitation: "20%",
    humidity: "70%",
    wind: "14 km/h",
    icon: <Sun className="h-8 w-8 text-amber-500" />
  }
];

// Sample weather alerts
const weatherAlerts = [
  {
    id: 1,
    type: "Heat Wave",
    regions: ["Maharashtra", "Gujarat", "Rajasthan"],
    severity: "Moderate",
    details: "Temperatures expected to rise 3-5°C above normal for the next 5 days.",
    recommendations: "Ensure adequate ventilation and cooling in poultry houses. Increase water availability.",
    date: "April 8-13, 2025"
  },
  {
    id: 2,
    type: "Heavy Rainfall",
    regions: ["Kerala", "Karnataka"],
    severity: "High",
    details: "Heavy rainfall expected with potential for localized flooding in low-lying areas.",
    recommendations: "Secure poultry houses against water ingress. Ensure proper drainage systems are functional.",
    date: "April 9-11, 2025"
  }
];

const News: React.FC = () => {
  const [savedArticles, setSavedArticles] = useState<number[]>([2]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('New Delhi');
  
  const toggleSaveArticle = (articleId: number) => {
    if (savedArticles.includes(articleId)) {
      setSavedArticles(savedArticles.filter(id => id !== articleId));
      toast({
        title: "Article removed from saved items",
      });
    } else {
      setSavedArticles([...savedArticles, articleId]);
      toast({
        title: "Article saved",
        description: "You can find this article in your saved items.",
      });
    }
  };
  
  const handleShareArticle = (articleId: number) => {
    toast({
      title: "Share options",
      description: "Sharing options have been opened.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">News & Weather</h1>
          <p className="text-gray-500 mt-1">
            Stay updated with the latest poultry industry news and weather forecasts
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for news articles..." 
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" />
            Filter Articles
          </Button>
        </div>
        
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="news" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Newspaper className="h-4 w-4 mr-2 hidden sm:block" />
              News
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Calendar className="h-4 w-4 mr-2 hidden sm:block" />
              Market Updates
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <CloudRain className="h-4 w-4 mr-2 hidden sm:block" />
              Weather
            </TabsTrigger>
          </TabsList>
          
          {/* News Tab */}
          <TabsContent value="news" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {newsArticles.map((article) => {
                const isSaved = savedArticles.includes(article.id);
                
                return (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-3/4">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{article.title}</CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-2">
                                  <span>{article.source}</span>
                                  <span>•</span>
                                  <span>{article.date}</span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {article.readTime}
                                  </span>
                                </CardDescription>
                              </div>
                              <Badge className={
                                article.category === 'Policy' 
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                                  : article.category === 'Research'
                                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                  : article.category === 'Market'
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                  : article.category === 'Sustainability'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                              }>
                                {article.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-gray-600">{article.summary}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{article.views} views</span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleShareArticle(article.id)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                              <Button 
                                variant={isSaved ? "default" : "outline"}
                                size="sm"
                                className={isSaved ? "bg-[#ea384c] hover:bg-[#d52f41]" : ""}
                                onClick={() => toggleSaveArticle(article.id)}
                              >
                                <BookmarkIcon className="h-4 w-4 mr-2" />
                                {isSaved ? 'Saved' : 'Save'}
                              </Button>
                              <Button 
                                className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                                size="sm"
                              >
                                Read Full Article
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Load More News</Button>
            </div>
          </TabsContent>
          
          {/* Market Updates Tab */}
          <TabsContent value="market" className="mt-6 space-y-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Poultry Market Price Updates</CardTitle>
                    <CardDescription>
                      Latest market prices as of April 8, 2025
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Download Price Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Change</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Location</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketUpdates.map((item, index) => (
                        <tr 
                          key={item.id} 
                          className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        >
                          <td className="px-4 py-3 font-medium">{item.product}</td>
                          <td className="px-4 py-3">{item.price}</td>
                          <td className={`px-4 py-3 ${
                            item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change}
                          </td>
                          <td className="px-4 py-3">{item.location}</td>
                          <td className="px-4 py-3">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-md">
                  <h3 className="font-semibold text-lg mb-2">Market Analysis</h3>
                  <p className="text-sm text-gray-700">
                    Poultry prices continue to show an upward trend due to increased demand for protein-rich foods 
                    and a slight reduction in supply. Egg prices have risen more significantly than meat, 
                    reflecting changing consumer preferences. Feed prices also show an upward trajectory due to 
                    higher input costs, particularly for soya and maize. Day-old chick prices have decreased 
                    slightly, potentially indicating future production increases.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Regional Price Variations</CardTitle>
                <CardDescription>
                  Price differences across major poultry markets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* This would typically contain a chart showing regional price variations */}
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <p className="text-gray-500">Regional price comparison chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Weather Tab */}
          <TabsContent value="weather" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WeatherCard />
                
                <Card className="mt-6 border-none shadow-md">
                  <CardHeader>
                    <CardTitle>5-Day Weather Forecast</CardTitle>
                    <CardDescription>
                      Forecast for {selectedLocation}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {forecasts.map((forecast, index) => (
                        <div 
                          key={index}
                          className="bg-white rounded-lg border p-4 text-center flex flex-col items-center"
                        >
                          <p className="font-semibold">{forecast.day}</p>
                          <p className="text-sm text-gray-500">{forecast.date}</p>
                          <div className="my-4">
                            {forecast.icon}
                          </div>
                          <p className="font-bold text-lg">
                            {forecast.high}°C <span className="font-normal text-gray-500">/ {forecast.low}°C</span>
                          </p>
                          <p className="text-sm">{forecast.condition}</p>
                          <div className="mt-3 w-full grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div className="flex items-center justify-center gap-1">
                              <Umbrella className="h-3 w-3" />
                              <span>{forecast.precipitation}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Wind className="h-3 w-3" />
                              <span>{forecast.wind}</span>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                              <Droplets className="h-3 w-3" />
                              <span>{forecast.humidity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="border-none shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle>Weather Alerts</CardTitle>
                    <CardDescription>
                      Important weather alerts for poultry farms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weatherAlerts.map((alert) => (
                      <Card key={alert.id} className="border-l-4 border-l-amber-500">
                        <CardHeader className="py-3 pb-1">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{alert.type}</CardTitle>
                            <Badge className={
                              alert.severity === 'High' 
                                ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                                : alert.severity === 'Moderate'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                            }>
                              {alert.severity} Severity
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">
                            {alert.regions.join(', ')} • {alert.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="py-0">
                          <p className="text-sm text-gray-600 mb-2">{alert.details}</p>
                          <div className="bg-blue-50 p-2 rounded-md">
                            <p className="text-xs text-blue-800">
                              <span className="font-semibold">Recommendations:</span> {alert.recommendations}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-md mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle>Poultry Farm Weather Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <ThermometerIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">High Temperature Management</h3>
                        <p className="text-xs text-gray-600">
                          Ensure proper ventilation, provide plenty of fresh water, and consider cooling systems during extreme heat.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <ThermometerSnowflake className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Cold Weather Care</h3>
                        <p className="text-xs text-gray-600">
                          Insulate housing, maintain optimal indoor temperature, and increase feed intake during colder periods.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <CloudRain className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Rainy Season Preparation</h3>
                        <p className="text-xs text-gray-600">
                          Ensure proper drainage, check for leaks in housing, and have backup systems in place for potential flooding.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default News;

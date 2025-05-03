
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Briefcase, Calendar, MessageCircle, PlusCircle, ThumbsUp, MessageSquare, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Define types for our data
interface Expert {
  id: string;
  name: string;
  title: string;
  organization: string;
  expertise: string[];
  experience: string;
  image_url?: string;
  verified: boolean;
  created_at: string;
  user_id: string;
}

interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  type: string;
  description?: string;
  attendees_count: number;
  created_at: string;
}

interface Farmer {
  id: string;
  name: string;
  location: string;
  experience: string;
  farm_size: string;
  farm_type: string;
  expertise: string[];
  contact_number?: string;
  image_url?: string;
  created_at: string;
  user_id: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Network: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('experts');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true);
      try {
        // Fetch experts
        const { data: expertsData, error: expertsError } = await supabase
          .from('network_experts')
          .select('*')
          .order('created_at', { ascending: false });

        if (expertsError) throw expertsError;
        setExperts(expertsData);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('network_events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData);

        // Fetch farmers
        const { data: farmersData, error: farmersError } = await supabase
          .from('network_farmers')
          .select('*')
          .order('created_at', { ascending: false });

        if (farmersError) throw farmersError;
        setFarmers(farmersData);

        // Fetch discussions
        const { data: discussionsData, error: discussionsError } = await supabase
          .from('network_discussions')
          .select('*')
          .order('created_at', { ascending: false });

        if (discussionsError) throw discussionsError;
        setDiscussions(discussionsData);
      } catch (error) {
        console.error('Error fetching network data:', error);
        toast({
          title: "Error fetching network data",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, [toast]);

  // Filter and search functions
  const filterByCategory = (item: any) => {
    if (categoryFilter === 'all') return true;
    if ('expertise' in item && Array.isArray(item.expertise)) {
      return item.expertise.includes(categoryFilter);
    }
    if ('category' in item) {
      return item.category === categoryFilter;
    }
    if ('type' in item) {
      return item.type === categoryFilter;
    }
    return false;
  };

  const filterBySearch = (item: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if ('name' in item && item.name) {
      return item.name.toLowerCase().includes(query);
    }
    if ('title' in item && item.title) {
      return item.title.toLowerCase().includes(query);
    }
    if ('content' in item && item.content) {
      return item.content.toLowerCase().includes(query);
    }
    return false;
  };

  // Filtered data
  const filteredExperts = experts.filter(expert => filterByCategory(expert) && filterBySearch(expert));
  const filteredEvents = events.filter(event => filterByCategory(event) && filterBySearch(event));
  const filteredFarmers = farmers.filter(farmer => filterByCategory(farmer) && filterBySearch(farmer));
  const filteredDiscussions = discussions.filter(discussion => filterByCategory(discussion) && filterBySearch(discussion));

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Poultry Network</h1>
          <p className="text-gray-600">Connect with industry professionals, find experts, and join events</p>
        </div>
  
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Industry Network</CardTitle>
                    <CardDescription>Connect with professionals across the poultry value chain</CardDescription>
                  </div>
                  <div className="w-full sm:w-64">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search network..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="experts" className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Experts
                    </TabsTrigger>
                    <TabsTrigger value="farmers" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Farmers
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Events
                    </TabsTrigger>
                    <TabsTrigger value="discussions" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Discussions
                    </TabsTrigger>
                  </TabsList>
                  
                  {loading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                    </div>
                  ) : (
                    <>
                      {/* Experts Tab */}
                      <TabsContent value="experts" className="space-y-4">
                        <div className="flex justify-between mb-4">
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by expertise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">All Expertise</SelectItem>
                                <SelectItem value="Nutrition">Nutrition</SelectItem>
                                <SelectItem value="Veterinary">Veterinary</SelectItem>
                                <SelectItem value="Farm Management">Farm Management</SelectItem>
                                <SelectItem value="Breeding">Breeding</SelectItem>
                                <SelectItem value="Feed Formulation">Feed Formulation</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          
                          <Button className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Connect with Expert
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredExperts.length > 0 ? (
                            filteredExperts.map(expert => (
                              <Card key={expert.id} className="overflow-hidden">
                                <div className="flex p-4 items-start">
                                  <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={expert.image_url || ''} alt={expert.name} />
                                    <AvatarFallback className="bg-[#f5565c] text-white">{expert.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold text-lg flex items-center">
                                          {expert.name}
                                          {expert.verified && (
                                            <span className="ml-2 text-blue-500">
                                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                              </svg>
                                            </span>
                                          )}
                                        </h3>
                                        <p className="text-sm text-gray-600">{expert.title} at {expert.organization}</p>
                                      </div>
                                      <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                    
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-700 mb-2">{expert.experience} years experience</p>
                                      <div className="flex flex-wrap gap-1">
                                        {expert.expertise.map((skill, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                              <p>No experts found matching your criteria.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Farmers Tab */}
                      <TabsContent value="farmers" className="space-y-4">
                        <div className="flex justify-between mb-4">
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by farm type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">All Farm Types</SelectItem>
                                <SelectItem value="Layer">Layer</SelectItem>
                                <SelectItem value="Broiler">Broiler</SelectItem>
                                <SelectItem value="Integrated">Integrated</SelectItem>
                                <SelectItem value="Backyard">Backyard</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          
                          <Button className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Connect with Farmer
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredFarmers.length > 0 ? (
                            filteredFarmers.map(farmer => (
                              <Card key={farmer.id} className="overflow-hidden">
                                <div className="flex p-4 items-start">
                                  <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={farmer.image_url || ''} alt={farmer.name} />
                                    <AvatarFallback className="bg-[#f5565c] text-white">{farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-semibold text-lg">{farmer.name}</h3>
                                        <p className="text-sm text-gray-600">{farmer.location}</p>
                                      </div>
                                      <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                    
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-700">{farmer.farm_type} Farm | {farmer.farm_size}</p>
                                      <p className="text-sm text-gray-700 mb-2">{farmer.experience} years experience</p>
                                      <div className="flex flex-wrap gap-1">
                                        {farmer.expertise.map((skill, index) => (
                                          <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                              <p>No farmers found matching your criteria.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Events Tab */}
                      <TabsContent value="events" className="space-y-4">
                        <div className="flex justify-between mb-4">
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">All Event Types</SelectItem>
                                <SelectItem value="Conference">Conference</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Webinar">Webinar</SelectItem>
                                <SelectItem value="Trade Show">Trade Show</SelectItem>
                                <SelectItem value="Training">Training</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          
                          <Button className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Submit Event
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                              <Card key={event.id} className="overflow-hidden">
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle>{event.title}</CardTitle>
                                      <CardDescription>
                                        Organized by {event.organizer}
                                      </CardDescription>
                                    </div>
                                    <Badge>{event.type}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-y-2">
                                    <div className="w-full sm:w-1/2">
                                      <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{event.date}</span>
                                      </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                      <div className="flex items-center text-sm">
                                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{event.attendees_count} attendees</span>
                                      </div>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                      <div className="flex items-center text-sm">
                                        <svg className="h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                          <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        <span>{event.location}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {event.description && (
                                    <p className="mt-4 text-sm text-gray-600">{event.description}</p>
                                  )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <Button variant="outline" size="sm">View Details</Button>
                                  <Button size="sm">Register</Button>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No events found matching your criteria.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Discussions Tab */}
                      <TabsContent value="discussions" className="space-y-4">
                        <div className="flex justify-between mb-4">
                          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Disease Control">Disease Control</SelectItem>
                                <SelectItem value="Feed">Feed</SelectItem>
                                <SelectItem value="Equipment">Equipment</SelectItem>
                                <SelectItem value="Market Trends">Market Trends</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          
                          <Button className="flex items-center">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Start Discussion
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {filteredDiscussions.length > 0 ? (
                            filteredDiscussions.map(discussion => (
                              <Card key={discussion.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between">
                                    <Badge variant="outline">{discussion.category}</Badge>
                                    {discussion.is_pinned && (
                                      <Badge variant="secondary">Pinned</Badge>
                                    )}
                                  </div>
                                  <CardTitle className="mt-2">{discussion.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-gray-600 line-clamp-3">{discussion.content}</p>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-between items-center">
                                  <div className="flex space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <ThumbsUp className="h-4 w-4 mr-1" />
                                      {discussion.likes_count}
                                    </div>
                                    <div className="flex items-center">
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      {discussion.replies_count}
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <BookmarkPlus className="h-4 w-4 mr-1" />
                                      Save
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      View Discussion
                                    </Button>
                                  </div>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No discussions found matching your criteria.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {user && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Network</CardTitle>
                  <CardDescription>Your connections and activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Connections</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Events Attending</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Discussions</span>
                    <span className="text-sm font-medium">7</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View My Profile</Button>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 3).map(event => (
                  <div key={event.id} className="border-l-2 border-[#f5565c] pl-3">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                    <div className="flex items-center text-xs mt-1">
                      <Users className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{event.attendees_count} attending</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs">View All Events</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Featured Experts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {experts.filter(expert => expert.verified).slice(0, 3).map(expert => (
                  <div key={expert.id} className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={expert.image_url || ''} alt={expert.name} />
                      <AvatarFallback className="bg-[#f5565c] text-white">{expert.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{expert.name}</p>
                      <p className="text-xs text-gray-500">{expert.title}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs" onClick={() => setActiveTab('experts')}>
                  Connect with Experts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Network;

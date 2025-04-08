
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Calendar, Check, Filter, Globe, MapPin, MessageSquare, Phone, Search, ThumbsUp, User, UserPlus, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Sample data for farmer network
const farmers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Haryana',
    experience: '12 years',
    farmSize: 'Large (> 10,000 birds)',
    farmType: 'Integrated',
    expertise: ['Layer farming', 'Feed management', 'Disease prevention'],
    image: 'https://i.pravatar.cc/150?img=11',
    isConnected: false
  },
  {
    id: 2,
    name: 'Sunita Patel',
    location: 'Gujarat',
    experience: '8 years',
    farmSize: 'Medium (5,000-10,000 birds)',
    farmType: 'Broiler',
    expertise: ['Broiler farming', 'Processing', 'Marketing'],
    image: 'https://i.pravatar.cc/150?img=12',
    isConnected: true
  },
  {
    id: 3,
    name: 'Manoj Singh',
    location: 'Punjab',
    experience: '15 years',
    farmSize: 'Large (> 10,000 birds)',
    farmType: 'Layer',
    expertise: ['Layer farming', 'Breeding', 'Automation'],
    image: 'https://i.pravatar.cc/150?img=13',
    isConnected: false
  },
  {
    id: 4,
    name: 'Priya Sharma',
    location: 'Maharashtra',
    experience: '6 years',
    farmSize: 'Small (< 5,000 birds)',
    farmType: 'Free-range',
    expertise: ['Organic farming', 'Direct marketing', 'Value addition'],
    image: 'https://i.pravatar.cc/150?img=14',
    isConnected: true
  },
  {
    id: 5,
    name: 'Amit Verma',
    location: 'Uttar Pradesh',
    experience: '10 years',
    farmSize: 'Medium (5,000-10,000 birds)',
    farmType: 'Broiler',
    expertise: ['Contract farming', 'Biosecurity', 'Farm management'],
    image: 'https://i.pravatar.cc/150?img=15',
    isConnected: false
  }
];

// Sample data for experts
const experts = [
  {
    id: 1,
    name: 'Dr. Anjali Desai',
    title: 'Poultry Veterinarian',
    organization: 'National Veterinary Research Institute',
    expertise: ['Disease diagnosis', 'Vaccination programs', 'Flock health'],
    experience: '18 years',
    image: 'https://i.pravatar.cc/150?img=21',
    verified: true
  },
  {
    id: 2,
    name: 'Dr. Suresh Iyer',
    title: 'Poultry Nutritionist',
    organization: 'Agricultural University',
    expertise: ['Feed formulation', 'Diet optimization', 'Performance enhancement'],
    experience: '15 years',
    image: 'https://i.pravatar.cc/150?img=22',
    verified: true
  },
  {
    id: 3,
    name: 'Prof. Ravi Menon',
    title: 'Poultry Housing Specialist',
    organization: 'Institute of Farm Engineering',
    expertise: ['Housing design', 'Ventilation systems', 'Environmental control'],
    experience: '20 years',
    image: 'https://i.pravatar.cc/150?img=23',
    verified: true
  },
  {
    id: 4,
    name: 'Ms. Lakshmi Nair',
    title: 'Poultry Marketing Consultant',
    organization: 'Agribusiness Consultancy Services',
    expertise: ['Market analysis', 'Business planning', 'Value chain development'],
    experience: '12 years',
    image: 'https://i.pravatar.cc/150?img=24',
    verified: false
  }
];

// Sample data for discussion forums
const discussionThreads = [
  {
    id: 1,
    title: 'Dealing with summer heat stress in layer houses',
    author: 'Rajesh Kumar',
    authorImage: 'https://i.pravatar.cc/150?img=11',
    date: 'April 5, 2025',
    category: 'Farm Management',
    replies: 18,
    likes: 24,
    lastActivity: '2 hours ago'
  },
  {
    id: 2,
    title: 'Best practices for reducing feed wastage',
    author: 'Sunita Patel',
    authorImage: 'https://i.pravatar.cc/150?img=12',
    date: 'April 4, 2025',
    category: 'Nutrition',
    replies: 25,
    likes: 37,
    lastActivity: '6 hours ago'
  },
  {
    id: 3,
    title: 'Early detection of respiratory diseases in broilers',
    author: 'Dr. Anjali Desai',
    authorImage: 'https://i.pravatar.cc/150?img=21',
    date: 'April 3, 2025',
    category: 'Health',
    replies: 32,
    likes: 45,
    lastActivity: '1 day ago',
    isPinned: true
  },
  {
    id: 4,
    title: 'Marketing strategies for small-scale poultry farmers',
    author: 'Priya Sharma',
    authorImage: 'https://i.pravatar.cc/150?img=14',
    date: 'April 1, 2025',
    category: 'Marketing',
    replies: 14,
    likes: 19,
    lastActivity: '3 days ago'
  },
  {
    id: 5,
    title: 'Poultry equipment automation - worth the investment?',
    author: 'Manoj Singh',
    authorImage: 'https://i.pravatar.cc/150?img=13',
    date: 'March 30, 2025',
    category: 'Technology',
    replies: 42,
    likes: 38,
    lastActivity: '5 days ago'
  }
];

// Sample data for upcoming events
const events = [
  {
    id: 1,
    title: 'Annual Poultry Farmers Meet',
    organizer: 'Indian Poultry Association',
    date: 'May 15-16, 2025',
    location: 'New Delhi',
    type: 'Conference',
    attendees: 245
  },
  {
    id: 2,
    title: 'Poultry Health Management Workshop',
    organizer: 'Veterinary Association',
    date: 'June 8, 2025',
    location: 'Hyderabad',
    type: 'Workshop',
    attendees: 85
  },
  {
    id: 3,
    title: 'Modern Poultry Equipment Expo',
    organizer: 'Poultry Technology Consortium',
    date: 'July 22-24, 2025',
    location: 'Mumbai',
    type: 'Exhibition',
    attendees: 520
  }
];

const Network: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedFarmers, setConnectedFarmers] = useState<number[]>([2, 4]);
  
  const toggleConnection = (farmerId: number) => {
    if (connectedFarmers.includes(farmerId)) {
      setConnectedFarmers(connectedFarmers.filter(id => id !== farmerId));
      toast({
        title: "Connection removed",
        description: "This farmer has been removed from your connections.",
      });
    } else {
      setConnectedFarmers([...connectedFarmers, farmerId]);
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully.",
      });
    }
  };
  
  const handleMessageFarmer = (farmerId: number) => {
    toast({
      title: "Message composer opened",
      description: "You can now send a message to this farmer.",
    });
  };
  
  const handleConsultExpert = (expertId: number) => {
    toast({
      title: "Consultation request",
      description: "Your consultation request has been submitted.",
    });
  };
  
  const handleViewThread = (threadId: number) => {
    toast({
      title: "Discussion thread",
      description: "Opening the complete thread with all replies.",
    });
  };
  
  const handleRegisterEvent = (eventId: number) => {
    toast({
      title: "Event registration",
      description: "You've been registered for this event.",
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
          <h1 className="text-3xl font-bold">Networking</h1>
          <p className="text-gray-500 mt-1">
            Connect with fellow poultry farmers, experts, and participate in discussions
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for farmers, experts or discussions..." 
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" />
            Filter Results
          </Button>
        </div>
        
        <Tabs defaultValue="farmers" className="w-full">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 md:grid-cols-4 bg-gray-100">
            <TabsTrigger 
              value="farmers" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Users className="h-4 w-4 mr-2 hidden sm:block" />
              Farmers Network
            </TabsTrigger>
            <TabsTrigger 
              value="experts" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <User className="h-4 w-4 mr-2 hidden sm:block" />
              Experts
            </TabsTrigger>
            <TabsTrigger 
              value="forum" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <MessageSquare className="h-4 w-4 mr-2 hidden sm:block" />
              Discussion Forum
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Calendar className="h-4 w-4 mr-2 hidden sm:block" />
              Events
            </TabsTrigger>
          </TabsList>
          
          {/* Farmers Network Tab */}
          <TabsContent value="farmers" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmers.map((farmer) => {
                const isConnected = connectedFarmers.includes(farmer.id);
                
                return (
                  <motion.div 
                    key={farmer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <AvatarImage src={farmer.image} alt={farmer.name} />
                              <AvatarFallback>{farmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{farmer.name}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" /> {farmer.location}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={
                            farmer.farmType === 'Layer' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                              : farmer.farmType === 'Broiler'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              : farmer.farmType === 'Integrated'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                              : 'bg-green-100 text-green-800 hover:bg-green-100'
                          }>
                            {farmer.farmType}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Experience</p>
                            <p className="font-medium">{farmer.experience}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Farm Size</p>
                            <p className="font-medium">{farmer.farmSize}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 mb-1">Areas of Expertise</p>
                          <div className="flex flex-wrap gap-2">
                            {farmer.expertise.map((area, index) => (
                              <Badge key={index} variant="outline" className="font-normal text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessageFarmer(farmer.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          className={
                            isConnected 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          }
                          size="sm"
                          onClick={() => toggleConnection(farmer.id)}
                        >
                          {isConnected ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Load More Farmers</Button>
            </div>
          </TabsContent>
          
          {/* Experts Tab */}
          <TabsContent value="experts" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experts.map((expert) => (
                <motion.div 
                  key={expert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={expert.image} alt={expert.name} />
                            <AvatarFallback>{expert.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{expert.name}</CardTitle>
                              {expert.verified && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="mt-1">
                              {expert.title}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="h-4 w-4 text-gray-500" />
                        <p className="text-sm">{expert.organization}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">Experience</p>
                          <p className="font-medium">{expert.experience}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Areas of Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {expert.expertise.map((area, index) => (
                            <Badge key={index} variant="outline" className="font-normal text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMessageFarmer(expert.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        size="sm"
                        onClick={() => handleConsultExpert(expert.id)}
                      >
                        Request Consultation
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Find More Experts</Button>
            </div>
          </TabsContent>
          
          {/* Discussion Forum Tab */}
          <TabsContent value="forum" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Discussions</h3>
              <Button 
                className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
              >
                Start New Discussion
              </Button>
            </div>
            
            <div className="space-y-4">
              {discussionThreads.map((thread) => (
                <motion.div 
                  key={thread.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={thread.isPinned ? "border-l-4 border-l-amber-500" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            {thread.isPinned && (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                Pinned
                              </Badge>
                            )}
                            <CardTitle className="text-lg">{thread.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={thread.authorImage} alt={thread.author} />
                              <AvatarFallback>{thread.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <CardDescription>
                              Posted by {thread.author} • {thread.date}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={
                          thread.category === 'Health' 
                            ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                            : thread.category === 'Nutrition'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : thread.category === 'Farm Management'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : thread.category === 'Marketing'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                        }>
                          {thread.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardFooter className="py-2 flex justify-between">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span>{thread.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-gray-500" />
                          <span>{thread.likes} likes</span>
                        </div>
                        <div className="text-gray-500">
                          Last activity: {thread.lastActivity}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewThread(thread.id)}
                      >
                        View Thread
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Load More Discussions</Button>
            </div>
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upcoming Industry Events</h3>
              <Button variant="outline">
                Submit Event
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Organized by {event.organizer}
                          </CardDescription>
                        </div>
                        <Badge className={
                          event.type === 'Conference' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                            : event.type === 'Workshop'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                        }>
                          {event.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p>{event.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <p>{event.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <p>{event.attendees} attending</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        size="sm"
                        onClick={() => handleRegisterEvent(event.id)}
                      >
                        Register Now
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Events</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Network;

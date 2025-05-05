
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import JobBoard from '@/components/network/JobBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Briefcase, MessageCircle, Calendar, Search, Filter, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

// Example data for demonstration
const expertsData = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    title: 'Poultry Veterinarian',
    organization: 'National Veterinary Institute',
    expertise: ['Disease prevention', 'Vaccination', 'Biosecurity'],
    experience: '15 years',
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Sunita Patel',
    title: 'Poultry Nutrition Specialist',
    organization: 'Agricultural Research Center',
    expertise: ['Feed formulation', 'Growth optimization', 'Alternative feeds'],
    experience: '12 years',
    image_url: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'Dr. Amit Shah',
    title: 'Avian Immunologist',
    organization: 'Poultry Science University',
    expertise: ['Immunity enhancement', 'Disease resistance', 'Genetic selection'],
    experience: '18 years',
    image_url: 'https://randomuser.me/api/portraits/men/62.jpg'
  },
];

const farmersData = [
  {
    id: '1',
    name: 'Ramesh Patil',
    location: 'Nashik, Maharashtra',
    farm_type: 'Layer farm',
    farm_size: '5000 birds',
    experience: '8 years',
    expertise: ['Cage system', 'Organic eggs', 'Backyard poultry'],
    image_url: 'https://randomuser.me/api/portraits/men/53.jpg'
  },
  {
    id: '2',
    name: 'Anjali Singh',
    location: 'Ludhiana, Punjab',
    farm_type: 'Broiler farm',
    farm_size: '15000 birds',
    experience: '6 years',
    expertise: ['Deep litter system', 'Climate controlled housing', 'Automated feeding'],
    image_url: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
  {
    id: '3',
    name: 'Mohammed Khan',
    location: 'Hyderabad, Telangana',
    farm_type: 'Mixed operation',
    farm_size: '8000 birds',
    experience: '12 years',
    expertise: ['Broiler breeding', 'Indigenous breeds', 'Feed production'],
    image_url: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
];

const discussionsData = [
  {
    id: '1',
    title: 'Dealing with summer heat stress in broilers',
    content: 'What strategies have you found effective for managing heat stress during extreme summer temperatures? Our cooling systems are struggling to keep up.',
    user_id: '1',
    author: 'Ramesh Patil',
    created_at: '2023-05-01T08:30:00Z',
    category: 'Farm Management',
    replies_count: 12,
    likes_count: 24,
    is_pinned: true
  },
  {
    id: '2',
    title: 'New vaccination protocol effectiveness',
    content: 'Has anyone tried the new IBD vaccination protocol? How effective has it been in your flocks?',
    user_id: '2',
    author: 'Dr. Rajesh Kumar',
    created_at: '2023-04-28T14:20:00Z',
    category: 'Health',
    replies_count: 8,
    likes_count: 15,
    is_pinned: false
  },
  {
    id: '3',
    title: 'Alternative feed ingredients cost analysis',
    content: 'With rising soybean costs, what alternatives are you incorporating into your feed formulations? Looking for cost-effective solutions that maintain growth performance.',
    user_id: '3',
    author: 'Sunita Patel',
    created_at: '2023-04-25T09:45:00Z',
    category: 'Nutrition',
    replies_count: 15,
    likes_count: 28,
    is_pinned: false
  },
];

const eventsData = [
  {
    id: '1',
    title: 'Poultry Disease Management Workshop',
    date: 'June 15, 2023',
    location: 'Agricultural University, Hyderabad',
    type: 'Workshop',
    organizer: 'Poultry Science Association',
    description: 'A hands-on workshop focusing on early detection and management of common poultry diseases.'
  },
  {
    id: '2',
    title: 'Annual Poultry Industry Conference',
    date: 'July 8-10, 2023',
    location: 'Convention Center, New Delhi',
    type: 'Conference',
    organizer: 'National Poultry Development Board',
    description: 'Join industry leaders for the largest poultry conference in the country, featuring keynotes, exhibitions, and networking opportunities.'
  },
];

interface NewDiscussionFormData {
  title: string;
  content: string;
  category: string;
}

const initialDiscussionForm: NewDiscussionFormData = {
  title: '',
  content: '',
  category: 'General'
};

interface NewEventFormData {
  title: string;
  date: string;
  location: string;
  type: string;
  description: string;
}

const initialEventForm: NewEventFormData = {
  title: '',
  date: '',
  location: '',
  type: 'Workshop',
  description: ''
};

const Network: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('connect');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [userRole, setUserRole] = useState<string>('');
  const [discussionFormData, setDiscussionFormData] = useState<NewDiscussionFormData>(initialDiscussionForm);
  const [eventFormData, setEventFormData] = useState<NewEventFormData>(initialEventForm);
  const [isDiscussionDialogOpen, setIsDiscussionDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experts, setExperts] = useState(expertsData);
  const [farmers, setFarmers] = useState(farmersData);
  const [discussions, setDiscussions] = useState(discussionsData);
  const [events, setEvents] = useState(eventsData);

  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        const role = userMetadata.role || '';
        setUserRole(role);
        
        // In a real app, fetch additional data based on role
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserRole();
  }, [user]);

  const handleDiscussionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDiscussionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, send this data to the server
    const newDiscussion = {
      id: String(Date.now()),
      title: discussionFormData.title,
      content: discussionFormData.content,
      user_id: user?.id || '',
      author: user?.email?.split('@')[0] || 'Anonymous',
      created_at: new Date().toISOString(),
      category: discussionFormData.category,
      replies_count: 0,
      likes_count: 0,
      is_pinned: false
    };
    
    setDiscussions(prev => [newDiscussion, ...prev]);
    setDiscussionFormData(initialDiscussionForm);
    setIsDiscussionDialogOpen(false);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, send this data to the server
    const newEvent = {
      id: String(Date.now()),
      title: eventFormData.title,
      date: eventFormData.date,
      location: eventFormData.location,
      type: eventFormData.type,
      organizer: 'Your Organization',
      description: eventFormData.description
    };
    
    setEvents(prev => [newEvent, ...prev]);
    setEventFormData(initialEventForm);
    setIsEventDialogOpen(false);
  };

  // Filter experts based on search query
  const filteredExperts = experts.filter(expert => 
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.expertise.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter farmers based on search query
  const filteredFarmers = farmers.filter(farmer => 
    farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.farm_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farmer.expertise.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Combined network connections based on filter type
  const filteredConnections = filterType === 'experts' 
    ? filteredExperts 
    : filterType === 'farmers' 
    ? filteredFarmers 
    : [...filteredExperts, ...filteredFarmers];

  // Filter discussions based on search query
  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Poultry Network</h1>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="connect" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Connect
              </TabsTrigger>
              <TabsTrigger value="discuss" className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Job Board
              </TabsTrigger>
            </TabsList>
            
            {user && activeTab === 'discuss' && (
              <Dialog open={isDiscussionDialogOpen} onOpenChange={setIsDiscussionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#f5565c]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleDiscussionSubmit} className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={discussionFormData.title}
                        onChange={handleDiscussionInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        value={discussionFormData.content}
                        onChange={handleDiscussionInputChange}
                        rows={5}
                        className="w-full rounded-md border border-gray-300 p-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={discussionFormData.category}
                        onChange={handleDiscussionInputChange}
                        className="w-full rounded-md border border-gray-300 p-2"
                      >
                        <option value="General">General</option>
                        <option value="Health">Health</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Farm Management">Farm Management</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Technology">Technology</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDiscussionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#f5565c]">
                        Post Discussion
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
            {user && (userRole === 'organization' || userRole === 'trainer') && activeTab === 'events' && (
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#f5565c]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEventSubmit} className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={eventFormData.title}
                        onChange={handleEventInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Date
                        </label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={eventFormData.date}
                          onChange={handleEventInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                          Event Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={eventFormData.type}
                          onChange={handleEventInputChange}
                          className="w-full rounded-md border border-gray-300 p-2"
                        >
                          <option value="Workshop">Workshop</option>
                          <option value="Conference">Conference</option>
                          <option value="Webinar">Webinar</option>
                          <option value="Training">Training</option>
                          <option value="Meetup">Meetup</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={eventFormData.location}
                        onChange={handleEventInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={eventFormData.description}
                        onChange={handleEventInputChange}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 p-2"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#f5565c]">
                        Create Event
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <TabsContent value="connect">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Connect with the Poultry Community</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search connections..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="experts">Experts</option>
                      <option value="farmers">Farmers</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                  </div>
                ) : filteredConnections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConnections.map((connection: any) => (
                      <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-center mb-4">
                          <img 
                            src={connection.image_url || 'https://via.placeholder.com/64'} 
                            alt={connection.name} 
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-lg">{connection.name}</h3>
                            <p className="text-sm text-gray-600">
                              {connection.title || connection.farm_type}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {connection.organization || connection.location}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Experience:</span> {connection.experience}
                          </p>
                          {'farm_size' in connection && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Farm Size:</span> {connection.farm_size}
                            </p>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700">
                            {'expertise' in connection ? 'Expertise:' : 'Specializations:'}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {connection.expertise?.map((skill: string, i: number) => (
                              <span 
                                key={i} 
                                className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <Button size="sm" className="bg-[#0FA0CE]">Connect</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No matches found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discuss">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Community Discussions</CardTitle>
                  <div className="relative flex-grow md:max-w-xs">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search discussions..." 
                      className="pl-8" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                  </div>
                ) : filteredDiscussions.length > 0 ? (
                  <div className="space-y-6">
                    {/* Pinned discussions */}
                    {filteredDiscussions.filter(d => d.is_pinned).map(discussion => (
                      <div key={discussion.id} className="border-2 border-[#f5565c]/20 rounded-lg p-4 bg-[#f5565c]/5">
                        <div className="flex items-start gap-2">
                          <div className="bg-[#f5565c] rounded-full p-1 mt-1">
                            <MessageCircle className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#f5565c]/10 text-[#f5565c] text-xs px-2 py-0.5 rounded-full">Pinned</span>
                              <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">{discussion.category}</span>
                            </div>
                            
                            <h3 className="font-medium text-lg mt-1">{discussion.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{discussion.content}</p>
                            
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <span className="mr-3">Posted by {discussion.author}</span>
                              <span className="mr-3">{new Date(discussion.created_at).toLocaleDateString()}</span>
                              <span className="mr-3">{discussion.replies_count} replies</span>
                              <span>{discussion.likes_count} likes</span>
                            </div>
                            
                            <div className="mt-3">
                              <Button variant="outline" size="sm">View Discussion</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Regular discussions */}
                    {filteredDiscussions.filter(d => !d.is_pinned).map(discussion => (
                      <div key={discussion.id} className="border rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">{discussion.category}</span>
                            </div>
                            
                            <h3 className="font-medium text-lg mt-1">{discussion.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{discussion.content}</p>
                            
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <span className="mr-3">Posted by {discussion.author}</span>
                              <span className="mr-3">{new Date(discussion.created_at).toLocaleDateString()}</span>
                              <span className="mr-3">{discussion.replies_count} replies</span>
                              <span>{discussion.likes_count} likes</span>
                            </div>
                            
                            <div className="mt-3">
                              <Button variant="outline" size="sm">View Discussion</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No discussions found</h3>
                    <p className="mt-1 text-gray-500">Be the first to start a discussion!</p>
                    
                    {user && (
                      <Button 
                        className="mt-4 bg-[#f5565c]"
                        onClick={() => setIsDiscussionDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Start a Discussion
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Events & Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-6">
                    {events.map(event => (
                      <div key={event.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {event.date}
                            </div>
                            <p className="text-sm mt-2">{event.description}</p>
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              {event.type}
                            </span>
                            <p className="text-sm text-gray-600 mt-2">{event.location}</p>
                            <Button className="mt-4 bg-[#0FA0CE]">
                              Register
                            </Button>
                          </div>
                        </div>
                        
                        {(userRole === 'organization' || userRole === 'trainer') && (
                          <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200">Cancel Event</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming events</h3>
                    <p className="mt-1 text-gray-500">Check back later or create a new event.</p>
                    
                    {user && (userRole === 'organization' || userRole === 'trainer') && (
                      <Button 
                        className="mt-4 bg-[#f5565c]"
                        onClick={() => setIsEventDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Event
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <JobBoard userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Network;

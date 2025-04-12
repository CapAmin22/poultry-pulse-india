
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building, Calendar, Check, Filter, Globe, MapPin, MessageSquare, 
  Phone, Search, ThumbsUp, User, UserPlus, Users, Send, 
  Plus, Loader2, X, ListPlus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Type definitions
interface Farmer {
  id: string;
  user_id: string;
  name: string;
  location: string;
  experience: string;
  farm_size: string;
  farm_type: string;
  expertise: string[];
  image_url?: string;
  created_at: string;
}

interface Expert {
  id: string;
  user_id: string;
  name: string;
  title: string;
  organization: string;
  expertise: string[];
  experience: string;
  verified: boolean;
  image_url?: string;
  created_at: string;
}

interface DiscussionThread {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  replies_count: number;
  likes_count: number;
  author_name: string;
  author_image?: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  type: string;
  attendees_count: number;
  description: string;
  created_at: string;
}

interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  created_at: string;
}

// Form schemas
const farmerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(3, "Location is required"),
  experience: z.string().min(1, "Experience is required"),
  farmSize: z.string().min(1, "Farm size is required"),
  farmType: z.string().min(1, "Farm type is required"),
  expertise: z.string().min(5, "Expertise details are required"),
  contactNumber: z.string().optional(),
});

const threadFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

const eventFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  organizer: z.string().min(2, "Organizer is required"),
  date: z.string().min(5, "Date is required"),
  location: z.string().min(3, "Location is required"),
  type: z.string().min(1, "Event type is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

const Network: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);
  
  // Data states
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [farmerDialogOpen, setFarmerDialogOpen] = useState(false);
  const [threadDialogOpen, setThreadDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  
  // Forms
  const farmerForm = useForm<z.infer<typeof farmerFormSchema>>({
    resolver: zodResolver(farmerFormSchema),
    defaultValues: {
      name: "",
      location: "",
      experience: "",
      farmSize: "small",
      farmType: "broiler",
      expertise: "",
      contactNumber: "",
    }
  });
  
  const threadForm = useForm<z.infer<typeof threadFormSchema>>({
    resolver: zodResolver(threadFormSchema),
    defaultValues: {
      title: "",
      category: "farm_management",
      content: "",
    }
  });
  
  const eventForm = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      organizer: "",
      date: "",
      location: "",
      type: "conference",
      description: "",
    }
  });
  
  // Fetch user connections
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('network_connections')
          .select('connected_user_id')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        setConnectedUserIds(data.map(conn => conn.connected_user_id));
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };
    
    fetchConnections();
  }, [user]);
  
  // Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch farmers
        const { data: farmersData, error: farmersError } = await supabase
          .from('network_farmers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (farmersError) throw farmersError;
        setFarmers(farmersData as Farmer[]);
        
        // Fetch experts
        const { data: expertsData, error: expertsError } = await supabase
          .from('network_experts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (expertsError) throw expertsError;
        setExperts(expertsData as Expert[]);
        
        // Fetch discussion threads
        const { data: threadsData, error: threadsError } = await supabase
          .from('network_discussions')
          .select('*, profiles(username)')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });
          
        if (threadsError) throw threadsError;
        
        // Format threads data
        const formattedThreads = threadsData.map(thread => ({
          id: thread.id,
          user_id: thread.user_id,
          title: thread.title,
          content: thread.content,
          category: thread.category,
          is_pinned: thread.is_pinned,
          replies_count: thread.replies_count || 0,
          likes_count: thread.likes_count || 0,
          author_name: thread.profiles?.username || 'Unknown User',
          author_image: null, // We would need to fetch this separately if needed
          created_at: thread.created_at,
        }));
        
        setThreads(formattedThreads as DiscussionThread[]);
        
        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('network_events')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (eventsError) throw eventsError;
        setEvents(eventsData as Event[]);
      } catch (error) {
        console.error('Error fetching network data:', error);
        toast({
          title: "Failed to load network data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNetworkData();
  }, []);
  
  // Toggle connection with a farmer
  const toggleConnection = async (userId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with others",
        variant: "destructive",
      });
      return;
    }
    
    const isConnected = connectedUserIds.includes(userId);
    
    try {
      if (isConnected) {
        // Remove connection
        const { error } = await supabase
          .from('network_connections')
          .delete()
          .eq('user_id', user.id)
          .eq('connected_user_id', userId);
          
        if (error) throw error;
        
        setConnectedUserIds(connectedUserIds.filter(id => id !== userId));
        
        toast({
          title: "Connection removed",
          description: "This user has been removed from your connections.",
        });
      } else {
        // Add connection
        const { error } = await supabase
          .from('network_connections')
          .insert({
            user_id: user.id,
            connected_user_id: userId,
          });
          
        if (error) throw error;
        
        setConnectedUserIds([...connectedUserIds, userId]);
        
        toast({
          title: "Connection request sent",
          description: "Your connection request has been sent successfully.",
        });
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
      toast({
        title: "Failed to update connection",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  // Handle messaging a user
  const handleMessageUser = (userId: string, name: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message others",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message composer opened",
      description: `You can now send a message to ${name}.`,
    });
    
    // In a real implementation, this would open a messaging interface
  };
  
  // Handle consulting an expert
  const handleConsultExpert = (expertId: string, name: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to request consultations",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Consultation request",
      description: `Your consultation request to ${name} has been submitted.`,
    });
    
    // In a real implementation, this would send a consultation request
  };
  
  // Handle viewing a discussion thread
  const handleViewThread = (threadId: string) => {
    toast({
      title: "Discussion thread",
      description: "Opening the complete thread with all replies.",
    });
    
    // In a real implementation, this would navigate to the thread detail page
  };
  
  // Handle registering for an event
  const handleRegisterEvent = (eventId: string, title: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for events",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Event registration",
      description: `You've been registered for ${title}.`,
    });
    
    // In a real implementation, this would register the user for the event
  };
  
  // Submit new farmer profile
  const onSubmitFarmer = async (values: z.infer<typeof farmerFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('network_farmers')
        .insert({
          user_id: user.id,
          name: values.name,
          location: values.location,
          experience: values.experience,
          farm_size: values.farmSize,
          farm_type: values.farmType,
          expertise: values.expertise.split(',').map(item => item.trim()),
          contact_number: values.contactNumber,
        });
        
      if (error) throw error;
      
      toast({
        title: "Profile created successfully",
        description: "Your farmer profile has been published to the network",
      });
      
      // Refresh farmers list
      const { data, error: fetchError } = await supabase
        .from('network_farmers')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!fetchError) {
        setFarmers(data as Farmer[]);
      }
      
      // Reset form and close dialog
      farmerForm.reset();
      setFarmerDialogOpen(false);
    } catch (error) {
      console.error('Error creating farmer profile:', error);
      toast({
        title: "Failed to create profile",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Submit new discussion thread
  const onSubmitThread = async (values: z.infer<typeof threadFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a discussion",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('network_discussions')
        .insert({
          user_id: user.id,
          title: values.title,
          content: values.content,
          category: values.category,
          is_pinned: false,
          replies_count: 0,
          likes_count: 0,
        });
        
      if (error) throw error;
      
      toast({
        title: "Discussion created successfully",
        description: "Your discussion thread has been published",
      });
      
      // Refresh threads list
      const { data, error: fetchError } = await supabase
        .from('network_discussions')
        .select('*, profiles(username)')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (!fetchError) {
        const formattedThreads = data.map(thread => ({
          id: thread.id,
          user_id: thread.user_id,
          title: thread.title,
          content: thread.content,
          category: thread.category,
          is_pinned: thread.is_pinned,
          replies_count: thread.replies_count || 0,
          likes_count: thread.likes_count || 0,
          author_name: thread.profiles?.username || 'Unknown User',
          author_image: null,
          created_at: thread.created_at,
        }));
        
        setThreads(formattedThreads as DiscussionThread[]);
      }
      
      // Reset form and close dialog
      threadForm.reset();
      setThreadDialogOpen(false);
    } catch (error) {
      console.error('Error creating discussion thread:', error);
      toast({
        title: "Failed to create discussion",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Submit new event
  const onSubmitEvent = async (values: z.infer<typeof eventFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an event",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('network_events')
        .insert({
          title: values.title,
          organizer: values.organizer,
          date: values.date,
          location: values.location,
          type: values.type,
          description: values.description,
          attendees_count: 0,
        });
        
      if (error) throw error;
      
      toast({
        title: "Event created successfully",
        description: "Your event has been published",
      });
      
      // Refresh events list
      const { data, error: fetchError } = await supabase
        .from('network_events')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!fetchError) {
        setEvents(data as Event[]);
      }
      
      // Reset form and close dialog
      eventForm.reset();
      setEventDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Failed to create event",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  // Filter data based on search term
  const filteredFarmers = farmers.filter(farmer => 
    searchTerm === '' || 
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farm_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredExperts = experts.filter(expert => 
    searchTerm === '' || 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredThreads = threads.filter(thread => 
    searchTerm === '' || 
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredEvents = events.filter(event => 
    searchTerm === '' || 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            <div className="flex justify-end">
              <Dialog open={farmerDialogOpen} onOpenChange={setFarmerDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Farmer Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create Farmer Profile</DialogTitle>
                    <DialogDescription>
                      Fill out the form to create your farmer profile for the network.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...farmerForm}>
                    <form onSubmit={farmerForm.handleSubmit(onSubmitFarmer)} className="space-y-4">
                      <FormField
                        control={farmerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={farmerForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={farmerForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 5 years" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={farmerForm.control}
                          name="farmSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Farm Size</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="small">Small (< 5,000 birds)</SelectItem>
                                  <SelectItem value="medium">Medium (5,000-10,000 birds)</SelectItem>
                                  <SelectItem value="large">Large (> 10,000 birds)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={farmerForm.control}
                          name="farmType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Farm Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="layer">Layer</SelectItem>
                                  <SelectItem value="broiler">Broiler</SelectItem>
                                  <SelectItem value="integrated">Integrated</SelectItem>
                                  <SelectItem value="free_range">Free-range</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={farmerForm.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Areas of Expertise</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List your areas of expertise, separated by commas" 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={farmerForm.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setFarmerDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          disabled={farmerForm.formState.isSubmitting}
                        >
                          {farmerForm.formState.isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Creating...
                            </>
                          ) : (
                            "Create Profile"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : filteredFarmers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredFarmers.map((farmer) => {
                  const isConnected = connectedUserIds.includes(farmer.user_id);
                  
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
                                <AvatarImage src={farmer.image_url} alt={farmer.name} />
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
                              farmer.farm_type === 'layer' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                                : farmer.farm_type === 'broiler'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : farmer.farm_type === 'integrated'
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                : 'bg-green-100 text-green-800 hover:bg-green-100'
                            }>
                              {farmer.farm_type.charAt(0).toUpperCase() + farmer.farm_type.slice(1).replace('_', '-')}
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
                              <p className="font-medium">
                                {farmer.farm_size === 'small' ? 'Small (< 5,000 birds)' : 
                                 farmer.farm_size === 'medium' ? 'Medium (5,000-10,000 birds)' : 
                                 'Large (> 10,000 birds)'}
                              </p>
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
                            onClick={() => handleMessageUser(farmer.user_id, farmer.name)}
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
                            onClick={() => toggleConnection(farmer.user_id)}
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
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No farmer profiles found</p>
                <Button 
                  onClick={() => setFarmerDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Profile
                </Button>
              </div>
            )}
            
            {filteredFarmers.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More Farmers</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Experts Tab */}
          <TabsContent value="experts" className="mt-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : filteredExperts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredExperts.map((expert) => (
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
                              <AvatarImage src={expert.image_url} alt={expert.name} />
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
                          onClick={() => handleMessageUser(expert.user_id, expert.name)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                          onClick={() => handleConsultExpert(expert.id, expert.name)}
                        >
                          Request Consultation
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No experts found</p>
                <p className="text-sm text-gray-500">Experts are verified specialists in the poultry industry.</p>
              </div>
            )}
            
            {filteredExperts.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Find More Experts</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Discussion Forum Tab */}
          <TabsContent value="forum" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Discussions</h3>
              <Dialog open={threadDialogOpen} onOpenChange={setThreadDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                  >
                    <ListPlus className="h-4 w-4 mr-2" />
                    Start New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, questions, or insights with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...threadForm}>
                    <form onSubmit={threadForm.handleSubmit(onSubmitThread)} className="space-y-4">
                      <FormField
                        control={threadForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a descriptive title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={threadForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="farm_management">Farm Management</SelectItem>
                                <SelectItem value="health">Health</SelectItem>
                                <SelectItem value="nutrition">Nutrition</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={threadForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share your thoughts, questions, or insights..." 
                                className="min-h-[150px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setThreadDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          disabled={threadForm.formState.isSubmitting}
                        >
                          {threadForm.formState.isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Posting...
                            </>
                          ) : (
                            "Post Discussion"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : filteredThreads.length > 0 ? (
              <div className="space-y-4">
                {filteredThreads.map((thread) => (
                  <motion.div 
                    key={thread.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={thread.is_pinned ? "border-l-4 border-l-amber-500" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              {thread.is_pinned && (
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                  Pinned
                                </Badge>
                              )}
                              <CardTitle className="text-lg">{thread.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={thread.author_image} alt={thread.author_name} />
                                <AvatarFallback>{thread.author_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <CardDescription>
                                Posted by {thread.author_name} • {new Date(thread.created_at).toLocaleDateString()}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={
                            thread.category === 'health' 
                              ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                              : thread.category === 'nutrition'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : thread.category === 'farm_management'
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              : thread.category === 'marketing'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                          }>
                            {thread.category.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{thread.content}</p>
                      </CardContent>
                      <CardFooter className="py-2 flex justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                            <span>{thread.replies_count} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-gray-500" />
                            <span>{thread.likes_count} likes</span>
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
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No discussions found</p>
                <Button 
                  onClick={() => setThreadDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start First Discussion
                </Button>
              </div>
            )}
            
            {filteredThreads.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">Load More Discussions</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Events Tab */}
          <TabsContent value="events" className="mt-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upcoming Industry Events</h3>
              <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Submit Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Submit a New Event</DialogTitle>
                    <DialogDescription>
                      Share an upcoming poultry industry event with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...eventForm}>
                    <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-4">
                      <FormField
                        control={eventForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter event title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={eventForm.control}
                          name="organizer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organizer</FormLabel>
                              <FormControl>
                                <Input placeholder="Organizing entity" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={eventForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="conference">Conference</SelectItem>
                                  <SelectItem value="workshop">Workshop</SelectItem>
                                  <SelectItem value="exhibition">Exhibition</SelectItem>
                                  <SelectItem value="webinar">Webinar</SelectItem>
                                  <SelectItem value="seminar">Seminar</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={eventForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input placeholder="May 15-16, 2025" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={eventForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State or Online" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={eventForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide a description of the event..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEventDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          disabled={eventForm.formState.isSubmitting}
                        >
                          {eventForm.formState.isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Event"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
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
                            event.type === 'conference' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                              : event.type === 'workshop'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : event.type === 'webinar'
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                          }>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
                            <p>{event.attendees_count} attending</p>
                          </div>
                        </div>
                        {event.description && (
                          <p className="mt-3 text-sm text-gray-600 line-clamp-3">{event.description}</p>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 flex justify-end">
                        <Button 
                          className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                          size="sm"
                          onClick={() => handleRegisterEvent(event.id, event.title)}
                        >
                          Register Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">No events found</p>
                <Button 
                  onClick={() => setEventDialogOpen(true)}
                  className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit First Event
                </Button>
              </div>
            )}
            
            {filteredEvents.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline">View All Events</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Network;

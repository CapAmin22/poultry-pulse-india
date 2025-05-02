
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  User, 
  Briefcase,
  MessageCircle,
  Search,
  FileText,
  MapPin,
  Building,
  Clock,
  Award,
  CheckCircle,
  Plus,
  Heart,
  Share2,
  Send
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Farmer, Expert, Event, JobListing, NetworkPost } from '@/types/network';

const Network: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Profile registration state
  const [showFarmerProfile, setShowFarmerProfile] = useState(false);
  const [showExpertProfile, setShowExpertProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [farmType, setFarmType] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');

  // New post state
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');

  // Event & job dialog state
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [eventContact, setEventContact] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [jobSalary, setJobSalary] = useState('');
  const [jobContactEmail, setJobContactEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchNetworkData();
    }
  }, [user]);

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFarmers(),
        fetchExperts(),
        fetchEvents(),
        fetchJobs(),
        fetchPosts()
      ]);
    } catch (error) {
      console.error('Error fetching network data:', error);
      toast({
        variant: "destructive",
        title: "Error fetching network data",
        description: "Please try refreshing the page."
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmers = async () => {
    const { data, error } = await supabase.from('farmers').select('*');
    if (error) throw error;
    setFarmers(data as Farmer[]);
  };

  const fetchExperts = async () => {
    const { data, error } = await supabase.from('experts').select('*');
    if (error) throw error;
    // Make sure each expert has the required 'location' field even if it's missing
    const typedData = data.map(expert => ({
      ...expert,
      location: expert.location || 'Not specified'
    })) as Expert[];
    setExperts(typedData);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw error;
    setEvents(data as Event[]);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase.from('job_listings').select('*');
    if (error) throw error;
    setJobs(data as JobListing[]);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('network_posts').select('*');
    if (error) throw error;
    setPosts(data as NetworkPost[]);
  };

  const handleAddFarmerProfile = async () => {
    if (!user) return;
    
    try {
      const farmerProfile: Farmer = {
        user_id: user.id,
        name: profileName,
        location: profileLocation,
        farm_type: farmType,
        farm_size: farmSize,
        expertise: expertise,
        experience: experience,
        contact_number: contactNumber,
        image_url: profileImage
      };
      
      const { data, error } = await supabase
        .from('farmers')
        .insert(farmerProfile);
      
      if (error) throw error;
      
      toast({
        title: "Profile created",
        description: "Your farmer profile has been created successfully."
      });
      
      setShowFarmerProfile(false);
      fetchFarmers();
      
      // Reset form
      resetProfileForm();
    } catch (error) {
      console.error('Error creating farmer profile:', error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: "Please try again later."
      });
    }
  };

  const handleAddExpertProfile = async () => {
    if (!user) return;
    
    try {
      const expertProfile: Expert = {
        user_id: user.id,
        name: profileName,
        title: title,
        organization: organization,
        expertise: expertise,
        experience: experience,
        location: profileLocation,
        image_url: profileImage,
        verified: false
      };
      
      const { data, error } = await supabase
        .from('experts')
        .insert(expertProfile);
      
      if (error) throw error;
      
      toast({
        title: "Profile created",
        description: "Your expert profile has been created successfully. It will be verified by an admin."
      });
      
      setShowExpertProfile(false);
      fetchExperts();
      
      // Reset form
      resetProfileForm();
    } catch (error) {
      console.error('Error creating expert profile:', error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: "Please try again later."
      });
    }
  };
  
  const handleAddEvent = async () => {
    if (!user) return;
    
    try {
      const newEvent: Omit<Event, 'id'> = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        location: eventLocation,
        image_url: eventImage,
        organizer: eventOrganizer,
        contact: eventContact,
        category: eventCategory
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(newEvent);
      
      if (error) throw error;
      
      toast({
        title: "Event added",
        description: "The event has been added successfully."
      });
      
      setShowEventDialog(false);
      fetchEvents();
      
      // Reset form
      resetEventForm();
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        variant: "destructive",
        title: "Error adding event",
        description: "Please try again later."
      });
    }
  };
  
  const handleAddJob = async () => {
    if (!user) return;
    
    try {
      const newJob: Omit<JobListing, 'id'> = {
        title: jobTitle,
        company: jobCompany,
        location: jobLocation,
        description: jobDescription,
        requirements: jobRequirements,
        salary_range: jobSalary,
        contact_email: jobContactEmail
      };
      
      const { data, error } = await supabase
        .from('job_listings')
        .insert(newJob);
      
      if (error) throw error;
      
      toast({
        title: "Job listing added",
        description: "The job listing has been added successfully."
      });
      
      setShowJobDialog(false);
      fetchJobs();
      
      // Reset form
      resetJobForm();
    } catch (error) {
      console.error('Error adding job listing:', error);
      toast({
        variant: "destructive",
        title: "Error adding job listing",
        description: "Please try again later."
      });
    }
  };
  
  const handleAddPost = async () => {
    if (!user) return;
    
    try {
      const newPost: Omit<NetworkPost, 'id' | 'likes' | 'comments'> = {
        user_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        author_image: user.user_metadata?.avatar_url || '',
        content: postContent,
        image_url: postImage,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('network_posts')
        .insert({
          ...newPost,
          likes: 0,
          comments: 0
        });
      
      if (error) throw error;
      
      toast({
        title: "Post published",
        description: "Your post has been published successfully."
      });
      
      setShowPostDialog(false);
      fetchPosts();
      
      // Reset form
      setPostContent('');
      setPostImage('');
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        variant: "destructive",
        title: "Error publishing post",
        description: "Please try again later."
      });
    }
  };
  
  // Helper function to reset form fields
  const resetProfileForm = () => {
    setProfileName('');
    setProfileLocation('');
    setFarmType('');
    setFarmSize('');
    setExpertise([]);
    setExperience('');
    setContactNumber('');
    setProfileImage('');
    setOrganization('');
    setTitle('');
  };
  
  const resetEventForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventDate('');
    setEventLocation('');
    setEventImage('');
    setEventOrganizer('');
    setEventContact('');
    setEventCategory('');
  };
  
  const resetJobForm = () => {
    setJobTitle('');
    setJobCompany('');
    setJobLocation('');
    setJobDescription('');
    setJobRequirements([]);
    setJobSalary('');
    setJobContactEmail('');
  };

  // Filter functions
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farmer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         farmer.farm_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise === 'all' || 
                            (farmer.expertise && farmer.expertise.includes(selectedExpertise));
    
    const matchesLocation = selectedLocation === 'all' ||
                           farmer.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesExpertise && matchesLocation;
  });

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedExpertise === 'all' || 
                            expert.expertise.includes(selectedExpertise);
    
    const matchesLocation = selectedLocation === 'all' ||
                           expert.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesExpertise && matchesLocation;
  });

  // Get unique locations and expertise areas for filters
  const locations = [...new Set([
    ...farmers.map(farmer => farmer.location),
    ...experts.map(expert => expert.location)
  ])].filter(location => location);

  const expertiseAreas = [...new Set([
    ...farmers.flatMap(farmer => farmer.expertise || []),
    ...experts.flatMap(expert => expert.expertise)
  ])].filter(exp => exp);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 md:p-8 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Poultry Network</h1>
              <p className="text-gray-600 mt-2">Connect with farmers, experts, and industry professionals</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button 
                variant="outline"
                className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
                onClick={() => setShowPostDialog(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" /> Create Post
              </Button>
              {isAdmin && (
                <>
                  <Button 
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={() => setShowEventDialog(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Add Event
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => setShowJobDialog(true)}
                  >
                    <Briefcase className="h-4 w-4 mr-2" /> Add Job
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Create Profile Card - if user doesn't have a profile */}
        {user && !loading && !farmers.some(f => f.user_id === user.id) && !experts.some(e => e.user_id === user.id) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-medium mb-3">Complete Your Network Profile</h2>
            <p className="text-gray-600 mb-4">Creating a profile helps you connect with others in the poultry industry and showcase your expertise.</p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowFarmerProfile(true)}
                className="bg-[#ea384c] hover:bg-[#d02f3d]"
              >
                Create Farmer Profile
              </Button>
              <Button 
                variant="outline"
                className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
                onClick={() => setShowExpertProfile(true)}
              >
                Create Expert Profile
              </Button>
            </div>
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search network..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select
              value={selectedExpertise}
              onValueChange={setSelectedExpertise}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Expertise</SelectItem>
                {expertiseAreas.map((exp, i) => (
                  <SelectItem key={i} value={exp}>{exp}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc, i) => (
                  <SelectItem key={i} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="community" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="pt-6 space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading community members...</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Community Posts</h2>
                  {posts.length === 0 ? (
                    <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                      <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
                      <p className="text-gray-500 mt-1 max-w-md mx-auto">
                        Be the first to create a post in the community!
                      </p>
                      <Button
                        className="mt-4 bg-[#ea384c] hover:bg-[#d02f3d]"
                        onClick={() => setShowPostDialog(true)}
                      >
                        Create Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {posts.map(post => (
                        <Card key={post.id} className="overflow-hidden">
                          <CardHeader className="pb-3 pt-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={post.author_image} />
                                <AvatarFallback>{post.author_name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{post.author_name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(post.created_at).toLocaleDateString()} · {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pb-2">
                            <p className="whitespace-pre-line">{post.content}</p>
                            {post.image_url && (
                              <div className="mt-3">
                                <img 
                                  src={post.image_url} 
                                  alt="Post attachment" 
                                  className="rounded-md max-h-[300px] w-auto object-cover" 
                                />
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="border-t border-gray-100 bg-gray-50 py-2">
                            <div className="flex w-full justify-between">
                              <Button variant="ghost" size="sm" className="text-gray-600">
                                <Heart className="h-4 w-4 mr-1" /> {post.likes || 0}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600">
                                <MessageCircle className="h-4 w-4 mr-1" /> {post.comments || 0}
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-600">
                                <Share2 className="h-4 w-4 mr-1" /> Share
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Community Members</h2>
                  {filteredFarmers.length === 0 ? (
                    <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                      <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-gray-700">No farmers found</h3>
                      <p className="text-gray-500 mt-1 max-w-md mx-auto">
                        No farmers match your search criteria. Try changing your filters.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredFarmers.map(farmer => (
                        <Card key={farmer.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="p-5">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-14 w-14 border-2 border-gray-100">
                                  <AvatarImage src={farmer.image_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(farmer.name)} />
                                  <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{farmer.name}</p>
                                  <p className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> {farmer.location}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-4 space-y-2">
                                <div className="flex items-start">
                                  <Building className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium">Farm Type</p>
                                    <p className="text-xs text-gray-600">{farmer.farm_type}</p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <Clock className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium">Farm Size</p>
                                    <p className="text-xs text-gray-600">{farmer.farm_size}</p>
                                  </div>
                                </div>
                                {farmer.expertise && farmer.expertise.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium mb-1">Expertise</p>
                                    <div className="flex flex-wrap gap-1">
                                      {farmer.expertise.map((exp, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                                          {exp}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                              <Button variant="outline" size="sm">
                                Connect
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="experts" className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Industry Experts</h2>
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading experts...</p>
                </div>
              ) : filteredExperts.length === 0 ? (
                <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">No experts found</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    No experts match your search criteria. Try changing your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredExperts.map(expert => (
                    <Card key={expert.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-5">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-14 w-14 border-2 border-gray-100">
                              <AvatarImage src={expert.image_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(expert.name)} />
                              <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium">{expert.name}</p>
                                {expert.verified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{expert.title}</p>
                              <p className="text-xs text-gray-500">{expert.organization}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-2">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-xs text-gray-600">{expert.location}</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Award className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium">Experience</p>
                                <p className="text-xs text-gray-600">{expert.experience}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Expertise</p>
                              <div className="flex flex-wrap gap-1">
                                {expert.expertise.map((exp, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                                    {exp}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                          <Button variant="outline" size="sm">
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                {isAdmin && (
                  <Button 
                    onClick={() => setShowEventDialog(true)}
                    className="bg-[#ea384c] hover:bg-[#d02f3d]"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Event
                  </Button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">No events found</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    There are no upcoming events at this time. Check back later for new events.
                  </p>
                  {isAdmin && (
                    <Button 
                      className="mt-4 bg-[#ea384c] hover:bg-[#d02f3d]"
                      onClick={() => setShowEventDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Event
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="p-5">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <p className="text-sm text-gray-600">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                              <p className="text-sm text-gray-600">{event.location}</p>
                            </div>
                            {event.organizer && (
                              <div className="flex items-center">
                                <Building className="h-4 w-4 text-gray-500 mr-2" />
                                <p className="text-sm text-gray-600">{event.organizer}</p>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                            {event.description}
                          </p>
                          
                          {event.category && (
                            <Badge className="mt-3" variant="secondary">
                              {event.category}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
                          <Button variant="ghost" size="sm">
                            Share
                          </Button>
                          <Button className="bg-[#ea384c] hover:bg-[#d02f3d]">
                            Register
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Job Opportunities</h2>
                {isAdmin && (
                  <Button 
                    onClick={() => setShowJobDialog(true)}
                    className="bg-[#ea384c] hover:bg-[#d02f3d]"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Post Job
                  </Button>
                )}
              </div>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea384c] mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading job listings...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center bg-gray-50 py-12 rounded-lg border border-dashed border-gray-300">
                  <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">No job listings found</h3>
                  <p className="text-gray-500 mt-1 max-w-md mx-auto">
                    There are no job opportunities available at this time. Check back later for new listings.
                  </p>
                  {isAdmin && (
                    <Button 
                      className="mt-4 bg-[#ea384c] hover:bg-[#d02f3d]"
                      onClick={() => setShowJobDialog(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Post Job
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {jobs.map(job => (
                    <Card key={job.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription>
                              {job.company} · {job.location}
                            </CardDescription>
                          </div>
                          {job.salary_range && (
                            <Badge variant="secondary">
                              {job.salary_range}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {job.description}
                        </p>
                        
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                              {job.requirements.slice(0, 3).map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                              {job.requirements.length > 3 && (
                                <li className="text-[#ea384c]">+{job.requirements.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          Posted {new Date(job.created_at || '').toLocaleDateString()}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-end">
                        <Button className="bg-[#ea384c] hover:bg-[#d02f3d]">
                          Apply Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Farmer Profile Dialog */}
      <Dialog open={showFarmerProfile} onOpenChange={setShowFarmerProfile}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Farmer Profile</DialogTitle>
            <DialogDescription>
              Fill out your profile to connect with other industry professionals.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input 
                id="profile-name"
                placeholder="Your name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-location">Location</Label>
              <Input 
                id="profile-location"
                placeholder="City, State"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="farm-type">Farm Type</Label>
              <Select value={farmType} onValueChange={setFarmType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Layer Farm">Layer Farm</SelectItem>
                  <SelectItem value="Broiler Farm">Broiler Farm</SelectItem>
                  <SelectItem value="Breeding Farm">Breeding Farm</SelectItem>
                  <SelectItem value="Hatchery">Hatchery</SelectItem>
                  <SelectItem value="Mixed Farm">Mixed Farm</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="farm-size">Farm Size</Label>
              <Select value={farmSize} onValueChange={setFarmSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small (<5,000 birds)">Small (&lt;5,000 birds)</SelectItem>
                  <SelectItem value="Medium (5,000-20,000 birds)">Medium (5,000-20,000 birds)</SelectItem>
                  <SelectItem value="Large (20,000-50,000 birds)">Large (20,000-50,000 birds)</SelectItem>
                  <SelectItem value="Very Large (>50,000 birds)">Very Large (&gt;50,000 birds)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Areas of Expertise</Label>
              <div className="flex flex-wrap gap-2">
                {['Broiler Management', 'Layer Production', 'Poultry Health', 'Feed Management', 'Breeding', 'Marketing', 'Processing'].map(exp => (
                  <Button 
                    key={exp}
                    type="button"
                    variant={expertise.includes(exp) ? "default" : "outline"}
                    className={expertise.includes(exp) ? "bg-[#ea384c] hover:bg-[#d02f3d]" : ""}
                    size="sm"
                    onClick={() => {
                      if (expertise.includes(exp)) {
                        setExpertise(expertise.filter(e => e !== exp));
                      } else {
                        setExpertise([...expertise, exp]);
                      }
                    }}
                  >
                    {exp}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                  <SelectItem value="1-5 years">1-5 years</SelectItem>
                  <SelectItem value="6-10 years">6-10 years</SelectItem>
                  <SelectItem value="11-20 years">11-20 years</SelectItem>
                  <SelectItem value="More than 20 years">More than 20 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact-number">Contact Number (Optional)</Label>
              <Input 
                id="contact-number"
                placeholder="Your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile Image URL (Optional)</Label>
              <Input 
                id="profile-image"
                placeholder="URL to your profile image"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFarmerProfile(false)}>Cancel</Button>
            <Button onClick={handleAddFarmerProfile} className="bg-[#ea384c] hover:bg-[#d02f3d]">Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Profile Dialog */}
      <Dialog open={showExpertProfile} onOpenChange={setShowExpertProfile}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Expert Profile</DialogTitle>
            <DialogDescription>
              Fill out your expert profile to share your knowledge with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full Name</Label>
              <Input 
                id="profile-name"
                placeholder="Your name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-title">Professional Title</Label>
              <Input 
                id="profile-title"
                placeholder="e.g. Poultry Veterinarian, Nutritionist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-organization">Organization</Label>
              <Input 
                id="profile-organization"
                placeholder="Your organization or company"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-location">Location</Label>
              <Input 
                id="profile-location"
                placeholder="City, State"
                value={profileLocation}
                onChange={(e) => setProfileLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Areas of Expertise</Label>
              <div className="flex flex-wrap gap-2">
                {['Poultry Health', 'Nutrition', 'Farm Management', 'Biosecurity', 'Breeding', 'Processing', 'Economics', 'Research', 'Marketing', 'Technology'].map(exp => (
                  <Button 
                    key={exp}
                    type="button"
                    variant={expertise.includes(exp) ? "default" : "outline"}
                    className={expertise.includes(exp) ? "bg-[#ea384c] hover:bg-[#d02f3d]" : ""}
                    size="sm"
                    onClick={() => {
                      if (expertise.includes(exp)) {
                        setExpertise(expertise.filter(e => e !== exp));
                      } else {
                        setExpertise([...expertise, exp]);
                      }
                    }}
                  >
                    {exp}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                  <SelectItem value="1-5 years">1-5 years</SelectItem>
                  <SelectItem value="6-10 years">6-10 years</SelectItem>
                  <SelectItem value="11-20 years">11-20 years</SelectItem>
                  <SelectItem value="More than 20 years">More than 20 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="profile-image">Profile Image URL (Optional)</Label>
              <Input 
                id="profile-image"
                placeholder="URL to your profile image"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpertProfile(false)}>Cancel</Button>
            <Button onClick={handleAddExpertProfile} className="bg-[#ea384c] hover:bg-[#d02f3d]">Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Share updates, information, or questions with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">Message</Label>
              <Textarea 
                id="post-content"
                placeholder="What would you like to share?"
                className="min-h-[120px]"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-image">Image URL (Optional)</Label>
              <Input 
                id="post-image"
                placeholder="URL to an image you'd like to share"
                value={postImage}
                onChange={(e) => setPostImage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPostDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddPost}
              className="bg-[#ea384c] hover:bg-[#d02f3d]"
              disabled={!postContent.trim()}
            >
              <Send className="h-4 w-4 mr-2" /> Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog (Admin Only) */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
            <DialogDescription>
              Create a new event for the poultry community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input 
                id="event-title"
                placeholder="Title of the event"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea 
                id="event-description"
                placeholder="Details about the event"
                className="min-h-[100px]"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input 
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-location">Location</Label>
                <Input 
                  id="event-location"
                  placeholder="Event venue"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-category">Category</Label>
              <Select value={eventCategory} onValueChange={setEventCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-organizer">Organizer</Label>
              <Input 
                id="event-organizer"
                placeholder="Name of organizing body"
                value={eventOrganizer}
                onChange={(e) => setEventOrganizer(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-contact">Contact</Label>
              <Input 
                id="event-contact"
                placeholder="Contact information for inquiries"
                value={eventContact}
                onChange={(e) => setEventContact(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-image">Image URL</Label>
              <Input 
                id="event-image"
                placeholder="URL to event banner or image"
                value={eventImage}
                onChange={(e) => setEventImage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEvent} className="bg-[#ea384c] hover:bg-[#d02f3d]">Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Job Dialog (Admin Only) */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Job Listing</DialogTitle>
            <DialogDescription>
              Create a new job opportunity for the poultry community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input 
                id="job-title"
                placeholder="Position title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-company">Company</Label>
                <Input 
                  id="job-company"
                  placeholder="Company name"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-location">Location</Label>
                <Input 
                  id="job-location"
                  placeholder="Job location"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-description">Description</Label>
              <Textarea 
                id="job-description"
                placeholder="Job description and responsibilities"
                className="min-h-[100px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-requirements">Requirements (one per line)</Label>
              <Textarea 
                id="job-requirements"
                placeholder="Enter each requirement on a new line"
                className="min-h-[100px]"
                value={jobRequirements.join('\n')}
                onChange={(e) => setJobRequirements(e.target.value.split('\n').filter(line => line.trim()))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-salary">Salary Range (Optional)</Label>
              <Input 
                id="job-salary"
                placeholder="e.g. ₹40,000 - ₹60,000 per month"
                value={jobSalary}
                onChange={(e) => setJobSalary(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="job-email">Contact Email</Label>
              <Input 
                id="job-email"
                type="email"
                placeholder="Email for applications"
                value={jobContactEmail}
                onChange={(e) => setJobContactEmail(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>Cancel</Button>
            <Button onClick={handleAddJob} className="bg-[#ea384c] hover:bg-[#d02f3d]">Post Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Network;

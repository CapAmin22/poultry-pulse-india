
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Building, Calendar, Briefcase, Users, MessageSquare, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Farmer, Expert, Event, JobListing, NetworkPost } from '@/types/network';
import { useAuth } from '@/hooks/use-auth';

// Custom type for filtering options
type FilterOption = 'location' | 'experience' | 'farm_type' | 'expertise' | 'all';

const Network: React.FC = () => {
  // Authentication state
  const { user, isAdmin } = useAuth();
  
  // State for network data
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    farmers: true,
    experts: true,
    events: true,
    jobs: true,
    posts: true,
  });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterOption>('all');
  
  const { toast } = useToast();
  
  // Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Fetch farmers
        setLoading(prev => ({ ...prev, farmers: true }));
        const { data: farmersData, error: farmersError } = await supabase
          .from('network_farmers')
          .select('*');
          
        if (farmersError) throw farmersError;
        setFarmers(farmersData as Farmer[]);
        setLoading(prev => ({ ...prev, farmers: false }));
        
        // Fetch experts
        setLoading(prev => ({ ...prev, experts: true }));
        const { data: expertsData, error: expertsError } = await supabase
          .from('network_experts')
          .select('*');
          
        if (expertsError) throw expertsError;
        setExperts(expertsData as Expert[]);
        setLoading(prev => ({ ...prev, experts: false }));
        
        // Fetch events
        setLoading(prev => ({ ...prev, events: true }));
        const { data: eventsData, error: eventsError } = await supabase
          .from('network_events')
          .select('*');
          
        if (eventsError) throw eventsError;
        setEvents(eventsData as Event[]);
        setLoading(prev => ({ ...prev, events: false }));
        
        // Fetch job listings
        setLoading(prev => ({ ...prev, jobs: true }));
        // Note: This table needs to be created in Supabase
        const { data: jobsData, error: jobsError } = await supabase
          .from('network_job_listings')
          .select('*');
          
        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
          setJobs([]); // Provide empty array as fallback
        } else {
          setJobs(jobsData as JobListing[]);
        }
        setLoading(prev => ({ ...prev, jobs: false }));
        
        // Fetch posts
        setLoading(prev => ({ ...prev, posts: true }));
        // Note: This table needs to be created in Supabase
        const { data: postsData, error: postsError } = await supabase
          .from('network_posts')
          .select('*');
          
        if (postsError) {
          console.error('Error fetching posts:', postsError);
          setPosts([]); // Provide empty array as fallback
        } else {
          setPosts(postsData as NetworkPost[]);
        }
        setLoading(prev => ({ ...prev, posts: false }));
        
      } catch (error) {
        console.error('Error fetching network data:', error);
        toast({
          title: "Error",
          description: "Failed to load network data. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    fetchNetworkData();
  }, [toast]);
  
  // Filter functions
  const filterFarmers = () => {
    if (!searchTerm) return farmers;
    
    return farmers.filter(farmer => {
      if (filterType === 'all') {
        return (
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          farmer.farm_type.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'location') {
        return farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (filterType === 'farm_type') {
        return farmer.farm_type.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (filterType === 'expertise' && farmer.expertise) {
        return farmer.expertise.some(e => 
          e.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
  };
  
  const filterExperts = () => {
    if (!searchTerm) return experts;
    
    return experts.filter(expert => {
      if (filterType === 'all') {
        return (
          expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expert.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'location') {
        return expert.location.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (filterType === 'expertise' && expert.expertise) {
        return expert.expertise.some(e => 
          e.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
  };
  
  const filterEvents = () => {
    if (!searchTerm) return events;
    
    return events.filter(event => {
      if (filterType === 'all') {
        return (
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'location') {
        return event.location.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };
  
  const filterJobs = () => {
    if (!searchTerm) return jobs;
    
    return jobs.filter(job => {
      if (filterType === 'all') {
        return (
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (filterType === 'location') {
        return job.location.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };
  
  // Render loading state
  const renderLoading = (section: string) => (
    <div className="flex justify-center items-center h-48">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-[#ea384c] border-gray-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500">Loading {section}...</p>
      </div>
    </div>
  );
  
  // Render empty state
  const renderEmpty = (message: string) => (
    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Users className="h-12 w-12 text-gray-400" />
      <p className="mt-2 text-lg font-medium text-gray-500">{message}</p>
      <p className="mt-1 text-sm text-gray-400">No data found matching your criteria.</p>
    </div>
  );
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Industry Network</h1>
              <p className="text-gray-600">Connect with farmers, experts, and industry professionals</p>
            </div>
            
            {isAdmin && (
              <Button 
                className="mt-4 md:mt-0 bg-[#ea384c] hover:bg-[#d02f3d]"
                onClick={() => toast({
                  title: "Admin Action",
                  description: "This would open the admin content management panel",
                })}
              >
                Admin: Manage Network
              </Button>
            )}
          </div>
          
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search the network..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter by: {filterType === 'all' ? 'All' : filterType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType('all')}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('location')}>Location</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('experience')}>Experience</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('farm_type')}>Farm Type</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('expertise')}>Expertise</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="farmers">
            <TabsList className="mb-8">
              <TabsTrigger value="farmers">Farmers</TabsTrigger>
              <TabsTrigger value="experts">Experts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="jobs">Job Listings</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>
            
            {/* Farmers Tab */}
            <TabsContent value="farmers">
              {loading.farmers ? (
                renderLoading('farmers')
              ) : (
                <div>
                  {filterFarmers().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterFarmers().map((farmer) => (
                        <Card key={farmer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-start">
                              <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src={farmer.image_url} />
                                <AvatarFallback className="bg-[#ea384c] text-white">
                                  {farmer.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{farmer.name}</CardTitle>
                                <p className="text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" /> {farmer.location}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Farm Type</p>
                                <p className="text-sm text-gray-700">{farmer.farm_type}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium">Farm Size</p>
                                <p className="text-sm text-gray-700">{farmer.farm_size}</p>
                              </div>
                              
                              {farmer.expertise && (
                                <div>
                                  <p className="text-sm font-medium">Expertise</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {farmer.expertise.map((item, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[#ea384c] border-[#ea384c] hover:bg-[#ea384c]/10 w-full"
                              onClick={() => {
                                toast({
                                  title: "Contact Requested",
                                  description: `We'll notify you when ${farmer.name} accepts your connection.`
                                });
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Connect
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmpty('No farmers found')}
                </div>
              )}
            </TabsContent>
            
            {/* Experts Tab */}
            <TabsContent value="experts">
              {loading.experts ? (
                renderLoading('experts')
              ) : (
                <div>
                  {filterExperts().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filterExperts().map((expert) => (
                        <Card key={expert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-start">
                              <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src={expert.image_url} />
                                <AvatarFallback className="bg-[#0066b2] text-white">
                                  {expert.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                                  {expert.verified && (
                                    <Badge variant="outline" className="border-blue-500 text-blue-500">
                                      <Award className="h-3 w-3 mr-1" /> Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-[#0066b2]">{expert.title}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Building className="h-3 w-3 mr-1" /> {expert.organization}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Location</p>
                                <p className="text-sm text-gray-700 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" /> {expert.location}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium">Experience</p>
                                <p className="text-sm text-gray-700">{expert.experience}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium">Expertise</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {expert.expertise.map((item, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-[#0066b2] border-[#0066b2] hover:bg-[#0066b2]/10 w-full"
                              onClick={() => {
                                toast({
                                  title: "Expert Contact",
                                  description: `We'll notify ${expert.name} of your interest in connecting.`
                                });
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Request Consultation
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmpty('No experts found')}
                </div>
              )}
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events">
              {loading.events ? (
                renderLoading('events')
              ) : (
                <div>
                  {filterEvents().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filterEvents().map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          {event.image_url && (
                            <div className="h-48 w-full overflow-hidden">
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{event.date}</span>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <p className="text-sm text-gray-700">{event.description}</p>
                            
                            {event.organizer && (
                              <div className="mt-4">
                                <p className="text-sm font-medium">Organized by</p>
                                <p className="text-sm text-gray-700">{event.organizer}</p>
                              </div>
                            )}
                          </CardContent>
                          
                          <CardFooter className="pt-2">
                            <Button 
                              className="bg-[#ea384c] hover:bg-[#d02f3d] w-full"
                              onClick={() => {
                                toast({
                                  title: "RSVP Confirmed",
                                  description: `You've registered for ${event.title}. We'll send you the details.`
                                });
                              }}
                            >
                              Register for Event
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : renderEmpty('No events found')}
                </div>
              )}
            </TabsContent>
            
            {/* Job Listings Tab */}
            <TabsContent value="jobs">
              {loading.jobs ? (
                renderLoading('job listings')
              ) : (
                <div>
                  {filterJobs().length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filterJobs().map((job) => (
                        <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <p className="text-lg font-medium text-[#0066b2]">{job.company}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">New</Badge>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{job.location}</span>
                              {job.salary_range && (
                                <>
                                  <Separator orientation="vertical" className="mx-2 h-4" />
                                  <span>₹{job.salary_range}</span>
                                </>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <p className="text-sm text-gray-700 mb-4">{job.description}</p>
                            
                            <div>
                              <p className="text-sm font-medium">Requirements</p>
                              <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-2 flex justify-between">
                            <Button 
                              variant="outline" 
                              className="flex-1 mr-2"
                              onClick={() => {
                                toast({
                                  title: "Job Saved",
                                  description: "This job has been saved to your profile."
                                });
                              }}
                            >
                              Save
                            </Button>
                            <Button 
                              className="bg-[#0066b2] hover:bg-[#0055a3] flex-1"
                              onClick={() => {
                                toast({
                                  title: "Application Started",
                                  description: "Complete your application for this position."
                                });
                              }}
                            >
                              Apply Now
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-300 mx-auto" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No job listings yet</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Job listings will appear here once available. Check back soon as we're adding new opportunities regularly.
                      </p>
                      <Button 
                        className="mt-6 bg-[#ea384c] hover:bg-[#d02f3d]"
                        onClick={() => {
                          toast({
                            title: "Job Alerts Enabled",
                            description: "You'll be notified when new jobs are posted."
                          });
                        }}
                      >
                        Create Job Alert
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Discussions Tab */}
            <TabsContent value="discussions">
              <div className="flex justify-end mb-4">
                <Button 
                  className="bg-[#ea384c] hover:bg-[#d02f3d]"
                  onClick={() => {
                    toast({
                      title: "Create Post",
                      description: "This would open a modal to create a new discussion post"
                    });
                  }}
                >
                  Start a Discussion
                </Button>
              </div>
              
              {loading.posts ? (
                renderLoading('discussions')
              ) : (
                <div className="space-y-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={post.author_image} />
                              <AvatarFallback className="bg-[#ea384c] text-white">
                                {post.author_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{post.author_name}</p>
                              <p className="text-xs text-gray-500">{post.created_at}</p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-2">
                          <p className="text-gray-700">{post.content}</p>
                          
                          {post.image_url && (
                            <div className="mt-3">
                              <img 
                                src={post.image_url} 
                                alt="Post attachment" 
                                className="rounded-md max-h-80 w-auto"
                              />
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-2 border-t border-gray-100 flex justify-between">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-600"
                            onClick={() => {
                              toast({
                                title: "Post Liked",
                                description: "You liked this post."
                              });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {post.likes}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-600"
                            onClick={() => {
                              toast({
                                title: "Comment",
                                description: "This would open the comment section."
                              });
                            }}
                          >
                            <MessageSquare className="h-5 w-5 mr-1" />
                            {post.comments}
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-600"
                            onClick={() => {
                              toast({
                                title: "Share",
                                description: "This would open sharing options."
                              });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No discussions yet</h3>
                      <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Be the first to start a discussion in the community. Share your thoughts, questions, or insights.
                      </p>
                      <Button 
                        className="mt-6 bg-[#ea384c] hover:bg-[#d02f3d]"
                        onClick={() => {
                          toast({
                            title: "Start Discussion",
                            description: "This would open a form to create your first post."
                          });
                        }}
                      >
                        Start First Discussion
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Network;

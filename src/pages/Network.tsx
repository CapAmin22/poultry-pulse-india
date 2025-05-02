
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Plus, Search, Filter, Calendar, MessageCircle, Users, Award, UserCheck } from "lucide-react";

interface NetworkProfile {
  id: string;
  name: string;
  location: string;
  experience: string;
  image_url?: string;
}

interface Farmer extends NetworkProfile {
  farm_size: string;
  farm_type: string;
  expertise: string[];
  contact_number?: string;
}

interface Expert extends NetworkProfile {
  title: string;
  organization: string;
  expertise: string[];
  verified: boolean;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  is_pinned: boolean;
  user_id: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  organizer: string;
  description?: string;
  attendees_count: number;
}

const NetworkPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("farmers");
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // New form states
  const [showFarmerForm, setShowFarmerForm] = useState(false);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // New farmer form
  const [newFarmer, setNewFarmer] = useState<Partial<Farmer>>({
    name: "",
    location: "",
    experience: "",
    farm_size: "",
    farm_type: "",
    expertise: [],
    contact_number: "",
    image_url: ""
  });

  // New expert form
  const [newExpert, setNewExpert] = useState<Partial<Expert>>({
    name: "",
    title: "",
    organization: "",
    location: "",
    experience: "",
    expertise: [],
    verified: false,
    image_url: ""
  });

  // New discussion form
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    category: "",
    content: ""
  });

  // New event form
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    location: "",
    type: "",
    organizer: "",
    description: ""
  });

  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true);
      try {
        // Fetch farmers
        const { data: farmersData, error: farmersError } = await supabase
          .from('network_farmers')
          .select('*');

        if (farmersError) throw farmersError;
        setFarmers(farmersData || []);

        // Fetch experts
        const { data: expertsData, error: expertsError } = await supabase
          .from('network_experts')
          .select('*');

        if (expertsError) throw expertsError;
        setExperts(expertsData || []);

        // Fetch discussions
        const { data: discussionsData, error: discussionsError } = await supabase
          .from('network_discussions')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (discussionsError) throw discussionsError;
        setDiscussions(discussionsData || []);

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from('network_events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData || []);

      } catch (error) {
        console.error("Error fetching network data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load network data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkData();
  }, []);

  const handleAddFarmer = async () => {
    if (!newFarmer.name || !newFarmer.location || !newFarmer.farm_type) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setFormSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('network_farmers')
        .insert({
          ...newFarmer,
          user_id: user?.id || null,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Farmer Profile Added",
        description: "The farmer profile has been added successfully.",
      });

      if (data) {
        setFarmers([...farmers, data[0] as Farmer]);
      }

      setShowFarmerForm(false);
      setNewFarmer({
        name: "",
        location: "",
        experience: "",
        farm_size: "",
        farm_type: "",
        expertise: [],
        contact_number: "",
        image_url: ""
      });
    } catch (error) {
      console.error("Error adding farmer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add farmer profile. Please try again.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAddExpert = async () => {
    if (!newExpert.name || !newExpert.title || !newExpert.organization) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setFormSubmitting(true);
    try {
      // If admin is adding an expert, they can mark it as verified
      const expertData = {
        ...newExpert,
        verified: isAdmin ? true : false,
        user_id: user?.id || null,
      };

      const { data, error } = await supabase
        .from('network_experts')
        .insert(expertData)
        .select();

      if (error) throw error;

      toast({
        title: "Expert Profile Added",
        description: "The expert profile has been added successfully.",
      });

      if (data) {
        setExperts([...experts, data[0] as Expert]);
      }

      setShowExpertForm(false);
      setNewExpert({
        name: "",
        title: "",
        organization: "",
        location: "",
        experience: "",
        expertise: [],
        verified: false,
        image_url: ""
      });
    } catch (error) {
      console.error("Error adding expert:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expert profile. Please try again.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAddDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.category || !newDiscussion.content) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setFormSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('network_discussions')
        .insert({
          ...newDiscussion,
          user_id: user?.id,
          is_pinned: isAdmin ? true : false, // Only admin can pin discussions by default
          likes_count: 0,
          replies_count: 0
        })
        .select();

      if (error) throw error;

      toast({
        title: "Discussion Added",
        description: "Your discussion has been posted successfully.",
      });

      if (data) {
        setDiscussions([data[0] as Discussion, ...discussions]);
      }

      setShowDiscussionForm(false);
      setNewDiscussion({
        title: "",
        category: "",
        content: ""
      });
    } catch (error) {
      console.error("Error adding discussion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post discussion. Please try again.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.type) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setFormSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('network_events')
        .insert({
          ...newEvent,
          updated_by: user?.id,
          attendees_count: 0
        })
        .select();

      if (error) throw error;

      toast({
        title: "Event Added",
        description: "The event has been added successfully.",
      });

      if (data) {
        setEvents([...events, data[0] as Event]);
      }

      setShowEventForm(false);
      setNewEvent({
        title: "",
        date: "",
        location: "",
        type: "",
        organizer: "",
        description: ""
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add event. Please try again.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredFarmers = farmers.filter(farmer => {
    const searchIn = (farmer.name + farmer.location + farmer.farm_type).toLowerCase();
    return searchIn.includes(searchQuery.toLowerCase());
  });

  const filteredExperts = experts.filter(expert => {
    const searchIn = (expert.name + expert.title + expert.organization).toLowerCase();
    return searchIn.includes(searchQuery.toLowerCase());
  });

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || discussion.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredEvents = events.filter(event => {
    const searchIn = (event.title + event.location + event.organizer).toLowerCase();
    return searchIn.includes(searchQuery.toLowerCase());
  });

  const discussionCategories = ["General", "Technical", "Market", "Health", "Equipment", "Feed", "Regulations"];
  const expertiseOptions = ["Poultry Health", "Feed Management", "Breeding", "Marketing", "Processing", "Farm Design"];
  const eventTypes = ["Workshop", "Conference", "Webinar", "Exhibition", "Networking"];
  const farmTypes = ["Layer", "Broiler", "Mixed", "Organic", "Free-range"];
  const farmSizes = ["Small (<500 birds)", "Medium (500-2000 birds)", "Large (2000-10000 birds)", "Enterprise (>10000 birds)"];
  const experienceLevels = ["Beginner (<2 years)", "Intermediate (2-5 years)", "Experienced (5-10 years)", "Expert (10+ years)"];

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Network</h1>
          <p className="text-gray-500 mt-1">Connect with farmers, experts, and industry professionals</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isAdmin && (
            <div className="flex gap-2">
              <Badge className="bg-[#ea384c]">Admin Mode</Badge>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="farmers" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="mt-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Poultry Farmers</h2>
              <Dialog open={showFarmerForm} onOpenChange={setShowFarmerForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add Farmer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Farmer Profile</DialogTitle>
                    <DialogDescription>
                      Add a new farmer to the network. {isAdmin && "As an admin, you can add farmers on behalf of users."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-name">Name</Label>
                      <Input 
                        id="farmer-name"
                        value={newFarmer.name}
                        onChange={(e) => setNewFarmer({...newFarmer, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-location">Location</Label>
                      <Input 
                        id="farmer-location"
                        value={newFarmer.location}
                        onChange={(e) => setNewFarmer({...newFarmer, location: e.target.value})}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-contact">Contact Number (Optional)</Label>
                      <Input 
                        id="farmer-contact"
                        value={newFarmer.contact_number || ''}
                        onChange={(e) => setNewFarmer({...newFarmer, contact_number: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-farm-type">Farm Type</Label>
                      <Select
                        value={newFarmer.farm_type}
                        onValueChange={(value) => setNewFarmer({...newFarmer, farm_type: value})}
                      >
                        <SelectTrigger id="farmer-farm-type">
                          <SelectValue placeholder="Select farm type" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-farm-size">Farm Size</Label>
                      <Select
                        value={newFarmer.farm_size}
                        onValueChange={(value) => setNewFarmer({...newFarmer, farm_size: value})}
                      >
                        <SelectTrigger id="farmer-farm-size">
                          <SelectValue placeholder="Select farm size" />
                        </SelectTrigger>
                        <SelectContent>
                          {farmSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="farmer-experience">Experience</Label>
                      <Select
                        value={newFarmer.experience}
                        onValueChange={(value) => setNewFarmer({...newFarmer, experience: value})}
                      >
                        <SelectTrigger id="farmer-experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map(exp => (
                            <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowFarmerForm(false)}>Cancel</Button>
                    <Button onClick={handleAddFarmer} disabled={formSubmitting}>
                      {formSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                      ) : (
                        <>Add Farmer</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFarmers.length > 0 ? (
                  filteredFarmers.map((farmer) => (
                    <Card key={farmer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {farmer.image_url ? (
                              <img src={farmer.image_url} alt={farmer.name} className="h-full w-full object-cover" />
                            ) : (
                              <Users className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{farmer.name}</CardTitle>
                            <p className="text-sm text-gray-500">{farmer.location}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Farm Type:</span>
                            <span className="text-sm">{farmer.farm_type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Farm Size:</span>
                            <span className="text-sm">{farmer.farm_size}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Experience:</span>
                            <span className="text-sm">{farmer.experience}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No farmers found. Try changing your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts" className="mt-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Industry Experts</h2>
              <Dialog open={showExpertForm} onOpenChange={setShowExpertForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add Expert
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Expert Profile</DialogTitle>
                    <DialogDescription>
                      Add a new expert to the network. {isAdmin && "As an admin, experts you add will be verified automatically."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expert-name">Name</Label>
                      <Input 
                        id="expert-name"
                        value={newExpert.name}
                        onChange={(e) => setNewExpert({...newExpert, name: e.target.value})}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expert-title">Title/Designation</Label>
                      <Input 
                        id="expert-title"
                        value={newExpert.title}
                        onChange={(e) => setNewExpert({...newExpert, title: e.target.value})}
                        placeholder="e.g. Poultry Consultant, Veterinarian"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expert-org">Organization</Label>
                      <Input 
                        id="expert-org"
                        value={newExpert.organization}
                        onChange={(e) => setNewExpert({...newExpert, organization: e.target.value})}
                        placeholder="Company or organization name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expert-location">Location</Label>
                      <Input 
                        id="expert-location"
                        value={newExpert.location || ''}
                        onChange={(e) => setNewExpert({...newExpert, location: e.target.value})}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="expert-experience">Experience</Label>
                      <Select
                        value={newExpert.experience}
                        onValueChange={(value) => setNewExpert({...newExpert, experience: value})}
                      >
                        <SelectTrigger id="expert-experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map(exp => (
                            <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowExpertForm(false)}>Cancel</Button>
                    <Button onClick={handleAddExpert} disabled={formSubmitting}>
                      {formSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                      ) : (
                        <>Add Expert</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.length > 0 ? (
                  filteredExperts.map((expert) => (
                    <Card key={expert.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {expert.image_url ? (
                              <img src={expert.image_url} alt={expert.name} className="h-full w-full object-cover" />
                            ) : (
                              <Award className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <CardTitle className="text-lg">{expert.name}</CardTitle>
                              {expert.verified && (
                                <span className="ml-2" title="Verified Expert">
                                  <UserCheck className="h-4 w-4 text-green-500" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{expert.title}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Organization:</span>
                            <span className="text-sm">{expert.organization}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Location:</span>
                            <span className="text-sm">{expert.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">Experience:</span>
                            <span className="text-sm">{expert.experience}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Profile</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No experts found. Try changing your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Community Discussions</h2>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="pl-10 w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {discussionCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Dialog open={showDiscussionForm} onOpenChange={setShowDiscussionForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={16} className="mr-2" />
                      New Discussion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Start a New Discussion</DialogTitle>
                      <DialogDescription>
                        Share your question or topic with the community
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="discussion-title">Title</Label>
                        <Input 
                          id="discussion-title"
                          value={newDiscussion.title}
                          onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                          placeholder="Discussion title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="discussion-category">Category</Label>
                        <Select
                          value={newDiscussion.category}
                          onValueChange={(value) => setNewDiscussion({...newDiscussion, category: value})}
                        >
                          <SelectTrigger id="discussion-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {discussionCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="discussion-content">Content</Label>
                        <Textarea 
                          id="discussion-content"
                          value={newDiscussion.content}
                          onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
                          placeholder="Write your discussion here..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDiscussionForm(false)}>Cancel</Button>
                      <Button onClick={handleAddDiscussion} disabled={formSubmitting}>
                        {formSubmitting ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</>
                        ) : (
                          <>Post Discussion</>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map((discussion) => (
                    <Card key={discussion.id} className={`overflow-hidden hover:shadow-md transition-shadow ${discussion.is_pinned ? 'border-[#ea384c] bg-red-50' : ''}`}>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              {discussion.is_pinned && (
                                <span className="mr-2 text-[#ea384c]" title="Pinned by administrator">
                                  📌
                                </span>
                              )}
                              <CardTitle className="text-lg">{discussion.title}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Badge variant="outline">{discussion.category}</Badge>
                              <span>• {new Date(discussion.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center text-sm text-gray-500">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {discussion.replies_count}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-gray-700 line-clamp-3">{discussion.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          View Replies ({discussion.replies_count})
                        </Button>
                        <Button variant="outline" size="sm">
                          Reply
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No discussions found. Start a new discussion!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-4">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold">Industry Events</h2>
              
              <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>
                      Share an upcoming industry event with the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="event-title">Event Title</Label>
                      <Input 
                        id="event-title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Event title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-date">Date</Label>
                      <Input 
                        id="event-date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-location">Location</Label>
                      <Input 
                        id="event-location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        placeholder="Event location"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-type">Event Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                      >
                        <SelectTrigger id="event-type">
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-organizer">Organizer</Label>
                      <Input 
                        id="event-organizer"
                        value={newEvent.organizer}
                        onChange={(e) => setNewEvent({...newEvent, organizer: e.target.value})}
                        placeholder="Event organizer"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="event-description">Description</Label>
                      <Textarea 
                        id="event-description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Event description (optional)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowEventForm(false)}>Cancel</Button>
                    <Button onClick={handleAddEvent} disabled={formSubmitting}>
                      {formSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                      ) : (
                        <>Add Event</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Badge>{event.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Date</p>
                              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-gray-500">{event.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <Users className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Organizer</p>
                              <p className="text-sm text-gray-500">{event.organizer}</p>
                            </div>
                          </div>
                        </div>
                        
                        {event.description && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Register Interest</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No events found. Add a new event to get started!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NetworkPage;

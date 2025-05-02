
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search, Filter, Plus, BookOpen, Video, FileText, Download, Calendar, Clock, User, Trash2, Edit, Eye } from 'lucide-react';

interface TrainingResource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  url: string;
  created_at: string;
  author_id: string;
  author_name: string;
  likes_count: number;
  downloads_count: number;
  file_size?: string;
  duration?: string;
  featured?: boolean;
}

const TrainingPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showAddResourceForm, setShowAddResourceForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // New resource form state
  const [newResource, setNewResource] = useState<Partial<TrainingResource>>({
    title: "",
    description: "",
    type: "",
    category: "",
    url: "",
    file_size: "",
    duration: "",
  });
  
  const resourceTypes = ["Article", "Video", "PDF", "Presentation", "Webinar Recording"];
  const resourceCategories = ["Poultry Health", "Feed Management", "Housing", "Breeding", "Processing", "Marketing", "Regulations", "Best Practices"];

  useEffect(() => {
    fetchTrainingResources();
  }, []);

  const fetchTrainingResources = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from a 'training_resources' table
      // For now, we'll simulate data for demonstration
      const mockResources: TrainingResource[] = [
        {
          id: "1",
          title: "Introduction to Poultry Health Management",
          description: "Learn the basics of poultry health management including disease prevention and treatment strategies.",
          type: "Article",
          category: "Poultry Health",
          url: "#",
          created_at: "2025-04-15T10:30:00Z",
          author_id: "admin",
          author_name: "22POULTRY Team",
          likes_count: 24,
          downloads_count: 186,
          featured: true
        },
        {
          id: "2",
          title: "Modern Poultry Housing Systems",
          description: "Explore different housing systems for poultry farms and learn about their pros and cons.",
          type: "PDF",
          category: "Housing",
          url: "#",
          created_at: "2025-04-10T14:20:00Z",
          author_id: "admin",
          author_name: "22POULTRY Team",
          likes_count: 18,
          downloads_count: 145,
          file_size: "2.4 MB",
          featured: true
        },
        {
          id: "3",
          title: "Feed Formulation Techniques",
          description: "Learn how to formulate balanced feeds for different types of poultry at various growth stages.",
          type: "Video",
          category: "Feed Management",
          url: "#",
          created_at: "2025-04-05T09:15:00Z",
          author_id: "expert1",
          author_name: "Dr. Rajesh Kumar",
          likes_count: 32,
          downloads_count: 210,
          duration: "45 minutes"
        },
        {
          id: "4",
          title: "Biosecurity Measures for Poultry Farms",
          description: "Essential biosecurity measures that every poultry farmer should implement to prevent disease outbreaks.",
          type: "Presentation",
          category: "Poultry Health",
          url: "#",
          created_at: "2025-03-28T11:45:00Z",
          author_id: "admin",
          author_name: "22POULTRY Team",
          likes_count: 29,
          downloads_count: 178,
          file_size: "5.7 MB"
        },
        {
          id: "5",
          title: "Marketing Strategies for Poultry Products",
          description: "Effective strategies to market your poultry products and reach a wider customer base.",
          type: "Webinar Recording",
          category: "Marketing",
          url: "#",
          created_at: "2025-03-20T15:30:00Z",
          author_id: "expert2",
          author_name: "Priya Sharma",
          likes_count: 15,
          downloads_count: 89,
          duration: "60 minutes"
        }
      ];
      
      setResources(mockResources);
      
      // In a real implementation, we would fetch from Supabase like this:
      /*
      const { data, error } = await supabase
        .from('training_resources')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setResources(data || []);
      */
    } catch (error) {
      console.error("Error fetching training resources:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load training resources. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.type || !newResource.category || !newResource.url) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setFormSubmitting(true);
    try {
      // In a real implementation, we would save to Supabase
      const mockResource: TrainingResource = {
        id: `new-${Date.now()}`,
        title: newResource.title,
        description: newResource.description || "",
        type: newResource.type,
        category: newResource.category,
        url: newResource.url,
        created_at: new Date().toISOString(),
        author_id: user?.id || "anonymous",
        author_name: user?.user_metadata?.full_name || "Anonymous User",
        likes_count: 0,
        downloads_count: 0,
        file_size: newResource.file_size,
        duration: newResource.duration,
        featured: isAdmin ? newResource.featured : false
      };

      // Add to local state for demo
      setResources([mockResource, ...resources]);

      toast({
        title: "Resource Added",
        description: "Your training resource has been added successfully.",
      });

      setShowAddResourceForm(false);
      setNewResource({
        title: "",
        description: "",
        type: "",
        category: "",
        url: "",
        file_size: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error adding resource:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add resource. Please try again.",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      // In a real implementation, we would delete from Supabase
      setResources(resources.filter(resource => resource.id !== id));
      
      toast({
        title: "Resource Deleted",
        description: "The training resource has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resource. Please try again.",
      });
    }
  };

  const handleResourceAction = (id: string, action: 'view' | 'download' | 'like') => {
    const updatedResources = resources.map(resource => {
      if (resource.id === id) {
        if (action === 'download') {
          return { ...resource, downloads_count: resource.downloads_count + 1 };
        } else if (action === 'like') {
          return { ...resource, likes_count: resource.likes_count + 1 };
        }
      }
      return resource;
    });
    
    setResources(updatedResources);
    
    if (action === 'view') {
      toast({
        title: "Opening Resource",
        description: "The resource will open in a new tab.",
      });
    } else if (action === 'download') {
      toast({
        title: "Downloading",
        description: "Your download has started.",
      });
    } else if (action === 'like') {
      toast({
        title: "Resource Liked",
        description: "You've liked this resource.",
      });
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || resource.category === filterCategory;
    const matchesType = !filterType || resource.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "Article":
        return <BookOpen className="h-5 w-5" />;
      case "Video":
        return <Video className="h-5 w-5" />;
      case "PDF":
        return <FileText className="h-5 w-5" />;
      case "Presentation":
        return <FileText className="h-5 w-5" />;
      case "Webinar Recording":
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Training & Education</h1>
          <p className="text-gray-500 mt-1">Access educational resources and training materials</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search resources..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {isAdmin && (
              <Badge className="bg-[#ea384c]">Admin Mode</Badge>
            )}
            
            <Dialog open={showAddResourceForm} onOpenChange={setShowAddResourceForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Training Resource</DialogTitle>
                  <DialogDescription>
                    Add a new training resource to share with the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="resource-title">Title</Label>
                      <Input 
                        id="resource-title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        placeholder="Resource title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resource-url">URL / Link</Label>
                      <Input 
                        id="resource-url"
                        value={newResource.url}
                        onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                        placeholder="https://example.com/resource"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="resource-type">Type</Label>
                      <Select
                        value={newResource.type}
                        onValueChange={(value) => setNewResource({...newResource, type: value})}
                      >
                        <SelectTrigger id="resource-type">
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resource-category">Category</Label>
                      <Select
                        value={newResource.category}
                        onValueChange={(value) => setNewResource({...newResource, category: value})}
                      >
                        <SelectTrigger id="resource-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(newResource.type === 'PDF' || newResource.type === 'Presentation') && (
                      <div className="grid gap-2">
                        <Label htmlFor="resource-filesize">File Size</Label>
                        <Input 
                          id="resource-filesize"
                          value={newResource.file_size}
                          onChange={(e) => setNewResource({...newResource, file_size: e.target.value})}
                          placeholder="e.g. 2.5 MB"
                        />
                      </div>
                    )}
                    {(newResource.type === 'Video' || newResource.type === 'Webinar Recording') && (
                      <div className="grid gap-2">
                        <Label htmlFor="resource-duration">Duration</Label>
                        <Input 
                          id="resource-duration"
                          value={newResource.duration}
                          onChange={(e) => setNewResource({...newResource, duration: e.target.value})}
                          placeholder="e.g. 45 minutes"
                        />
                      </div>
                    )}
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="resource-featured"
                          checked={!!newResource.featured}
                          onChange={(e) => setNewResource({...newResource, featured: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="resource-featured">Feature this resource</Label>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="resource-description">Description</Label>
                    <Textarea 
                      id="resource-description"
                      value={newResource.description}
                      onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                      placeholder="Describe this resource..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddResourceForm(false)}>Cancel</Button>
                  <Button onClick={handleAddResource} disabled={formSubmitting}>
                    {formSubmitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                    ) : (
                      <>Add Resource</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* All Resources Tab */}
          <TabsContent value="all" className="mt-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {resourceTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full md:w-1/3">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {resourceCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <Card key={resource.id} className={`overflow-hidden hover:shadow-md transition-shadow ${resource.featured ? 'border-[#ea384c]' : ''}`}>
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="p-2 rounded-full bg-gray-100">
                                {getResourceTypeIcon(resource.type)}
                              </span>
                              <Badge>{resource.type}</Badge>
                              {resource.featured && (
                                <Badge variant="outline" className="border-[#ea384c] text-[#ea384c]">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <Badge variant="outline" className="mb-2">{resource.category}</Badge>
                        <p className="text-gray-700 line-clamp-2 mb-4">{resource.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          {resource.file_size && (
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              {resource.file_size}
                            </div>
                          )}
                          {resource.duration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {resource.duration}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(resource.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {resource.author_name}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500"
                            onClick={() => handleResourceAction(resource.id, 'view')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-gray-500"
                            onClick={() => handleResourceAction(resource.id, 'download')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {resource.downloads_count}
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteResource(resource.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-500"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No resources found. Try changing your search criteria or add a new resource.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Featured Tab */}
          <TabsContent value="featured" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <>
                {featuredResources.length > 0 ? (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Featured Resources</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredResources.map((resource) => (
                        <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow border-[#ea384c]">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="p-2 rounded-full bg-gray-100">
                                    {getResourceTypeIcon(resource.type)}
                                  </span>
                                  <Badge>{resource.type}</Badge>
                                  <Badge variant="outline" className="border-[#ea384c] text-[#ea384c]">
                                    Featured
                                  </Badge>
                                </div>
                                <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <Badge variant="outline" className="mb-2">{resource.category}</Badge>
                            <p className="text-gray-700 line-clamp-2 mb-4">{resource.description}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between border-t pt-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500"
                              onClick={() => handleResourceAction(resource.id, 'view')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-gray-500"
                              onClick={() => handleResourceAction(resource.id, 'download')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {resource.downloads_count}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No featured resources available.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-[#ea384c]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourceCategories.map((category) => {
                  const categoryResources = resources.filter(r => r.category === category);
                  return (
                    <Card key={category} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{category}</CardTitle>
                        <CardDescription>{categoryResources.length} resources available</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoryResources.slice(0, 3).map((resource) => (
                            <div key={resource.id} className="flex items-center gap-2">
                              <span className="p-1 rounded-full bg-gray-100">
                                {getResourceTypeIcon(resource.type)}
                              </span>
                              <span className="text-sm truncate">{resource.title}</span>
                            </div>
                          ))}
                          {categoryResources.length > 3 && (
                            <p className="text-sm text-gray-500">+ {categoryResources.length - 3} more resources</p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setFilterCategory(category);
                            setFilterType("");
                            document.querySelector('[value="all"]')?.dispatchEvent(new Event('click', { bubbles: true }));
                          }}
                        >
                          Browse Category
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TrainingPage;

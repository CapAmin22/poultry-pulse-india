
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Briefcase, Search, Filter, MapPin, Building, Clock, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { JobListing } from '@/types/network';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

const JobBoard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [industry, setIndustry] = useState<string>('all');
  const [location, setLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    jobType: 'Full-time',
    salaryRange: '',
    contactEmail: user?.email || '',
  });

  React.useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobListings(data || []);
    } catch (error) {
      console.error('Error fetching job listings:', error);
      toast({
        title: "Failed to load job listings",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post a job",
        variant: "destructive"
      });
      return;
    }

    try {
      const requirementsArray = newJob.requirements
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const { data, error } = await supabase
        .from('job_listings')
        .insert({
          title: newJob.title,
          company: newJob.company,
          location: newJob.location,
          description: newJob.description,
          requirements: requirementsArray,
          job_type: newJob.jobType,
          salary_range: newJob.salaryRange,
          contact_email: newJob.contactEmail,
          user_id: user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Job posted successfully",
        description: "Your job listing has been published",
      });

      // Reset form and refresh listings
      setNewJob({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        jobType: 'Full-time',
        salaryRange: '',
        contactEmail: user.email || '',
      });
      
      fetchJobListings();
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Failed to post job",
        description: "Please check your input and try again",
        variant: "destructive"
      });
    }
  };

  const filterJobs = (job: JobListing) => {
    // Filter by industry if selected
    if (industry !== 'all' && job.industry !== industry) {
      return false;
    }
    
    // Filter by location if provided
    if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  };

  const filteredJobs = jobListings.filter(filterJobs);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Job Board</h2>
          <p className="text-gray-600">Find opportunities across the poultry industry</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#f5565c]">
              <Briefcase className="h-4 w-4 mr-2" />
              Post a Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Post a New Job</DialogTitle>
              <DialogDescription>
                Create a new job listing for the poultry industry
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleJobSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Poultry Farm Manager"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., ABC Poultry Farms"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Delhi NCR"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select 
                    value={newJob.jobType} 
                    onValueChange={(value) => setNewJob({...newJob, jobType: value})}
                  >
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Temporary">Temporary</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities and requirements"
                  className="min-h-[100px]"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements (one per line) *</Label>
                <Textarea
                  id="requirements"
                  placeholder="e.g.,
2+ years in poultry management
Bachelor's degree in agriculture
Knowledge of feed optimization"
                  className="min-h-[100px]"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Salary Range</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g., ₹30,000 - ₹50,000 per month"
                    value={newJob.salaryRange}
                    onChange={(e) => setNewJob({...newJob, salaryRange: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="e.g., hiring@company.com"
                    value={newJob.contactEmail}
                    onChange={(e) => setNewJob({...newJob, contactEmail: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" className="bg-[#f5565c]">Post Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search jobs..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Distribution">Distribution</SelectItem>
              <SelectItem value="Feed">Feed</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Management">Management</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </Button>
        </div>
      </div>
      
      {/* Job Listings */}
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden hover:border-[#f5565c] transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{job.job_type}</span>
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-1" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.industry && <Badge variant="outline">{job.industry}</Badge>}
                      {job.requirements?.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                      {job.requirements?.length > 3 && (
                        <Badge variant="secondary">+{job.requirements.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 shrink-0">
                    <Button className="bg-[#f5565c]">Apply Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          <Button className="mt-6" onClick={() => {
            setIndustry('all');
            setLocation('');
            setSearchQuery('');
          }}>Clear filters</Button>
        </div>
      )}
    </div>
  );
};

export default JobBoard;

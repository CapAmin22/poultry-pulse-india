
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Briefcase, Search, Filter, MapPin, Building, Clock, PlusCircle, Calendar, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface JobPostingFormData {
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  contact_email: string;
  industry?: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  contact_email: string;
  industry?: string;
  created_at: string;
  user_id: string;
}

const initialJobForm: JobPostingFormData = {
  title: '',
  company: '',
  location: '',
  job_type: 'Full-time',
  description: '',
  requirements: [''],
  salary_range: '',
  contact_email: '',
  industry: ''
};

interface JobBoardProps {
  userRole?: string;
}

const JobBoard: React.FC<JobBoardProps> = ({ userRole }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<JobPostingFormData>(initialJobForm);
  const [myPostings, setMyPostings] = useState<JobPosting[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyPostings();
    }
  }, [user]);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, filterType, jobPostings]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setJobPostings(data);
        setFilteredJobs(data);
      }
    } catch (error) {
      console.error('Error fetching job listings:', error);
      toast({
        variant: "destructive",
        title: "Failed to load job listings",
        description: "Please try again later",
      });
      
      // Fallback to mock data
      setJobPostings([
        {
          id: '1',
          title: 'Poultry Farm Manager',
          company: 'Green Valley Farms',
          location: 'Punjab',
          job_type: 'Full-time',
          description: 'Seeking an experienced farm manager to oversee operations at our layer farm.',
          requirements: ['Minimum 3 years experience in poultry management', 'Knowledge of biosecurity protocols', 'Excellent team leadership skills'],
          salary_range: '₹30,000 - ₹45,000 per month',
          contact_email: 'careers@greenvalleyfarms.com',
          user_id: '1',
          created_at: '2023-05-01T10:00:00Z',
        },
        {
          id: '2',
          title: 'Poultry Nutrition Specialist',
          company: 'Sunrise Feeds',
          location: 'Hyderabad',
          job_type: 'Full-time',
          description: 'Looking for a nutrition specialist to formulate feed recipes and monitor flock health.',
          requirements: ['Degree in Animal Nutrition or related field', 'Experience with feed formulation software', 'Knowledge of poultry nutritional requirements'],
          salary_range: '₹40,000 - ₹60,000 per month',
          contact_email: 'hr@sunrisefeeds.com',
          user_id: '2',
          created_at: '2023-04-28T09:30:00Z',
        },
      ]);
      setFilteredJobs([
        {
          id: '1',
          title: 'Poultry Farm Manager',
          company: 'Green Valley Farms',
          location: 'Punjab',
          job_type: 'Full-time',
          description: 'Seeking an experienced farm manager to oversee operations at our layer farm.',
          requirements: ['Minimum 3 years experience in poultry management', 'Knowledge of biosecurity protocols', 'Excellent team leadership skills'],
          salary_range: '₹30,000 - ₹45,000 per month',
          contact_email: 'careers@greenvalleyfarms.com',
          user_id: '1',
          created_at: '2023-05-01T10:00:00Z',
        },
        {
          id: '2',
          title: 'Poultry Nutrition Specialist',
          company: 'Sunrise Feeds',
          location: 'Hyderabad',
          job_type: 'Full-time',
          description: 'Looking for a nutrition specialist to formulate feed recipes and monitor flock health.',
          requirements: ['Degree in Animal Nutrition or related field', 'Experience with feed formulation software', 'Knowledge of poultry nutritional requirements'],
          salary_range: '₹40,000 - ₹60,000 per month',
          contact_email: 'hr@sunrisefeeds.com',
          user_id: '2',
          created_at: '2023-04-28T09:30:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPostings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setMyPostings(data);
      }
    } catch (error) {
      console.error('Error fetching my job postings:', error);
    }
  };

  const filterJobs = () => {
    let filtered = jobPostings;
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply job type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.job_type === filterType);
    }
    
    setFilteredJobs(filtered);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: updatedRequirements }));
  };

  const addRequirementField = () => {
    setFormData(prev => ({ 
      ...prev, 
      requirements: [...prev.requirements, ''] 
    }));
  };

  const removeRequirementField = (index: number) => {
    if (formData.requirements.length > 1) {
      const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requirements: updatedRequirements }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be signed in to post a job",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Clean up empty requirements
      const cleanedRequirements = formData.requirements.filter(req => req.trim() !== '');
      
      if (cleanedRequirements.length === 0) {
        toast({
          variant: "destructive",
          title: "Missing requirements",
          description: "Please add at least one job requirement",
        });
        return;
      }
      
      const newJob = {
        ...formData,
        requirements: cleanedRequirements,
        user_id: user.id,
      };
      
      const { data, error } = await supabase
        .from('job_listings')
        .insert([newJob])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setJobPostings(prev => [data[0], ...prev]);
        setFormData(initialJobForm);
        fetchMyPostings(); // Refresh my postings
        
        toast({
          title: "Job posted successfully",
          description: "Your job posting is now live",
        });
        
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        variant: "destructive",
        title: "Failed to post job",
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('job_listings')
        .delete()
        .eq('id', jobId);
      
      if (error) throw error;
      
      // Remove from local state
      setJobPostings(prev => prev.filter(job => job.id !== jobId));
      setMyPostings(prev => prev.filter(job => job.id !== jobId));
      
      toast({
        title: "Job deleted",
        description: "Your job posting has been removed",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        variant: "destructive",
        title: "Failed to delete job",
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Job Openings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search jobs..." 
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
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Job Posting Button */}
          {user && (
            <div className="mb-6 flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#f5565c]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Post a Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name
                        </label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                          Industry
                        </label>
                        <Input
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          placeholder="e.g., Poultry Farming, Feed Manufacturing"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
                          Job Type
                        </label>
                        <select
                          id="job_type"
                          name="job_type"
                          value={formData.job_type}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-gray-300 p-2"
                          required
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range (optional)
                      </label>
                      <Input
                        id="salary_range"
                        name="salary_range"
                        value={formData.salary_range}
                        onChange={handleInputChange}
                        placeholder="e.g., ₹30,000 - ₹45,000 per month"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 p-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Requirements
                        </label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={addRequirementField}
                        >
                          Add Requirement
                        </Button>
                      </div>
                      
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={req}
                            onChange={(e) => handleRequirementChange(index, e.target.value)}
                            placeholder={`Requirement ${index + 1}`}
                            className="flex-grow"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => removeRequirementField(index)}
                            disabled={formData.requirements.length <= 1}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#f5565c]" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Job'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* My Job Postings (if available) */}
          {user && userRole !== 'farmer' && myPostings.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">My Posted Jobs</h3>
              <div className="space-y-4">
                {myPostings.map(job => (
                  <div key={job.id} className="border rounded-lg p-4 bg-blue-50/40">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center text-gray-600 text-sm">
                            <Building className="h-4 w-4 mr-1" />
                            {job.company}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-gray-600 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.job_type}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          Posted on {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-200 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-b my-6"></div>
            </div>
          )}
          
          {/* All Job Listings */}
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.job_type}
                        </div>
                      </div>
                      
                      {job.salary_range && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Salary:</span> {job.salary_range}
                        </p>
                      )}
                      
                      <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                        {job.description}
                      </p>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {job.requirements?.slice(0, 2).map((req, i) => (
                            <li key={i} className="line-clamp-1">{req}</li>
                          ))}
                          {job.requirements?.length > 2 && (
                            <li>+{job.requirements.length - 2} more requirements</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-xs mt-3">
                        <Calendar className="h-3 w-3 mr-1" />
                        Posted on {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex md:flex-col md:items-end gap-2">
                      {job.industry && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {job.industry}
                        </span>
                      )}
                      <Button className="bg-[#0FA0CE] whitespace-nowrap">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobBoard;

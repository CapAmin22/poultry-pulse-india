
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MyJobListings: React.FC<{ userId: string }> = ({ userId }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching job listings:', error);
        toast({
          title: "Failed to load your job listings",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Job Listings</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/network')}>
            <Briefcase className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Company: {job.company}</p>
                  <p className="text-sm text-gray-600">Location: {job.location}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No job listings found</h3>
            <p className="mt-1 text-gray-500">You haven't posted any job listings yet.</p>
            <Button className="mt-4" onClick={() => navigate('/network')}>
              Post Your First Job
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyJobListings;

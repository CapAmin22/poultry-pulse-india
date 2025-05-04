
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MyListings: React.FC<{ userId: string }> = ({ userId }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Failed to load your listings",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
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
          <CardTitle>My Marketplace Listings</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/marketplace')}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Post New Listing
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Category: {listing.category}</p>
                  <p className="text-sm text-gray-600">Price: {listing.price}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(listing.created_at).toLocaleDateString()}</p>
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
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-1 text-gray-500">You haven't posted any marketplace listings yet.</p>
            <Button className="mt-4" onClick={() => navigate('/marketplace')}>
              Create Your First Listing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyListings;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MyFinancialServices: React.FC<{ userId: string }> = ({ userId }) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('financial_services')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }) as { data: any[] | null, error: any };
        
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching financial services:', error);
        toast({
          title: "Failed to load your financial services",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
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
          <CardTitle>My Financial Services</CardTitle>
          <Button className="bg-[#f5565c]" onClick={() => navigate('/financial')}>
            <CreditCard className="h-4 w-4 mr-2" />
            Offer New Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Provider: {service.provider_name}</p>
                  <p className="text-sm text-gray-600">Category: {service.category}</p>
                  <p className="text-sm text-gray-600">Posted: {new Date(service.created_at).toLocaleDateString()}</p>
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
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No financial services found</h3>
            <p className="mt-1 text-gray-500">You haven't offered any financial services yet.</p>
            <Button className="mt-4" onClick={() => navigate('/financial')}>
              Offer Your First Service
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyFinancialServices;

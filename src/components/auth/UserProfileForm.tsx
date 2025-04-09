
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';

// Define proper types for our profile data
interface ProfileData {
  full_name: string;
  organization: string;
  location: string;
  avatar_url: string | null;
}

const UserProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    organization: '',
    location: '',
    avatar_url: null,
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!user) return;

      // Use type assertion to specify we're working with the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          organization: data.organization || '',
          location: data.location || '',
          avatar_url: data.avatar_url || null,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) return;

      // Use type assertion for the update operation
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          organization: profileData.organization,
          location: profileData.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: error.message,
        });
        return;
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              {profileData.avatar_url ? (
                <AvatarImage src={profileData.avatar_url} alt={profileData.full_name} />
              ) : (
                <AvatarFallback className="text-lg bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white">
                  {profileData.full_name ? getInitials(profileData.full_name) : <User className="h-10 w-10" />}
                </AvatarFallback>
              )}
            </Avatar>
            <Button variant="outline" size="sm" className="mt-2" disabled={uploadingAvatar}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          
          <div className="flex-1">
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={profileData.organization}
                  onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                  placeholder="Your Farm or Organization"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;

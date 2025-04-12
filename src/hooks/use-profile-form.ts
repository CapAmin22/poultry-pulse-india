
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Define proper types for our profile data that match the database schema
export interface ProfileData {
  username: string;
  bio: string | null;
  // Additional fields we'll store in the user metadata instead
  full_name: string;
  organization: string;
  location: string;
  avatar_url: string | null; // This will be stored in user metadata since it's not in the profiles table
}

export const useProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    bio: null,
    full_name: '',
    organization: '',
    location: '',
    avatar_url: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      if (!user) return;

      console.log('Fetching profile for user:', user.id);

      // Get profile data from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist yet, create one
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating a new one');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { user_id: user.id, username: '', bio: null }
            ]);
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        } else {
          throw error;
        }
      }

      // Get user metadata for additional fields
      const { data: { user: userData } } = await supabase.auth.getUser();
      const metadata = userData?.user_metadata || {};

      console.log('Fetched user metadata:', metadata);

      setProfileData({
        username: data?.username || '',
        bio: data?.bio || null,
        // Get avatar_url and additional fields from user metadata
        avatar_url: metadata.avatar_url || null,
        full_name: metadata.full_name || '',
        organization: metadata.organization || '',
        location: metadata.location || '',
      });

      setInitialLoadComplete(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: "There was a problem loading your profile data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) return;

      console.log('Updating profile for user:', user.id);
      console.log('Profile data to update:', profileData);

      // Update profile fields in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: profileData.username,
          bio: profileData.bio,
        }, { onConflict: 'user_id' });

      if (profileError) {
        console.error('Profile update failed:', profileError);
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: profileError.message,
        });
        return;
      }

      // Update additional fields in user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          organization: profileData.organization,
          location: profileData.location,
          avatar_url: profileData.avatar_url,
        }
      });

      if (metadataError) {
        console.error('Profile metadata update failed:', metadataError);
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: metadataError.message,
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

  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateAvatarUrl = (url: string) => {
    setProfileData(prev => ({ ...prev, avatar_url: url }));
  };

  return {
    profileData,
    loading,
    initialLoadComplete,
    updateProfile,
    handleFieldChange,
    updateAvatarUrl,
    user
  };
};

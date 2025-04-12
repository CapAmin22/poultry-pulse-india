
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileAvatar from './ProfileAvatar';
import ProfileFormField from './ProfileFormField';
import { useProfileForm } from '@/hooks/use-profile-form';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserProfileForm: React.FC = () => {
  const { 
    profileData, 
    loading, 
    initialLoadComplete,
    updateProfile, 
    handleFieldChange, 
    updateAvatarUrl, 
    user 
  } = useProfileForm();
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLoadComplete) {
      setHasChanges(false);
    }
  }, [initialLoadComplete, profileData]);

  // Check connection to Supabase on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
          console.error('Supabase connection issue:', error);
          setServerError('Unable to connect to the server. Some features may not work correctly.');
        } else {
          setServerError(null);
        }
      } catch (err) {
        console.error('Connection check error:', err);
        setServerError('Server connection error. Please try again later.');
      }
    };
    
    checkConnection();
  }, []);

  const handleChange = (field: string, value: string) => {
    handleFieldChange(field as any, value);
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setServerError(null);
    
    try {
      await updateProfile(e);
      setHasChanges(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      setServerError('Failed to update profile. Please try again.');
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An error occurred while updating your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !initialLoadComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 flex justify-center">
          <div className="flex flex-col items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#ea384c]" />
            <p className="mt-2 text-sm text-gray-500">Loading profile information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-800">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{serverError}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <ProfileAvatar 
            avatarUrl={profileData.avatar_url} 
            fullName={profileData.full_name}
            onAvatarUpdate={updateAvatarUrl}
          />

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <ProfileFormField
                id="email"
                label="Email"
                value={user?.email || ''}
                onChange={() => {}}
                disabled={true}
                description="Email cannot be changed"
              />

              <ProfileFormField
                id="fullName"
                label="Full Name"
                value={profileData.full_name}
                onChange={(value) => handleChange('full_name', value)}
                required={true}
              />

              <ProfileFormField
                id="username"
                label="Username"
                value={profileData.username}
                onChange={(value) => handleChange('username', value)}
                placeholder="Your username"
              />

              <ProfileFormField
                id="organization"
                label="Organization"
                value={profileData.organization}
                onChange={(value) => handleChange('organization', value)}
                placeholder="Your Farm or Organization"
              />

              <ProfileFormField
                id="location"
                label="Location"
                value={profileData.location}
                onChange={(value) => handleChange('location', value)}
                placeholder="City, State"
              />

              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white"
                disabled={isSaving || !hasChanges}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;

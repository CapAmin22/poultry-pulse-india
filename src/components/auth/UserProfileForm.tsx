
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileAvatar from './ProfileAvatar';
import ProfileFormField from './ProfileFormField';
import { useProfileForm } from '@/hooks/use-profile-form';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const UserProfileForm: React.FC = () => {
  const { profileData, loading, updateProfile, handleFieldChange, updateAvatarUrl, user } = useProfileForm();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(false);
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    handleFieldChange(field as any, value);
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile(e);
      setHasChanges(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "An error occurred while updating your profile.",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
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

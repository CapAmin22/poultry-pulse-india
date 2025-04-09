
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileAvatar from './ProfileAvatar';
import ProfileFormField from './ProfileFormField';
import { useProfileForm } from '@/hooks/use-profile-form';

const ProfileForm: React.FC = () => {
  const { profileData, loading, updateProfile, handleFieldChange, user } = useProfileForm();

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
          />
          
          <div className="flex-1">
            <form onSubmit={updateProfile} className="space-y-4">
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
                onChange={(value) => handleFieldChange('full_name', value)}
                required={true}
              />
              
              <ProfileFormField
                id="username"
                label="Username"
                value={profileData.username}
                onChange={(value) => handleFieldChange('username', value)}
                placeholder="Your username"
              />
              
              <ProfileFormField
                id="organization"
                label="Organization"
                value={profileData.organization}
                onChange={(value) => handleFieldChange('organization', value)}
                placeholder="Your Farm or Organization"
              />
              
              <ProfileFormField
                id="location"
                label="Location"
                value={profileData.location}
                onChange={(value) => handleFieldChange('location', value)}
                placeholder="City, State"
              />
              
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

export default ProfileForm;

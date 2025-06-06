
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import UserProfileForm from '@/components/auth/UserProfileForm';
import UserSettings from '@/components/auth/UserSettings';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCircle, Settings, FileText, Briefcase, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import MyListings from '@/components/profile/MyListings';
import MyFinancialServices from '@/components/profile/MyFinancialServices';
import MyJobListings from '@/components/profile/MyJobListings';
import ActivitySection from '@/components/profile/ActivitySection';
import AccountHeader from '@/components/profile/AccountHeader';
import RoleSpecificProfile from '@/components/profile/RoleSpecificProfile';
import ProfileMetrics from '@/components/profile/ProfileMetrics';

const Profile: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userRole, setUserRole] = useState<string>('');
  const [profileData, setProfileData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get user metadata
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        
        // Set role from metadata
        const role = userMetadata.role || '';
        setUserRole(role);
        setProfileData(userMetadata);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of 22POULTRY.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to access your profile.</p>
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <AccountHeader onSignOut={handleSignOut} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="profile" className="flex items-center">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Financial Services
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              Job Posts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfileForm />
            {userRole && !loading && (
              <>
                <RoleSpecificProfile role={userRole} profileData={profileData} />
                <ProfileMetrics role={userRole} userId={user.id} />
              </>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivitySection role={userRole} userId={user.id} />
          </TabsContent>
          
          <TabsContent value="listings">
            <MyListings userId={user.id} />
          </TabsContent>
          
          <TabsContent value="services">
            <MyFinancialServices userId={user.id} />
          </TabsContent>
          
          <TabsContent value="jobs">
            <MyJobListings userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;

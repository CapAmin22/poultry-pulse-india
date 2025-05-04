
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import UserProfileForm from '@/components/auth/UserProfileForm';
import UserSettings from '@/components/auth/UserSettings';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, UserCircle, Settings, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-gray-500">Manage your profile and account settings</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-6">
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
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfileForm />
          </TabsContent>
          
          <TabsContent value="settings">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Your Recent Activity</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800">Marketplace</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent marketplace activity.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Financial Applications</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent financial applications.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Network Activity</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent network activity.</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Training</h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">No recent training activity.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;

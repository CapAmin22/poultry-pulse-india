
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Save, User, Bell, Lock, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketUpdates: boolean;
  newsAlerts: boolean;
  trainingEvents: boolean;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: 'John',
    lastName: 'Farmer',
    email: 'john.farmer@example.com',
    phone: '+91 9876543210',
    address: '123 Poultry Farm Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    zipCode: '560001'
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketUpdates: true,
    newsAlerts: true,
    trainingEvents: false
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (name: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
                  <AvatarImage src="https://i.pravatar.cc/150?u=johnfarmer" alt="John Farmer" />
                  <AvatarFallback>JF</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h1>
                <p className="text-gray-500">Poultry Farmer</p>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </div>
          
          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-100">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
              >
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
              >
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Security</span>
                <span className="sm:hidden">Security</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal information and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName"
                        value={profileData.firstName} 
                        onChange={handleProfileChange} 
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName"
                        value={profileData.lastName} 
                        onChange={handleProfileChange} 
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 flex items-start gap-2">
                      <Mail className="h-5 w-5 text-gray-500 mt-7" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={profileData.email} 
                          onChange={handleProfileChange} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 flex items-start gap-2">
                      <Phone className="h-5 w-5 text-gray-500 mt-7" />
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={profileData.phone} 
                          onChange={handleProfileChange} 
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">Address Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input 
                          id="address" 
                          name="address"
                          value={profileData.address} 
                          onChange={handleProfileChange} 
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city"
                            value={profileData.city} 
                            onChange={handleProfileChange} 
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state"
                            value={profileData.state} 
                            onChange={handleProfileChange} 
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                          <Input 
                            id="zipCode" 
                            name="zipCode"
                            value={profileData.zipCode} 
                            onChange={handleProfileChange} 
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 flex items-start gap-2">
                          <Globe className="h-5 w-5 text-gray-500 mt-7" />
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input 
                              id="country" 
                              name="country"
                              value={profileData.country} 
                              onChange={handleProfileChange} 
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {isEditing && (
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notification Settings Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications from 22POULTRY.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Communication Channels</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationChange('emailNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch 
                        id="smsNotifications" 
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={() => handleNotificationChange('smsNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications through the app</p>
                      </div>
                      <Switch 
                        id="pushNotifications" 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleNotificationChange('pushNotifications')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketUpdates">Market Updates</Label>
                        <p className="text-sm text-gray-500">Daily poultry market price updates</p>
                      </div>
                      <Switch 
                        id="marketUpdates" 
                        checked={notificationSettings.marketUpdates}
                        onCheckedChange={() => handleNotificationChange('marketUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="newsAlerts">News Alerts</Label>
                        <p className="text-sm text-gray-500">Important industry news and alerts</p>
                      </div>
                      <Switch 
                        id="newsAlerts" 
                        checked={notificationSettings.newsAlerts}
                        onCheckedChange={() => handleNotificationChange('newsAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="trainingEvents">Training Events</Label>
                        <p className="text-sm text-gray-500">Upcoming workshops and training sessions</p>
                      </div>
                      <Switch 
                        id="trainingEvents" 
                        checked={notificationSettings.trainingEvents}
                        onCheckedChange={() => handleNotificationChange('trainingEvents')}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleSaveNotifications} 
                    className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </Button>
                  </form>
                  
                  <div className="pt-6 space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    
                    <Button variant="outline">
                      Set Up Two-Factor Authentication
                    </Button>
                  </div>
                  
                  <div className="pt-6 space-y-4">
                    <h3 className="text-lg font-medium">Login Sessions</h3>
                    <p className="text-sm text-gray-500">
                      These are devices that have logged into your account. Revoke any sessions that you don't recognize.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-gray-500">Web Browser • New Delhi, India</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-green-600">Active</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-sm text-gray-500">iOS • Bengaluru, India</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-600">Revoke</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;


import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Bell, Lock, Mail, Shield, Smartphone, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const UserSettings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    priceAlerts: true,
    marketUpdates: true,
    newsAlerts: true,
    trainingReminders: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    allowMessaging: true,
    dataSharing: false,
  });

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));

    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handlePrivacyChange = (setting: keyof typeof privacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: typeof value === 'boolean' ? value : value
    }));

    toast({
      title: "Settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "New password and confirmation must match.",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      // Clear form
      (e.target as HTMLFormElement).reset();
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error.message || "There was a problem updating your password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, this would need to be handled by a server-side function
      // with proper authentication and authorization
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete the account deletion process.",
      });
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "There was a problem with your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and security</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="mb-4">
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive email updates about your account</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications} 
                  onCheckedChange={() => handleNotificationChange('emailNotifications')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Price Alerts</h3>
                  <p className="text-xs text-gray-500">Get notified about significant price changes</p>
                </div>
                <Switch 
                  checked={notificationSettings.priceAlerts} 
                  onCheckedChange={() => handleNotificationChange('priceAlerts')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Market Updates</h3>
                  <p className="text-xs text-gray-500">Daily digest of market trends and data</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketUpdates} 
                  onCheckedChange={() => handleNotificationChange('marketUpdates')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">News Alerts</h3>
                  <p className="text-xs text-gray-500">Important industry news and events</p>
                </div>
                <Switch 
                  checked={notificationSettings.newsAlerts} 
                  onCheckedChange={() => handleNotificationChange('newsAlerts')} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Training Reminders</h3>
                  <p className="text-xs text-gray-500">Notifications about upcoming training sessions</p>
                </div>
                <Switch 
                  checked={notificationSettings.trainingReminders} 
                  onCheckedChange={() => handleNotificationChange('trainingReminders')} 
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button>Save Notification Preferences</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select 
                  value={privacySettings.profileVisibility} 
                  onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Everyone can see)</SelectItem>
                    <SelectItem value="connections">Connections Only</SelectItem>
                    <SelectItem value="private">Private (Only you)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Show Contact Information</h3>
                  <p className="text-xs text-gray-500">Allow others to see your contact details</p>
                </div>
                <Switch 
                  checked={privacySettings.showContactInfo} 
                  onCheckedChange={(value) => handlePrivacyChange('showContactInfo', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Allow Messaging</h3>
                  <p className="text-xs text-gray-500">Let other users send you direct messages</p>
                </div>
                <Switch 
                  checked={privacySettings.allowMessaging} 
                  onCheckedChange={(value) => handlePrivacyChange('allowMessaging', value)} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Data Sharing for Analytics</h3>
                  <p className="text-xs text-gray-500">Share anonymized data to improve platform services</p>
                </div>
                <Switch 
                  checked={privacySettings.dataSharing} 
                  onCheckedChange={(value) => handlePrivacyChange('dataSharing', value)} 
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button>Save Privacy Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Change Password</h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    name="currentPassword"
                    type="password" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword"
                    type="password" 
                    required 
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    type="password" 
                    required 
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
              
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Delete Account</h4>
                    <p className="text-xs text-red-700 mt-1">
                      This will permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="mt-3">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                              <p className="font-medium">Warning</p>
                              <p>You'll lose all your data, profile information, and access to the platform.</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmDelete">Type "DELETE" to confirm</Label>
                            <Input id="confirmDelete" placeholder="DELETE" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>Cancel</Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteAccount}
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'Delete Account'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
              <div className="flex items-start mb-4">
                <Smartphone className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">SMS Authentication</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Add an extra layer of security by receiving a code on your phone when you sign in.
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Set Up Two-Factor Authentication
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Communication Preferences</h3>
              <div className="flex items-start mb-4">
                <Mail className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Communications</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage the emails you receive from us for account security and updates.
                  </p>
                </div>
              </div>
              <Button variant="outline">
                Manage Email Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserSettings;

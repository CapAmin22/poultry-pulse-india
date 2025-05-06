
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, Database } from 'lucide-react';

// This component allows admins to configure system-level settings
const AdminSystemSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="backup">Backup & Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Platform Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure general platform settings and appearance.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-gray-600">
                      Temporarily disable access to the platform during maintenance.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">User Registration</Label>
                    <p className="text-sm text-gray-600">
                      Allow new users to register on the platform.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Marketplace Transactions</Label>
                    <p className="text-sm text-gray-600">
                      Enable users to buy and sell products in the marketplace.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="22POULTRY" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="the22poultry@gmail.com" type="email" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Input id="platform-description" defaultValue="Digital platform for poultry farmers in India" className="mt-1" />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure system notifications and alerts.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Send email notifications for important system events.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Send SMS alerts for critical updates.
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">System Announcements</Label>
                    <p className="text-sm text-gray-600">
                      Display system-wide announcements to all users.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Configure platform security and access controls.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">
                      Require two-factor authentication for all admin accounts.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Content Moderation</Label>
                    <p className="text-sm text-gray-600">
                      Automatically moderate user-generated content.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Account Verification</Label>
                    <p className="text-sm text-gray-600">
                      Require email verification for new accounts.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="backup">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Backup & Maintenance
                </h3>
                <p className="text-sm text-gray-600">
                  Configure database backups and system maintenance.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Automated Backups</Label>
                    <p className="text-sm text-gray-600">
                      Schedule regular automated backups of the database.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div>
                  <Label className="text-base">Backup Frequency</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Button variant="outline">Daily</Button>
                    <Button variant="outline" className="bg-gray-100">Weekly</Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="mr-2">Create Manual Backup</Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">System Maintenance</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Optimize Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-amber-600 hover:text-amber-700">
                    Rebuild Search Index
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminSystemSettings;

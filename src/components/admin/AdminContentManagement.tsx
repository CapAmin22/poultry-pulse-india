
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, PlusCircle } from 'lucide-react';

// This component manages content like news articles, resources, and reported content
const AdminContentManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resources">
          <TabsList className="mb-4">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="news">News Articles</TabsTrigger>
            <TabsTrigger value="reports">Reported Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resources">
            <div className="text-center py-10">
              <FileText className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage Educational Resources</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Add, edit or remove educational content and resources for poultry farmers and other stakeholders.
              </p>
              <Button className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Resource
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="text-center py-10">
              <FileText className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage News Articles</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Create, edit and publish news articles relevant to the poultry industry.
              </p>
              <Button className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Article
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="text-center py-10">
              <AlertCircle className="h-16 w-16 mx-auto text-amber-300" />
              <h3 className="text-lg font-medium mt-4">Reported Content</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Review and moderate content that has been reported by users for violating platform guidelines.
              </p>
              <Button className="mt-4">View Reports</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminContentManagement;

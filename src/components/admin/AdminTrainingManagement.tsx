
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

// This component manages training resources, courses, and certifications
const AdminTrainingManagement: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="courses">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <div className="text-center py-10">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage Training Courses</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Add, edit or remove training courses and educational content for poultry farmers.
              </p>
              <Button className="mt-4">View All Courses</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trainers">
            <div className="text-center py-10">
              <Users className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Manage Trainers</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Review and approve trainers who can provide educational content on the platform.
              </p>
              <Button className="mt-4">View Trainers</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="text-center py-10">
              <Calendar className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Training Events</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Schedule and manage training events, workshops, and webinars.
              </p>
              <Button className="mt-4">Manage Events</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <div className="text-center py-10">
              <Award className="h-16 w-16 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium mt-4">Certification Programs</h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                Create and manage certification programs for poultry farmers and professionals.
              </p>
              <Button className="mt-4">View Certifications</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTrainingManagement;

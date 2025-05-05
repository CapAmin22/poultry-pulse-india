
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Calendar, Search, Filter, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

const trainingCoursesData = [
  {
    id: 1,
    title: 'Poultry Disease Prevention and Control',
    provider: 'National Poultry Research Institute',
    level: 'Intermediate',
    duration: '4 weeks',
    format: 'Online',
    rating: 4.8,
    enrollments: 1245,
    tags: ['Disease Management', 'Biosecurity'],
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    price: 'Free'
  },
  {
    id: 2,
    title: 'Advanced Broiler Management',
    provider: 'Agricultural University',
    level: 'Advanced',
    duration: '6 weeks',
    format: 'Hybrid',
    rating: 4.6,
    enrollments: 872,
    tags: ['Management', 'Broiler', 'Production'],
    image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    price: '₹2,500'
  },
  {
    id: 3,
    title: 'Egg Production and Layer Management',
    provider: 'Poultry Farming Association',
    level: 'Beginner',
    duration: '3 weeks',
    format: 'Online',
    rating: 4.5,
    enrollments: 1035,
    tags: ['Layer', 'Egg Production', 'Management'],
    image: 'https://images.unsplash.com/photo-1569127959161-2b1297b2d9a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    price: 'Free'
  },
  {
    id: 4,
    title: 'Poultry Nutrition and Feed Formulation',
    provider: 'Veterinary College',
    level: 'Intermediate',
    duration: '5 weeks',
    format: 'Online',
    rating: 4.9,
    enrollments: 756,
    tags: ['Nutrition', 'Feed', 'Health'],
    image: 'https://images.unsplash.com/photo-1627484164059-c965695234ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    price: '₹1,800'
  }
];

const upcomingEventsData = [
  {
    id: 1,
    title: 'Poultry Farmers Workshop',
    organizer: 'State Agriculture Department',
    date: 'June 15, 2023',
    location: 'Agricultural Research Center, Hyderabad',
    type: 'Workshop',
    description: 'Join us for a comprehensive workshop on modern poultry farming techniques and disease management.',
  },
  {
    id: 2,
    title: 'International Poultry Expo',
    organizer: 'Poultry Association of India',
    date: 'July 8-10, 2023',
    location: 'Exhibition Center, New Delhi',
    type: 'Exhibition',
    description: 'The largest poultry exhibition in the region showcasing the latest technologies, equipment, and innovations.',
  },
];

interface NewCourseFormData {
  title: string;
  description: string;
  level: string;
  duration: string;
  price: string;
  format: string;
  category: string;
}

const initialFormData: NewCourseFormData = {
  title: '',
  description: '',
  level: 'Beginner',
  duration: '',
  price: '',
  format: 'Online',
  category: ''
};

const Training: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [formData, setFormData] = useState<NewCourseFormData>(initialFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [myPublishedCourses, setMyPublishedCourses] = useState<any[]>([]);
  const [myEnrolledCourses, setMyEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        const role = userMetadata.role || '';
        setUserRole(role);
        
        // If user is a trainer, fetch their published courses
        if (role === 'trainer') {
          // In a real app, fetch from database
          setMyPublishedCourses(trainingCoursesData.slice(0, 2));
        } else {
          // For other roles, fetch their enrolled courses
          // In a real app, fetch from database
          setMyEnrolledCourses(trainingCoursesData.slice(0, 1));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserRole();
  }, [user]);

  const filteredCourses = trainingCoursesData.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, send this data to the server
    console.log('Course data submitted:', formData);
    
    // Add to local state for immediate UI update
    const newCourse = {
      id: Date.now(),
      title: formData.title,
      provider: 'Your Organization',
      level: formData.level,
      duration: formData.duration,
      format: formData.format,
      rating: 0,
      enrollments: 0,
      tags: [formData.category],
      image: 'https://images.unsplash.com/photo-1627484164059-c965695234ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
      price: formData.price || 'Free'
    };
    
    setMyPublishedCourses(prev => [...prev, newCourse]);
    setFormData(initialFormData);
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Training & Education</h1>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="courses" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                Video Library
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </TabsTrigger>
              
              {user && userRole === 'trainer' && (
                <TabsTrigger value="my_courses" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Courses
                </TabsTrigger>
              )}
              
              {user && userRole !== 'trainer' && (
                <TabsTrigger value="enrolled" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Learning
                </TabsTrigger>
              )}
            </TabsList>
            
            {user && userRole === 'trainer' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#f5565c]">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Course Title
                        </label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full rounded-md border border-gray-300 p-2"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                            Level
                          </label>
                          <select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (e.g., "4 weeks")
                          </label>
                          <Input
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price (leave blank for free)
                          </label>
                          <Input
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="₹0"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
                            Format
                          </label>
                          <select
                            id="format"
                            name="format"
                            value={formData.format}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 p-2"
                          >
                            <option value="Online">Online</option>
                            <option value="In-person">In-person</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Category
                        </label>
                        <Input
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          placeholder="e.g., Disease Management"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#f5565c]">
                        Create Course
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Available Courses</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search courses..." 
                        className="pl-8" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filters</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredCourses.map(course => (
                    <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-white px-2 py-1 rounded text-xs font-medium">
                            {course.price}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{course.provider}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm ml-1">{course.rating}</span>
                          <span className="text-sm text-gray-500 ml-2">({course.enrollments} enrollments)</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {course.level}
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {course.duration}
                          </span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                            {course.format}
                          </span>
                        </div>
                        <div className="mt-3">
                          <Button className="w-full bg-[#0FA0CE]">
                            {userRole === 'trainer' ? 'View Course' : 'Enroll Now'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or check back later.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Video Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Video Library Coming Soon</h3>
                  <p className="mt-1 text-gray-500">Check back for instructional videos and webinar recordings.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingEventsData.map(event => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </div>
                          <p className="text-sm mt-2">{event.description}</p>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start md:items-end">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {event.type}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">{event.location}</p>
                          <Button className="mt-4 bg-[#0FA0CE]">
                            Register
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my_courses">
            {userRole === 'trainer' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Published Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                    </div>
                  ) : myPublishedCourses.length > 0 ? (
                    <div className="space-y-4">
                      {myPublishedCourses.map(course => (
                        <div key={course.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between">
                          <div className="flex-grow">
                            <h3 className="font-medium">{course.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm ml-1">{course.rating}</span>
                              <span className="text-sm text-gray-500 ml-2">({course.enrollments} enrollments)</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                {course.level}
                              </span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                {course.duration}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 sm:mt-0">
                            <Button variant="outline" size="sm">View Analytics</Button>
                            <Button variant="outline" size="sm">Edit Course</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No courses published yet</h3>
                      <p className="mt-1 text-gray-500">Create your first course to share your expertise.</p>
                      <Button 
                        className="mt-4 bg-[#f5565c]"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Course
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="enrolled">
            {userRole !== 'trainer' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Enrolled Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center p-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
                    </div>
                  ) : myEnrolledCourses.length > 0 ? (
                    <div className="space-y-4">
                      {myEnrolledCourses.map(course => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">By {course.provider}</p>
                          <div className="mt-3 bg-gray-100 h-2 rounded-full">
                            <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
                          </div>
                          <div className="mt-2 flex justify-between text-xs">
                            <span>33% complete</span>
                            <span>12 of 36 lessons</span>
                          </div>
                          <div className="mt-4">
                            <Button className="bg-[#0FA0CE]">Continue Learning</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">You haven't enrolled in any courses yet</h3>
                      <p className="mt-1 text-gray-500">Browse our course catalog to find courses that match your interests.</p>
                      <Button 
                        className="mt-4 bg-[#0FA0CE]"
                        onClick={() => setActiveTab('courses')}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Training;

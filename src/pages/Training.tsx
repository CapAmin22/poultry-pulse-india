
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, Calendar, ChevronRight, Clock, Filter, GraduationCap, MapPin, Search, Star, Users, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Sample data for training courses
const courses = [
  {
    id: 1,
    title: 'Modern Poultry Farm Management',
    instructor: 'Dr. Anita Sharma',
    institution: 'National Poultry Research Institute',
    duration: '8 weeks',
    level: 'Intermediate',
    rating: 4.8,
    reviews: 124,
    enrolled: 1289,
    format: 'online',
    image: 'https://i.pravatar.cc/150?img=1',
    topics: ['Poultry Housing', 'Ventilation Systems', 'Feed Management', 'Disease Prevention'],
    description: 'A comprehensive course covering all aspects of running a modern poultry farm efficiently and profitably.'
  },
  {
    id: 2,
    title: 'Advanced Poultry Health Management',
    instructor: 'Dr. Rajesh Kumar',
    institution: 'Veterinary College of India',
    duration: '6 weeks',
    level: 'Advanced',
    rating: 4.9,
    reviews: 87,
    enrolled: 845,
    format: 'online',
    image: 'https://i.pravatar.cc/150?img=2',
    topics: ['Disease Diagnosis', 'Vaccination Programs', 'Biosecurity', 'Health Monitoring'],
    description: 'Learn advanced techniques to manage poultry health and prevent disease outbreaks in your farm.'
  },
  {
    id: 3,
    title: 'Organic Poultry Farming',
    instructor: 'Prof. Meena Patel',
    institution: 'Sustainable Agriculture Institute',
    duration: '4 weeks',
    level: 'Beginner',
    rating: 4.7,
    reviews: 56,
    enrolled: 623,
    format: 'hybrid',
    image: 'https://i.pravatar.cc/150?img=3',
    topics: ['Organic Feed', 'Free-Range Systems', 'Natural Health', 'Certification'],
    description: 'Master the principles and practices of organic poultry farming for premium market opportunities.'
  },
  {
    id: 4,
    title: 'Poultry Nutrition and Feed Formulation',
    instructor: 'Dr. Sanjay Verma',
    institution: 'Agricultural University',
    duration: '5 weeks',
    level: 'Intermediate',
    rating: 4.6,
    reviews: 92,
    enrolled: 958,
    format: 'online',
    image: 'https://i.pravatar.cc/150?img=4',
    topics: ['Feed Ingredients', 'Ration Formulation', 'Nutrition Requirements', 'Feed Manufacturing'],
    description: 'Learn to formulate cost-effective, nutritionally balanced feeds for different poultry age groups.'
  }
];

// Sample data for workshops and seminars
const workshops = [
  {
    id: 1,
    title: 'Layer Farm Management Workshop',
    organizer: 'Indian Poultry Association',
    date: 'June 15-16, 2025',
    location: 'Delhi',
    type: 'In-person',
    price: '₹2,500',
    spots: 50,
    remaining: 12,
    topics: ['Layer Housing', 'Egg Production', 'Quality Management'],
    description: 'A hands-on workshop for layer farm owners and managers to optimize production.'
  },
  {
    id: 2,
    title: 'Broiler Production Masterclass',
    organizer: 'Poultry Technology Institute',
    date: 'July 8-9, 2025',
    location: 'Hyderabad',
    type: 'In-person',
    price: '₹3,000',
    spots: 40,
    remaining: 8,
    topics: ['Growth Management', 'Feed Efficiency', 'Processing Standards'],
    description: 'Intensive training on modern broiler production techniques for commercial farms.'
  },
  {
    id: 3,
    title: 'Poultry Disease Management Seminar',
    organizer: 'Veterinary Council of India',
    date: 'May 25, 2025',
    location: 'Online',
    type: 'Virtual',
    price: '₹1,200',
    spots: 100,
    remaining: 43,
    topics: ['Disease Diagnosis', 'Treatment Protocols', 'Biosecurity'],
    description: 'Learn from leading veterinarians about managing common and emerging poultry diseases.'
  },
  {
    id: 4,
    title: 'Poultry Farm Financial Management',
    organizer: 'Agricultural Finance Institute',
    date: 'August 12, 2025',
    location: 'Mumbai',
    type: 'Hybrid',
    price: '₹2,000',
    spots: 60,
    remaining: 22,
    topics: ['Cost Analysis', 'Profit Optimization', 'Financial Planning'],
    description: 'Master the financial aspects of running a successful poultry business.'
  }
];

// Sample data for resources
const resources = [
  {
    id: 1,
    title: 'The Complete Guide to Poultry Farming',
    author: 'Indian Council of Agricultural Research',
    type: 'PDF',
    size: '8.5 MB',
    pages: 245,
    topics: ['Farm Setup', 'Management', 'Health', 'Marketing'],
    downloads: 12580
  },
  {
    id: 2,
    title: 'Poultry Vaccination Schedule & Techniques',
    author: 'National Poultry Research Institute',
    type: 'PDF',
    size: '4.2 MB',
    pages: 68,
    topics: ['Vaccination', 'Health Management', 'Disease Prevention'],
    downloads: 9845
  },
  {
    id: 3,
    title: 'Layer Farm Management Video Series',
    author: 'Agricultural Extension Services',
    type: 'Video',
    size: '1.2 GB',
    duration: '120 minutes',
    topics: ['Housing', 'Feeding', 'Egg Collection', 'Grading'],
    views: 25670
  },
  {
    id: 4,
    title: 'Poultry Feed Formulation Calculator',
    author: 'Animal Nutrition Institute',
    type: 'Spreadsheet',
    size: '3.8 MB',
    topics: ['Feed Formulation', 'Nutrition', 'Cost Calculation'],
    downloads: 7630
  }
];

const Training: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCourseEnroll = (courseId: number) => {
    toast({
      title: "Course Enrollment Initiated",
      description: "You've begun the enrollment process for this course.",
    });
  };
  
  const handleWorkshopRegister = (workshopId: number) => {
    toast({
      title: "Registration Started",
      description: "You've started the registration process for this workshop.",
    });
  };
  
  const handleResourceDownload = (resourceId: number) => {
    toast({
      title: "Download Started",
      description: "Your resource is being downloaded.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Training & Education</h1>
          <p className="text-gray-500 mt-1">
            Enhance your poultry farming knowledge with courses, workshops, and resources
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search for courses, workshops, or resources..." 
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="courses" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <GraduationCap className="h-4 w-4 mr-2 hidden sm:block" />
              Courses
            </TabsTrigger>
            <TabsTrigger 
              value="workshops" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Users className="h-4 w-4 mr-2 hidden sm:block" />
              Workshops
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <BookOpen className="h-4 w-4 mr-2 hidden sm:block" />
              Resources
            </TabsTrigger>
          </TabsList>
          
          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <motion.div 
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription className="mt-1 flex items-center">
                            <img 
                              src={course.image} 
                              alt={course.instructor} 
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            {course.instructor}, {course.institution}
                          </CardDescription>
                        </div>
                        <Badge className={
                          course.format === 'online' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                            : course.format === 'hybrid'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                            : 'bg-green-100 text-green-800 hover:bg-green-100'
                        }>
                          {course.format === 'online' ? 'Online' : 
                           course.format === 'hybrid' ? 'Hybrid' : 'In-person'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <p>{course.duration}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <p>{course.rating} ({course.reviews} reviews)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <p>{course.level}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <p>{course.enrolled.toLocaleString()} enrolled</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="font-normal text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        onClick={() => handleCourseEnroll(course.id)}
                      >
                        Enroll Now
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Load More Courses</Button>
            </div>
          </TabsContent>
          
          {/* Workshops Tab */}
          <TabsContent value="workshops" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workshops.map((workshop) => (
                <motion.div 
                  key={workshop.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{workshop.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Organized by {workshop.organizer}
                          </CardDescription>
                        </div>
                        <Badge className={
                          workshop.type === 'In-person' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : workshop.type === 'Virtual'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                        }>
                          {workshop.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-gray-600 mb-4">{workshop.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p>{workshop.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <p>{workshop.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <p>{workshop.remaining} spots left</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{workshop.price}</span>
                          <p>per person</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {workshop.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="font-normal text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <p className={`text-sm ${workshop.remaining < 10 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                        {workshop.remaining < 10 
                          ? `Only ${workshop.remaining} seats remaining!` 
                          : `${workshop.remaining} of ${workshop.spots} spots available`}
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        onClick={() => handleWorkshopRegister(workshop.id)}
                      >
                        Register
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Events</Button>
            </div>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <h3 className="font-medium">Filter by type:</h3>
                <div className="flex items-center gap-2">
                  <Checkbox id="pdf" />
                  <label htmlFor="pdf">PDF</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="video" />
                  <label htmlFor="video">Video</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="spreadsheet" />
                  <label htmlFor="spreadsheet">Spreadsheet</label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <motion.div 
                  key={resource.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription className="mt-1">
                            By {resource.author}
                          </CardDescription>
                        </div>
                        <Badge className={
                          resource.type === 'PDF' 
                            ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                            : resource.type === 'Video'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                            : 'bg-green-100 text-green-800 hover:bg-green-100'
                        }>
                          {resource.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-500">Size:</p>
                          <p>{resource.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.type === 'Video' ? (
                            <>
                              <Clock className="h-4 w-4 text-gray-500" />
                              <p>{resource.duration}</p>
                            </>
                          ) : resource.pages ? (
                            <>
                              <BookOpen className="h-4 w-4 text-gray-500" />
                              <p>{resource.pages} pages</p>
                            </>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          {resource.type === 'Video' ? (
                            <>
                              <Video className="h-4 w-4 text-gray-500" />
                              <p>{resource.views?.toLocaleString()} views</p>
                            </>
                          ) : resource.downloads ? (
                            <>
                              <p className="text-gray-500">Downloads:</p>
                              <p>{resource.downloads.toLocaleString()}</p>
                            </>
                          ) : null}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {resource.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="font-normal text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <Button 
                        className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                        onClick={() => handleResourceDownload(resource.id)}
                      >
                        {resource.type === 'Video' ? 'Watch Now' : 'Download'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Browse Resource Library</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Training;

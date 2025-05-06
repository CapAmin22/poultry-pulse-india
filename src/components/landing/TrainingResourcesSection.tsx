
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Video, FileText, Calendar, ChevronRight, Award, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainingResourcesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const trainingResources = [
    {
      icon: <Video className="h-10 w-10 text-white" />,
      title: "Video Tutorials",
      description: "Watch expert-led video tutorials covering all aspects of modern poultry farming",
      count: "120+",
      color: "bg-[#ea384c]"
    },
    {
      icon: <FileText className="h-10 w-10 text-white" />,
      title: "Guides & PDFs",
      description: "Download comprehensive guides, checklists and resource materials in multiple languages",
      count: "85+",
      color: "bg-[#0FA0CE]"
    },
    {
      icon: <Calendar className="h-10 w-10 text-white" />,
      title: "Live Webinars",
      description: "Join interactive webinars and virtual events with industry experts and successful farmers",
      count: "Monthly",
      color: "bg-green-500"
    }
  ];
  
  const coursesList = [
    {
      title: "Poultry Farm Management Masterclass",
      instructor: "Dr. Rajesh Sharma",
      level: "Intermediate",
      duration: "4 weeks",
      students: 1245
    },
    {
      title: "Disease Prevention & Bird Health",
      instructor: "Dr. Meena Gupta",
      level: "All Levels",
      duration: "3 weeks",
      students: 879
    },
    {
      title: "Profitable Marketing Strategies",
      instructor: "Vikram Patel",
      level: "Advanced",
      duration: "2 weeks",
      students: 632
    }
  ];
  
  return (
    <section id="training" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-600 text-sm font-medium">Expert-Led Training</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Enhance Your Knowledge & Skills</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access our extensive library of training resources created by industry experts and successful poultry farmers.
            Learn the latest techniques, best practices, and strategies to improve your poultry business.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {trainingResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className={`${resource.color} p-4 rounded-xl mb-6 inline-block group-hover:scale-110 transition-transform`}>
                {resource.icon}
              </div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">{resource.title}</h3>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{resource.count}</span>
              </div>
              <p className="text-gray-600 mb-6">{resource.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-[#ea384c] hover:bg-red-50 p-0 h-auto"
              >
                Explore Resources <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-white mb-4">Premium Certification Courses</h3>
              <p className="text-blue-100 mb-6">
                Enhance your credentials with our industry-recognized certification programs designed for poultry professionals.
              </p>
              
              <div className="space-y-4 mb-8">
                {coursesList.map((course, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium text-white">{course.title}</h4>
                      <span className="text-xs bg-blue-500/30 text-white px-2 py-1 rounded">
                        {course.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-blue-100 text-sm">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students} students
                      </div>
                      <div>{course.duration}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                View All Courses <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/80 z-10"></div>
              <img 
                src="https://i.pravatar.cc/800?img=10" 
                alt="Training Session" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 rounded-xl p-8 shadow-md"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to upgrade your farming knowledge?</h3>
              <p className="text-gray-600 max-w-xl">
                Join thousands of poultry farmers who are already benefiting from our training resources.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-y-2">
                <div className="flex items-center mr-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Expert instructors</span>
                </div>
                <div className="flex items-center mr-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Multilingual content</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Mobile-friendly</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-[#ea384c] hover:bg-[#d02f3d]"
            >
              Access Training Resources <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingResourcesSection;

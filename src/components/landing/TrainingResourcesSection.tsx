
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Video, FileText, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainingResourcesSection: React.FC = () => {
  const navigate = useNavigate();
  
  const trainingResources = [
    {
      icon: <Video className="h-8 w-8 text-[#ea384c]" />,
      title: "Video Tutorials",
      description: "Access expert-led video tutorials covering all aspects of poultry farming",
      count: "120+"
    },
    {
      icon: <FileText className="h-8 w-8 text-[#ea384c]" />,
      title: "Guides & PDFs",
      description: "Download comprehensive guides and resource materials",
      count: "85+"
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#ea384c]" />,
      title: "Webinars & Events",
      description: "Join live webinars and virtual events with industry experts",
      count: "Monthly"
    }
  ];
  
  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-[#ea384c]/5 to-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Training & Educational Resources</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your knowledge and skills with our extensive library of training resources created by industry experts.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {trainingResources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#ea384c]/10 p-3 rounded-full">{resource.icon}</div>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">{resource.count}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center"
        >
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-[#ea384c] hover:bg-[#d02f3d]"
          >
            Access Training Resources <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingResourcesSection;

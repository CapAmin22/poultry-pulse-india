
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeHero: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ea384c]/90 to-[#0FA0CE]/90 p-8 text-white shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between"
      >
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome to 22POULTRY</h1>
          <p className="text-white/90">
            Your integrated digital platform for the Indian poultry industry, providing real-time data, market insights, and comprehensive resources to help your business thrive.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="default" 
              className="bg-white hover:bg-gray-100 text-[#ea384c] border-0"
            >
              <BarChart3 className="mr-2 h-4 w-4" /> View Complete Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent text-white hover:bg-white/20 border-white"
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-4 mt-6 lg:mt-0">
          <img 
            src="/lovable-uploads/b1f21161-69db-4daf-8f6d-4d359738f8d7.png" 
            alt="22POULTRY" 
            className="h-28 w-auto object-contain" 
          />
        </div>
      </motion.div>
      
      {/* Background Pattern - subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute top-10 right-20 w-6 h-6 rounded-full bg-yellow-300/30"></div>
      <div className="absolute top-20 right-40 w-4 h-4 rounded-full bg-blue-300/30"></div>
    </motion.div>
  );
};

export default WelcomeHero;

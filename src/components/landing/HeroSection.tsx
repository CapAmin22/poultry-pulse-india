import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const features = ["Real-time market data & insights", "Financial assistance & loans", "Exclusive training resources", "Connect with industry experts"];
  return <motion.section initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.8
  }} className="relative bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] py-20 px-4 sm:px-6 md:py-28">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          x: -50,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.2,
          duration: 0.8
        }} className="text-white">
            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-white text-sm font-medium">India's #1 Poultry Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Revolutionize Your <span className="text-yellow-300">Poultry Business</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl">
              India's first complete digital platform designed exclusively for poultry farmers. 
              Get access to market insights, financial assistance, training, and connect with experts.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-y-3">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5 + index * 0.1,
              duration: 0.5
            }} className="flex items-center">
                  <span className="flex items-center justify-center bg-white/20 rounded-full w-5 h-5 mr-2">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-white/90 text-sm">{feature}</span>
                </motion.div>)}
            </div>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Button onClick={() => navigate('/auth')} size="lg" className="bg-white text-[#ea384c] hover:bg-gray-100 shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={() => navigate('/contact')} variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-[#ea384c]">
                Contact Us
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{
          x: 50,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.4,
          duration: 0.8
        }} className="flex justify-center relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="22POULTRY Platform" className="max-w-full h-auto max-h-[450px] object-contain drop-shadow-2xl" />
              
              
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="fill-white h-12 sm:h-16 w-full">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </motion.section>;
};
export default HeroSection;
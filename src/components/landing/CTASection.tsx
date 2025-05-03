
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-[#ea384c] to-[#0FA0CE]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white md:max-w-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Poultry Business?</h2>
            <p className="text-white/90 text-lg">
              Join thousands of poultry farmers across India who are already benefiting from our comprehensive platform.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg" 
              className="bg-white text-[#ea384c] hover:bg-gray-100"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/contact')} 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-[#ea384c]"
            >
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

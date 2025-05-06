
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTASection: React.FC = () => {
  const navigate = useNavigate();
  
  const benefits = [
    "Real-time market prices & trends",
    "Connect with verified buyers & sellers",
    "Access to specialized financial services",
    "Expert training & resources"
  ];
  
  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ea384c] to-[#0FA0CE]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-white/5"></div>
      <div className="absolute top-20 left-0 w-full h-10 bg-white/5"></div>
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full bg-white/10"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Poultry Business?</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Join thousands of poultry farmers across India who are already benefiting from our comprehensive platform.
                </p>
                
                <div className="space-y-4 mb-10">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                      className="flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/auth')} 
                    size="lg" 
                    className="bg-[#ea384c] text-white hover:bg-[#d02f3d]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/contact')} 
                    variant="outline" 
                    size="lg" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Contact Sales
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  No credit card required. Free plan includes all essential features.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-[#ea384c]/90 to-[#0FA0CE]/90 flex items-center justify-center">
                <div className="text-center p-12 text-white">
                  <h3 className="text-3xl font-bold mb-6">Trusted by 10,000+ Farmers</h3>
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-yellow-300 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2">5.0 Rating</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Increased revenue by</p>
                      <p className="text-4xl font-bold">23%</p>
                    </div>
                    <div>
                      <p className="font-medium">Reduced costs by</p>
                      <p className="text-4xl font-bold">18%</p>
                    </div>
                  </div>
                </div>
              </div>
              <img 
                src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" 
                alt="Poultry Farming" 
                className="object-cover h-full w-full"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;


import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Users,
  GraduationCap,
  DollarSign,
  BarChart2,
  MessageSquare,
  Check,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart2 className="h-12 w-12 p-2 bg-red-100 text-[#ea384c] rounded-xl" />,
      title: "Market Analytics",
      description: "Access real-time poultry market prices and analytics to make informed decisions."
    },
    {
      icon: <Users className="h-12 w-12 p-2 bg-red-100 text-[#ea384c] rounded-xl" />,
      title: "Industry Network",
      description: "Connect with farmers, experts, and other stakeholders in the poultry industry."
    },
    {
      icon: <DollarSign className="h-12 w-12 p-2 bg-red-100 text-[#ea384c] rounded-xl" />,
      title: "Financial Services",
      description: "Explore loans, subsidies and financial assistance programs for your poultry business."
    },
    {
      icon: <GraduationCap className="h-12 w-12 p-2 bg-red-100 text-[#ea384c] rounded-xl" />,
      title: "Training Resources",
      description: "Access educational content and training materials for poultry farming best practices."
    }
  ];

  const testimonials = [
    {
      quote: "22POULTRY has transformed the way I manage my poultry farm. The market insights alone have increased my profits by 15%.",
      author: "Rajesh Kumar",
      role: "Poultry Farmer, Karnataka"
    },
    {
      quote: "The networking features have connected me with suppliers and buyers across India, expanding my business significantly.",
      author: "Priya Sharma",
      role: "Distributor, Delhi NCR"
    },
    {
      quote: "As a financial provider, we've been able to reach targeted customers through this platform, increasing our loan portfolio.",
      author: "Amit Patel",
      role: "Agricultural Finance Officer"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" 
                alt="22POULTRY" 
                className="h-10 w-auto" 
              />
              <span className="font-bold text-xl text-[#f5565c]">22POULTRY</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#features" className="text-gray-600 hover:text-[#ea384c]">Features</a>
              <a href="#about" className="text-gray-600 hover:text-[#ea384c]">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-[#ea384c]">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-[#ea384c]">Contact</a>
              <Button 
                variant="outline" 
                className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
            <Button 
              className="md:hidden border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
          <video 
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://player.vimeo.com/progressive_redirect/playback/771259686/rendition/1080p/file.mp4?loc=external&signature=9499cbcee67a79afe753c581916e3ee8c9b10c1345739efbec175441fe06c1c8" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 text-white">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Empowering India's <span className="text-[#ea384c]">Poultry Industry</span> Through Digital Innovation
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-gray-200 mb-8"
              >
                Join India's first integrated digital platform connecting farmers, distributors, processors, and service providers across the poultry value chain.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  className="bg-[#ea384c] hover:bg-[#d02f3d] text-white px-6 py-2"
                  onClick={() => navigate('/auth', { state: { initialMode: 'signup' } })}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => navigate('/contact')}
                >
                  Learn More
                </Button>
              </motion.div>
              
              <div className="mt-8 bg-white/10 backdrop-blur-md p-4 rounded-lg inline-block">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-full bg-white/20 border-0 text-white hover:bg-white/30 mr-3"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className="text-white font-medium">Watch our intro</p>
                    <p className="text-white/70 text-sm">See how we're transforming the industry</p>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-1/2 relative"
            >
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1583367371-5ad24d59f642?q=80&w=2670&auto=format&fit=crop"
                  alt="Modern Poultry Farm" 
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-red-200/30 to-blue-200/30 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="bg-gradient-to-r from-[#ea384c] to-[#d02f3d] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-3xl font-bold">5,000+</h3>
              <p className="text-white/80">Registered Farmers</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">₹50Cr+</h3>
              <p className="text-white/80">Financial Assistance</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">200+</h3>
              <p className="text-white/80">Industry Experts</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">25+</h3>
              <p className="text-white/80">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Complete Platform for Poultry Stakeholders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              22POULTRY provides an integrated suite of tools and services to support every aspect of your poultry business.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-gray-200 hover:shadow-md transition-shadow bg-white rounded-xl">
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Showcase Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">See 22POULTRY In Action</h2>
          
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-8">
              <img 
                src="https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?q=80&w=2574&auto=format&fit=crop"
                alt="Modern poultry farm" 
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1626263020748-235deef60aac?q=80&w=2574&auto=format&fit=crop"
                alt="Poultry care" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <img 
                src="https://images.unsplash.com/photo-1507434965515-61642818318c?q=80&w=2574&auto=format&fit=crop"
                alt="Healthy chickens" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-12 md:col-span-3">
              <div className="bg-[#ea384c] h-full rounded-lg shadow-md p-6 text-white flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-2">Data-Driven Decisions</h3>
                <p className="text-white/80">Access real-time market analytics to optimize your operations</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <img 
                src="https://images.unsplash.com/photo-1563599205636-efa4d3a3c1e2?q=80&w=2574&auto=format&fit=crop"
                alt="Farm technology" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <img 
                src="https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Poultry processing" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose 22POULTRY?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're building an ecosystem that serves all stakeholders in the poultry industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png"
                alt="Platform Features" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="rounded-full p-2 bg-green-100 text-green-600 mt-1">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data-Driven Decision Making</h3>
                  <p className="text-gray-600">Access real-time market data, price trends, and analytics to make informed business decisions.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="rounded-full p-2 bg-green-100 text-green-600 mt-1">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expand Your Network</h3>
                  <p className="text-gray-600">Connect with industry professionals, find partners, and grow your business through our networking platform.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="rounded-full p-2 bg-green-100 text-green-600 mt-1">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Access to Financial Support</h3>
                  <p className="text-gray-600">Discover and apply for loans, subsidies, and other financial products tailored for poultry businesses.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="rounded-full p-2 bg-green-100 text-green-600 mt-1">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
                  <p className="text-gray-600">Improve your skills and knowledge with our training resources and educational content.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from industry professionals who have transformed their businesses with 22POULTRY.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-gray-200 bg-white rounded-xl">
                  <CardContent className="p-6">
                    <div className="text-[#ea384c] mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="45" height="36" fill="currentColor" className="opacity-20">
                        <path d="M13.415.001C6.07 5.185.887 13.681.887 23.041c0 7.632 4.608 12.096 9.936 12.096 5.04 0 8.784-4.032 8.784-8.784 0-4.752-3.312-8.208-7.632-8.208-.864 0-2.016.144-2.304.288.72-4.896 5.328-10.656 9.936-13.536L13.415.001zm24.768 0c-7.2 5.184-12.384 13.68-12.384 23.04 0 7.632 4.608 12.096 9.936 12.096 4.896 0 8.784-4.032 8.784-8.784 0-4.752-3.456-8.208-7.776-8.208-.864 0-1.872.144-2.16.288.72-4.896 5.184-10.656 9.792-13.536L38.183.001z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ea384c] to-[#0066b2] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Poultry Business?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join the 22POULTRY community today and access all the tools, resources, and connections you need to succeed.
          </p>
          <Button 
            className="bg-white text-[#ea384c] hover:bg-gray-100 px-8 py-6 text-lg font-medium rounded-md"
            onClick={() => navigate('/auth', { state: { initialMode: 'signup' } })}
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <section id="contact" className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" 
                  alt="22POULTRY" 
                  className="h-10 w-auto" 
                />
                <span className="font-bold text-xl text-white">22POULTRY</span>
              </div>
              <p className="mb-6 max-w-md">
                22POULTRY is India's first integrated digital platform for the poultry industry, connecting stakeholders across the value chain.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#ea384c]" />
                  <span>the22poultry@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 mr-2 text-[#ea384c] flex justify-center">📞</div>
                  <span>+91 8329556730</span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 mr-2 text-[#ea384c] flex justify-center mt-1">📍</div>
                  <span>BTM Layout, 18th Main Road, 7th Cross Road, Bengaluru South, Karnataka 560076, IN</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-[#ea384c]">Features</a></li>
                <li><a href="#about" className="hover:text-[#ea384c]">About Us</a></li>
                <li><a href="#testimonials" className="hover:text-[#ea384c]">Testimonials</a></li>
                <li><a onClick={() => navigate('/contact')} className="hover:text-[#ea384c] cursor-pointer">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#ea384c]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#ea384c]">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#ea384c]">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center">
            <p>© {new Date().getFullYear()} 22POULTRY. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

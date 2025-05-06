
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, role, location, avatar, rating, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.1, duration: 0.6 }}
    className="bg-white p-8 rounded-xl shadow-lg relative"
  >
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-600">{role}, {location}</p>
      </div>
    </div>
    
    <Quote className="h-10 w-10 absolute top-8 right-8 text-[#ea384c]/10" />
    <p className="text-gray-700 mt-6 italic relative z-10">{quote}</p>
  </motion.div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "22POULTRY has transformed how I run my poultry business. The real-time market data helps me make better pricing decisions, and I've increased my profits by 23% in just 6 months.",
      name: "Rajesh Sharma",
      role: "Poultry Farmer",
      location: "Punjab",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 5
    },
    {
      quote: "The training resources and expert webinars have been invaluable for my farm. I've implemented several new techniques that have improved bird health and reduced mortality rates significantly.",
      name: "Lakshmi Patel",
      role: "Farm Owner",
      location: "Gujarat",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 5
    },
    {
      quote: "As a feed supplier, the marketplace feature has helped me connect with farmers across multiple states. My customer base has grown significantly since joining 22POULTRY.",
      name: "Venkat Reddy",
      role: "Feed Supplier",
      location: "Telangana",
      avatar: "https://i.pravatar.cc/150?img=52",
      rating: 4
    }
  ];
  
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 bg-gray-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 bg-green-100 rounded-full mb-4">
            <span className="text-green-600 text-sm font-medium">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied poultry farmers and businesses across India who are transforming their operations with 22POULTRY.
          </p>
        </motion.div>
        
        {/* Large circles background decoration */}
        <div className="absolute -left-64 -bottom-32 w-96 h-96 bg-[#ea384c]/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-64 top-32 w-96 h-96 bg-[#0FA0CE]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              location={testimonial.location}
              avatar={testimonial.avatar}
              rating={testimonial.rating}
              delay={index}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Join 10,000+ Poultry Professionals Across India</h3>
          <p className="mb-8 max-w-2xl mx-auto">
            Experience the benefits of India's first digital platform designed exclusively for the poultry industry.
            Get started today and transform your poultry business.
          </p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white text-[#ea384c] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Create Free Account
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  role: string;
  location: string;
  delay: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, name, role, location, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.1, duration: 0.6 }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <Quote className="h-10 w-10 mb-4 text-[#ea384c]/30" />
    <p className="text-gray-700 mb-6 italic">{quote}</p>
    <div>
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-sm text-gray-500">{role}, {location}</p>
    </div>
  </motion.div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "22POULTRY has transformed how I run my poultry business. The real-time market data helps me make better pricing decisions, and I've increased my profits by 23% in just 6 months.",
      name: "Rajesh Sharma",
      role: "Poultry Farmer",
      location: "Punjab"
    },
    {
      quote: "The training resources and expert webinars have been invaluable for my farm. I've implemented several new techniques that have improved bird health and reduced mortality rates.",
      name: "Lakshmi Patel",
      role: "Farm Owner",
      location: "Gujarat"
    },
    {
      quote: "As a feed supplier, the marketplace feature has helped me connect with farmers across multiple states. My customer base has grown significantly since joining 22POULTRY.",
      name: "Venkat Reddy",
      role: "Feed Supplier",
      location: "Telangana"
    }
  ];
  
  return (
    <section className="py-16 px-4 sm:px-6 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied poultry farmers and businesses across India who are transforming their operations with 22POULTRY.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              location={testimonial.location}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

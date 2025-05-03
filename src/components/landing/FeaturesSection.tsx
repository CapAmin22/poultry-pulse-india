
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Users, 
  Database, 
  BookOpen, 
  ShoppingCart, 
  TrendingUp
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.1, duration: 0.6 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300"
  >
    <div className="bg-[#ea384c]/10 p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-[#ea384c]" />,
      title: "Real-time Market Data",
      description: "Access up-to-date market prices across India to make informed business decisions."
    },
    {
      icon: <Users className="h-8 w-8 text-[#ea384c]" />,
      title: "Industry Networking",
      description: "Connect with other farmers, suppliers, and experts to expand your business network."
    },
    {
      icon: <Database className="h-8 w-8 text-[#ea384c]" />,
      title: "Financial Services",
      description: "Discover loans, subsidies, and investment opportunities tailored to poultry farming."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#ea384c]" />,
      title: "Training Resources",
      description: "Access expert guides, videos, and webinars to improve your poultry farming skills."
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-[#ea384c]" />,
      title: "Marketplace",
      description: "Buy and sell poultry products, equipment, and services in our dedicated marketplace."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-[#ea384c]" />,
      title: "Analytics & Reports",
      description: "Track your farm's performance with detailed analytics and customized reports."
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Features for Poultry Farmers</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            22POULTRY brings together everything you need to run a successful poultry business in one platform.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

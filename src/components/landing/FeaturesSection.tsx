
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Users, 
  Database, 
  BookOpen, 
  ShoppingCart, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  route: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color, route, delay }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className={`${color} p-3 rounded-lg mb-4 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-[#ea384c] transition-colors">{title}</h3>
      <p className="text-gray-600 mb-5">{description}</p>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(route)}
        className="text-[#ea384c] hover:text-[#ea384c] hover:bg-red-50 p-0 h-auto"
      >
        Learn more <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <BarChart2 className="h-8 w-8 text-white" />,
      title: "Real-time Market Data",
      description: "Access up-to-date market prices across India with interactive charts and trend analysis.",
      color: "bg-[#ea384c]",
      route: "/statistics"
    },
    {
      icon: <Database className="h-8 w-8 text-white" />,
      title: "Financial Services",
      description: "Discover loans, subsidies, and investment opportunities tailored specifically to poultry farming.",
      color: "bg-[#0FA0CE]",
      route: "/financial"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: "Training Resources",
      description: "Access expert guides, videos, and webinars from industry leaders to improve your farming skills.",
      color: "bg-green-500",
      route: "/training"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-white" />,
      title: "Marketplace",
      description: "Buy and sell poultry products, equipment, and services in our dedicated marketplace platform.",
      color: "bg-amber-500",
      route: "/marketplace"
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Industry Networking",
      description: "Connect with other farmers, suppliers, veterinarians, and experts to expand your network.",
      color: "bg-purple-500",
      route: "/network"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: "Analytics & Reports",
      description: "Generate detailed analytics and customized reports to track and improve your farm's performance.",
      color: "bg-indigo-500",
      route: "/dashboard"
    }
  ];
  
  return (
    <section id="features" className="py-20 px-4 sm:px-6 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 bg-[#ea384c]/10 rounded-full mb-4">
            <span className="text-[#ea384c] text-sm font-medium">Designed for Indian Poultry Farmers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">All-in-One Platform for Your Poultry Business</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            22POULTRY brings together everything you need to run a successful poultry business in one integrated platform. 
            Explore our powerful features designed specifically for the Indian poultry industry.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              route={feature.route}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Database, 
  BookOpen, 
  Newspaper, 
  Users, 
  ShoppingCart, 
  Home,
  X,
  HelpCircle,
  Phone,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  open: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setSidebarOpen }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigation: NavItem[] = [
    { name: 'Home', icon: <Home className="h-5 w-5" />, href: '/' },
    { name: 'Statistics', icon: <BarChart3 className="h-5 w-5" />, href: '/statistics' },
    { name: 'Financial Assistance', icon: <Database className="h-5 w-5" />, href: '/financial' },
    { name: 'Training & Education', icon: <BookOpen className="h-5 w-5" />, href: '/training' },
    { name: 'News & Weather', icon: <Newspaper className="h-5 w-5" />, href: '/news' },
    { name: 'Networking', icon: <Users className="h-5 w-5" />, href: '/network' },
    { name: 'Marketplace', icon: <ShoppingCart className="h-5 w-5" />, href: '/marketplace' },
    { name: 'Contact Us', icon: <Phone className="h-5 w-5" />, href: '/contact' },
  ];

  // Animation variants
  const sidebarVariants = {
    hidden: { x: -280 },
    visible: { x: 0 },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <motion.div 
      className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
            alt="22POULTRY" 
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
            22POULTRY
          </h1>
        </div>
        {isMobile && setSidebarOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        <motion.nav 
          className="mt-5 px-3 space-y-1"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => isMobile && setSidebarOpen && setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>
      
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex flex-col space-y-3">
          <Link to="/profile" onClick={() => isMobile && setSidebarOpen && setSidebarOpen(false)}>
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
              location.pathname === '/profile' 
                ? 'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white shadow-md' 
                : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
            }`}>
              <User className="h-5 w-5" />
              <span className="font-medium">My Profile</span>
            </div>
          </Link>
          
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-[#0FA0CE]" />
              <h3 className="font-medium text-sm text-gray-800">Need Help?</h3>
            </div>
            <p className="text-xs text-gray-600 mb-3">Contact our support team for any assistance with the platform.</p>
            <Link to="/contact" onClick={() => isMobile && setSidebarOpen && setSidebarOpen(false)}>
              <Button className="w-full text-xs bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:from-[#d52f41] hover:to-[#0d8fb7] text-white border-0">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

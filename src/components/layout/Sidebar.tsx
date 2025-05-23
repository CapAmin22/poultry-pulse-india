
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
  Phone,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  open: boolean;
  setSidebarOpen: (open: boolean) => void;
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

  const handleNavigate = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col ${isMobile ? 'shadow-xl' : ''}`}>
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
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(false)}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          {isMobile ? <X className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pt-5 px-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavigate}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 mb-1 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 22POULTRY</p>
          <p className="mt-1">Empowering poultry farmers</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

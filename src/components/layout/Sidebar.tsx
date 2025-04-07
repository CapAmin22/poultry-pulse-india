
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Database, 
  BookOpen, 
  Newspaper, 
  Users, 
  ShoppingCart, 
  Home 
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  current: boolean;
}

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const navigation: NavItem[] = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/', current: true },
    { name: 'Statistics', icon: <BarChart3 className="h-5 w-5" />, href: '/statistics', current: false },
    { name: 'Financial Assistance', icon: <Database className="h-5 w-5" />, href: '/financial', current: false },
    { name: 'Training & Education', icon: <BookOpen className="h-5 w-5" />, href: '/training', current: false },
    { name: 'News & Weather', icon: <Newspaper className="h-5 w-5" />, href: '/news', current: false },
    { name: 'Networking', icon: <Users className="h-5 w-5" />, href: '/network', current: false },
    { name: 'Marketplace', icon: <ShoppingCart className="h-5 w-5" />, href: '/marketplace', current: false },
  ];

  return (
    <div className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0`}>
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-poultry-primary">22POULTRY</h1>
      </div>
      <div className="mt-5 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`nav-link ${item.current ? 'active' : 'text-gray-700'}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-3 mt-10">
        <div className="p-4 bg-poultry-light rounded-lg border border-gray-200">
          <h3 className="font-medium text-sm text-poultry-primary">Need Help?</h3>
          <p className="text-xs mt-1 text-gray-600">Contact our support team for assistance.</p>
          <button className="mt-3 text-xs bg-poultry-primary text-white px-3 py-1 rounded w-full">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

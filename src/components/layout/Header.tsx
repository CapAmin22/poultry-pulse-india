
import React, { useState } from 'react';
import { Bell, Menu, User, Search, Settings, LogOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState(3);
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2 text-poultry-primary hover:bg-poultry-primary/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <motion.div 
            className="flex items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img 
              src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
              alt="22POULTRY" 
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
              22POULTRY
            </h1>
          </motion.div>
        </div>
        
        {!isMobile && (
          <div className="hidden md:flex max-w-md w-full px-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-8 w-full bg-gray-50 focus-visible:ring-poultry-primary"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-500 hover:text-[#ea384c] hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.1rem] h-[1.1rem] text-[0.65rem] font-medium bg-[#ea384c] text-white rounded-full">
                {notifications}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 rounded-full bg-gradient-to-br from-[#ea384c] to-[#0FA0CE] flex items-center justify-center text-white cursor-pointer shadow-md"
              >
                <User className="h-5 w-5" />
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Farmer</p>
                  <p className="text-xs leading-none text-muted-foreground">john.farmer@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact" className="flex cursor-pointer items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex cursor-pointer items-center text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;

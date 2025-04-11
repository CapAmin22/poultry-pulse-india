import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, MessageSquare, User, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New price update', message: 'Egg prices have been updated for your region', time: '10 min ago', read: false },
    { id: 2, title: 'Weather alert', message: 'Upcoming rainstorm may affect your farm area', time: '1 hour ago', read: false },
    { id: 3, title: 'New training material', message: 'Check out new training resources on disease prevention', time: '3 hours ago', read: false },
  ]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Support Team', message: 'How can we help you today?', time: '2 min ago', read: false },
    { id: 2, sender: 'Marketing', message: 'New marketplace opportunities available', time: '1 day ago', read: false },
  ]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of 22POULTRY.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An error occurred while signing out.",
      });
    }
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read.",
    });
  };

  const markAllMessagesAsRead = () => {
    setMessages(prevMessages => 
      prevMessages.map(message => ({ ...message, read: true }))
    );
    toast({
      title: "Messages cleared",
      description: "All messages have been marked as read.",
    });
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const unreadMessageCount = messages.filter(m => !m.read).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-2 text-gray-500 hover:text-[#ea384c]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png"
                alt="22POULTRY"
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-[#f5565c]">22POULTRY</span>
            </Link>

            <nav className="ml-8 hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'text-[#f5565c] bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <button onClick={toggleMobileMenu} className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-8 bg-gray-50 focus:bg-white"
              />
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#f5565c]">
                  {unreadNotificationCount}
                </Badge>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMessagesOpen(true)}
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessageCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#f5565c]">
                  {unreadMessageCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://i.pravatar.cc/150?u=johnfarmer" alt="User" />
                    <AvatarFallback className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] text-white">
                      {user ? getInitials(user.email || '') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="cursor-pointer flex w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} py-2 overflow-x-auto scrollbar-hide`}>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path)
                    ? 'text-[#f5565c] bg-red-50'
                    : 'text-gray-700 bg-gray-50'
                }`}
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Notifications</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllNotificationsAsRead}
                className="text-sm text-[#f5565c] hover:text-[#d22f42] hover:bg-red-50"
              >
                Clear All
              </Button>
            </DialogTitle>
            <DialogDescription>
              Stay updated with the latest information.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`py-3 px-1 ${notification.read ? 'opacity-70' : ''}`}>
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Messages</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllMessagesAsRead}
                className="text-sm text-[#f5565c] hover:text-[#d22f42] hover:bg-red-50"
              >
                Mark All Read
              </Button>
            </DialogTitle>
            <DialogDescription>
              Messages from our support team and partners.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {messages.map((message) => (
                  <div key={message.id} className={`py-3 px-1 ${message.read ? 'opacity-70' : ''}`}>
                    <div className="flex justify-between">
                      <h4 className="font-medium">{message.sender}</h4>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsMessagesOpen(false);
                navigate('/contact');
              }}
            >
              Contact Support
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;

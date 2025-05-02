import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, MessageSquare, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/contexts/SidebarContext';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { getNotifications, getMessages, markNotificationsAsRead, markMessagesAsRead } from '@/lib/api';
import NotificationsDialog from './navbar/NotificationsDialog';
import MessagesDialog from './navbar/MessagesDialog';
import UserMenu from './navbar/UserMenu';
import MobileMenu from './navbar/MobileMenu';
import { supabase } from '@/integrations/supabase/client';
const Navbar: React.FC = () => {
  const location = useLocation();
  const {
    user
  } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    toggleSidebar
  } = useSidebar();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications, setNotifications] = useState([{
    id: 1,
    title: 'New price update',
    message: 'Egg prices have been updated for your region',
    time: '10 min ago',
    read: false
  }, {
    id: 2,
    title: 'Weather alert',
    message: 'Upcoming rainstorm may affect your farm area',
    time: '1 hour ago',
    read: false
  }, {
    id: 3,
    title: 'New training material',
    message: 'Check out new training resources on disease prevention',
    time: '3 hours ago',
    read: false
  }]);
  const [messages, setMessages] = useState([{
    id: 1,
    sender: 'Support Team',
    message: 'How can we help you today?',
    time: '2 min ago',
    read: false
  }, {
    id: 2,
    sender: 'Marketing',
    message: 'New marketplace opportunities available',
    time: '1 day ago',
    read: false
  }]);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // Fetch user avatar
        const {
          data: {
            user: userData
          }
        } = await supabase.auth.getUser();
        if (userData && userData.user_metadata) {
          setUserAvatar(userData.user_metadata.avatar_url || null);
        }

        // Fetch notifications and messages
        // In a real app, these would come from the API
        const notificationsResponse = await getNotifications(user.id);
        if (notificationsResponse.success) {
          setNotifications(notificationsResponse.data);
        }
        const messagesResponse = await getMessages(user.id);
        if (messagesResponse.success) {
          setMessages(messagesResponse.data);
        }
      }
    };
    fetchUserData();
  }, [user]);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
      setShowMobileSearch(false);
    }
  }, [isMobile]);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowMobileSearch(false);
  }, [location.pathname]);
  const navItems = [{
    name: 'Home',
    path: '/'
  }];
  const markAllNotificationsAsRead = async () => {
    if (user) {
      const result = await markNotificationsAsRead(user.id);
      if (result.success) {
        setNotifications(prevNotifications => prevNotifications.map(notification => ({
          ...notification,
          read: true
        })));
      }
    }
  };
  const markAllMessagesAsRead = async () => {
    if (user) {
      const result = await markMessagesAsRead(user.id);
      if (result.success) {
        setMessages(prevMessages => prevMessages.map(message => ({
          ...message,
          read: true
        })));
      }
    }
  };
  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const unreadMessageCount = messages.filter(m => !m.read).length;
  return <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-gray-500 hover:text-[#ea384c]">
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="22POULTRY" className="h-8 w-auto" />
              <span className="font-bold text-xl text-[#f5565c]">22POULTRY</span>
            </Link>

            <nav className="ml-8 hidden md:flex space-x-1">
              {navItems.map(item => <Link key={item.path} to={item.path} className={`px-3 py-2 text-sm font-medium rounded-md ${location.pathname === item.path ? 'text-[#f5565c] bg-red-50' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {item.name}
                </Link>)}
            </nav>

            <button onClick={toggleMobileMenu} className="md:hidden ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <SearchBar />
              <SearchResults />
            </div>

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileSearch}>
              {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationsOpen(true)}>
              <Bell className="h-5 w-5" />
              {unreadNotificationCount > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#f5565c]">
                  {unreadNotificationCount}
                </Badge>}
            </Button>

            

            <UserMenu userAvatar={userAvatar || undefined} />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} navItems={navItems} onItemClick={() => setIsMobileMenuOpen(false)} />

        {/* Mobile Search */}
        <div className={`md:hidden ${showMobileSearch ? 'block' : 'hidden'} py-2`}>
          <div className="relative">
            <SearchBar isMobile={true} />
            <SearchResults />
          </div>
        </div>
      </div>

      {/* Notification Dialog */}
      <NotificationsDialog isOpen={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} notifications={notifications} onClearAll={markAllNotificationsAsRead} />

      {/* Messages Dialog */}
      <MessagesDialog isOpen={isMessagesOpen} onOpenChange={setIsMessagesOpen} messages={messages} onMarkAllRead={markAllMessagesAsRead} />
    </header>;
};
export default Navbar;
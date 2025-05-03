import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Mail, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationsDialog from './navbar/NotificationsDialog';
import MessagesDialog from './navbar/MessagesDialog';
import MobileMenu from './navbar/MobileMenu';
import { useAuth } from '@/hooks/use-auth';
import SearchBar from '../search/SearchBar';
import UserMenu from './navbar/UserMenu';
import { useSidebar } from '@/contexts/SidebarContext';
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const {
    sidebarOpen,
    toggleSidebar
  } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const handleSignIn = () => {
    navigate('/auth');
  };
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const toggleMessages = () => {
    setShowMessages(!showMessages);
  };

  // Only show the sidebar toggle button on authenticated pages (not landing page, auth, etc.)
  const showSidebarToggle = user && location.pathname !== '/' && location.pathname !== '/auth';
  return <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-200 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          {/* Hamburger Menu for Sidebar (Only shown when authenticated) */}
          {showSidebarToggle && <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-gray-600 hover:text-[#f5565c] hover:bg-transparent">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>}
          
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center">
            <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="22POULTRY" className="h-10 w-auto mr-2" />
            <span className="font-bold text-xl text-[#f5565c]">22POULTRY</span>
          </Link>
        </div>

        {/* Main Navigation - Desktop Only */}
        <nav className="hidden md:flex items-center space-x-1">
          {/* Navigation links will be added by sidebar for authenticated users */}
        </nav>

        {/* Right Side Navigation */}
        <div className="flex items-center">
          {/* Search */}
          <div className="hidden md:block mr-4">
            <SearchBar />
          </div>

          {/* Authenticated User Options */}
          {user ? <div className="flex items-center">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="mr-1 text-gray-600 hover:text-[#f5565c]" onClick={toggleNotifications}>
                <Bell className="h-5 w-5" />
                
              </Button>
              
              {/* User Menu */}
              <UserMenu user={user} onSignOut={handleSignOut} />
              
              {/* Mobile menu button */}
              <div className="md:hidden ml-2">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div> : <div className="flex items-center">
              <Button variant="outline" className="mr-2 border-[#f5565c] text-[#f5565c] hover:bg-[#f5565c] hover:text-white hidden md:block" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button className="bg-[#f5565c] hover:bg-[#d02f3d] text-white hidden md:block" onClick={() => navigate('/auth', {
            state: {
              initialMode: 'signup'
            }
          })}>
                Sign Up
              </Button>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>}
        </div>
      </div>

      {/* Mobile menu, dialogs */}
      {showMobileMenu && <MobileMenu isAuthenticated={!!user} onClose={toggleMobileMenu} onSignIn={handleSignIn} />}
      
      {/* Conditionally render dialogs */}
      {showNotifications && <NotificationsDialog open={showNotifications} onClose={toggleNotifications} />}
      {showMessages && <MessagesDialog open={showMessages} onClose={toggleMessages} />}
    </header>;
};
export default Navbar;
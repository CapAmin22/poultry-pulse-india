import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Mail, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import NotificationsDialog from './navbar/NotificationsDialog';
import MessagesDialog from './navbar/MessagesDialog';
import MobileMenu from './navbar/MobileMenu';
import { useAuth } from '@/hooks/use-auth';
import SearchBar from '../search/SearchBar';
import UserMenu from './navbar/UserMenu';
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
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
  return <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-200 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="container mx-auto flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/c2d12773-fb51-4928-bf1a-c30b2d1b60e8.png" alt="22POULTRY" className="h-10 w-auto mr-2" />
            <span className="font-bold text-xl text-[#f5565c]">22POULTRY</span>
          </Link>
        </div>

        {/* Main Navigation - Desktop Only */}
        <nav className="hidden md:flex items-center space-x-1">
          
          
          
          
          
          
          
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
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
              </Button>
              
              {/* Messages */}
              <Button variant="ghost" size="icon" className="mr-2 text-gray-600 hover:text-[#f5565c]" onClick={toggleMessages}>
                <Mail className="h-5 w-5" />
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
      
      {/* This is where the error was - the component renders conditionally */}
      {showNotifications && <NotificationsDialog open={showNotifications} onClose={toggleNotifications} />}
      {showMessages && <MessagesDialog open={showMessages} onClose={toggleMessages} />}
    </header>;
};
export default Navbar;
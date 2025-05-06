
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MarketplaceShowcase from '@/components/landing/MarketplaceShowcase';
import TrainingResourcesSection from '@/components/landing/TrainingResourcesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import CTASection from '@/components/landing/CTASection';
import FooterSection from '@/components/landing/FooterSection';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("User is already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Track scroll position to change header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navigation links
  const navigationLinks = [
    { name: "Features", href: "#features" },
    { name: "Marketplace", href: "#marketplace" },
    { name: "Training", href: "#training" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "/contact" }
  ];
  
  // Smooth scrolling for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
                alt="22POULTRY" 
                className="h-10 w-10 mr-2" 
              />
              <span className={`text-2xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent ${isScrolled ? 'drop-shadow-none' : 'drop-shadow-sm'}`}>
                22POULTRY
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-sm font-medium hover:text-[#ea384c] transition-colors ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            
            {/* Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/auth')}
                variant="ghost"
                className={`${isScrolled ? 'text-[#ea384c] hover:bg-red-50 hover:text-[#d02f3d]' : 'text-white hover:bg-white/20'}`}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth', { state: { initialMode: 'signup' } })}
                className="bg-[#ea384c] text-white hover:bg-[#d02f3d]"
              >
                Sign Up Free
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navigationLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block py-2 text-gray-700 hover:text-[#ea384c] font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth', { state: { initialMode: 'signup' } })}
                  className="w-full bg-[#ea384c] text-white hover:bg-[#d02f3d]"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Marketplace Showcase */}
        <MarketplaceShowcase />
        
        {/* Training Resources */}
        <TrainingResourcesSection />
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* Call to Action */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;

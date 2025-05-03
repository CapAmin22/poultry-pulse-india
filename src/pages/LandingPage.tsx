
import React, { useEffect } from 'react';
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

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      console.log("User is already authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
                alt="22POULTRY" 
                className="h-10 w-10 mr-2" 
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] bg-clip-text text-transparent">
                22POULTRY
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-[#ea384c]">Features</a>
              <a href="#marketplace" className="text-gray-700 hover:text-[#ea384c]">Marketplace</a>
              <a href="#training" className="text-gray-700 hover:text-[#ea384c]">Training</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#ea384c]">Testimonials</a>
              <a href="/contact" className="text-gray-700 hover:text-[#ea384c]">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/auth')}
                className="hidden md:block px-4 py-2 border border-[#ea384c] text-[#ea384c] rounded-md hover:bg-[#ea384c] hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/auth', { state: { initialMode: 'signup' } })}
                className="px-4 py-2 bg-[#ea384c] text-white rounded-md hover:bg-[#d02f3d] transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>
        
        {/* Marketplace Showcase */}
        <div id="marketplace">
          <MarketplaceShowcase />
        </div>
        
        {/* Training Resources */}
        <div id="training">
          <TrainingResourcesSection />
        </div>
        
        {/* Testimonials */}
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        
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

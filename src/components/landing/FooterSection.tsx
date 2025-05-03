
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, PhoneCall, Mail, MapPin } from 'lucide-react';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-5">
              <img 
                src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
                alt="22POULTRY" 
                className="h-10 w-10 mr-2" 
              />
              <span className="text-white text-2xl font-bold">22POULTRY</span>
            </Link>
            <p className="mb-4">
              India's first integrated digital platform designed exclusively for the poultry industry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/statistics" className="hover:text-white transition-colors">Statistics</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/financial" className="hover:text-white transition-colors">Financial Services</Link></li>
              <li><Link to="/training" className="hover:text-white transition-colors">Training Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/news" className="hover:text-white transition-colors">News & Updates</Link></li>
              <li><Link to="/network" className="hover:text-white transition-colors">Networking</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <PhoneCall className="h-5 w-5 mr-2 mt-0.5" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5" />
                <span>info@22poultry.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span>Delhi NCR, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center md:text-left md:flex md:justify-between md:items-center">
          <p>&copy; {new Date().getFullYear()} 22POULTRY. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Developed for Indian Poultry Farmers</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

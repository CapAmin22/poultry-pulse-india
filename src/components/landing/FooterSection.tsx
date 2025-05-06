
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, PhoneCall, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest industry news and updates straight to your inbox</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ea384c] text-white w-full sm:w-64"
                />
                <Button className="bg-[#ea384c] hover:bg-[#d02f3d] text-white">
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/c9a1b8a4-493d-4cb1-a1ea-8d2f8d5735a1.png" 
                alt="22POULTRY" 
                className="h-10 w-10 mr-2" 
              />
              <span className="text-white text-2xl font-bold">22POULTRY</span>
            </Link>
            <p className="mb-6 text-gray-400 max-w-md">
              India's first integrated digital platform designed exclusively for the poultry industry, 
              connecting farmers with market data, financial services, training resources, and a vibrant marketplace.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="hover:text-white hover:underline transition-colors">Dashboard</Link></li>
              <li><Link to="/statistics" className="hover:text-white hover:underline transition-colors">Statistics</Link></li>
              <li><Link to="/marketplace" className="hover:text-white hover:underline transition-colors">Marketplace</Link></li>
              <li><Link to="/financial" className="hover:text-white hover:underline transition-colors">Financial Services</Link></li>
              <li><Link to="/training" className="hover:text-white hover:underline transition-colors">Training Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/news" className="hover:text-white hover:underline transition-colors">News & Updates</Link></li>
              <li><Link to="/network" className="hover:text-white hover:underline transition-colors">Networking</Link></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <PhoneCall className="h-5 w-5 mr-3 mt-0.5 text-[#ea384c]" />
                <span>+91 8329556730</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-[#ea384c]" />
                <span>the22poultry@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-[#ea384c]" />
                <span>BTM Layout, 18th Main Road,<br />7th Cross Road, Bengaluru South,<br />Karnataka 560076, IN</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-gray-950">
        <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 text-sm text-center md:text-left md:flex md:justify-between md:items-center">
          <p>&copy; {new Date().getFullYear()} 22POULTRY. All rights reserved.</p>
          <div className="mt-3 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

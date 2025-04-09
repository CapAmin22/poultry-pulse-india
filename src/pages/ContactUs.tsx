
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AtSign, Building, CalendarDays, Mail, MapPin, Phone } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    enquiryType: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, enquiryType: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        enquiryType: ''
      });
    }, 1500);
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-gray-500 mt-2">Get in touch with our team for any questions or support</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="John Doe" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        placeholder="+91 98765 43210" 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enquiryType">Enquiry Type</Label>
                      <Select 
                        value={formData.enquiryType} 
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select enquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Enquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="business">Business Partnership</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="Brief subject of your enquiry" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Please provide details about your enquiry..." 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows={5} 
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#f5565c] to-[#0066b2]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div>
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us directly through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <Mail className="h-5 w-5 text-[#f5565c]" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@22poultry.com" className="text-[#f5565c] hover:underline">
                      info@22poultry.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <Phone className="h-5 w-5 text-[#f5565c]" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+911234567890" className="text-[#f5565c] hover:underline">
                      +91 12345 67890
                    </a>
                    <p className="text-sm text-gray-500">Mon-Fri 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <MapPin className="h-5 w-5 text-[#f5565c]" />
                  </div>
                  <div>
                    <p className="font-medium">Head Office</p>
                    <address className="not-italic text-gray-600">
                      22POULTRY Headquarters<br />
                      123, Main Street, Sector 42<br />
                      Gurgaon, Haryana 122001<br />
                      India
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <Building className="h-5 w-5 text-[#f5565c]" />
                  </div>
                  <div>
                    <p className="font-medium">Regional Offices</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>Mumbai, Maharashtra</li>
                      <li>Hyderabad, Telangana</li>
                      <li>Kolkata, West Bengal</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <CalendarDays className="h-5 w-5 text-[#f5565c]" />
                  </div>
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">Monday to Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-sm">For urgent inquiries, please contact our support hotline</p>
                  <a href="tel:+918005551234" className="text-lg font-semibold text-[#f5565c]">
                    +91 800 555 1234
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-10">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-80 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Interactive map will be implemented here</p>
                <p className="text-sm text-gray-400">(Google Maps or similar service integration)</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">How can I register for 22POULTRY?</h3>
              <p className="text-gray-600">Registration is simple! Click on the 'Sign Up' button in the top-right corner of our website and follow the steps to create your account.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is the platform available in multiple languages?</h3>
              <p className="text-gray-600">Currently, 22POULTRY is available in English, Hindi, and several other regional languages to serve poultry stakeholders across India.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How often is market data updated?</h3>
              <p className="text-gray-600">Our market prices and statistics are updated daily, usually by 11:30 AM for maximum relevance to your business decisions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I access 22POULTRY on mobile devices?</h3>
              <p className="text-gray-600">Yes! 22POULTRY is fully responsive and works on all devices. We also have dedicated mobile apps for both Android and iOS.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ContactUs;

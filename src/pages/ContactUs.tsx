
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { submitContactForm } from '@/lib/api';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [enquiryType, setEnquiryType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = { name, email, phone, subject, message, enquiryType };
      const result = await submitContactForm(formData);
      
      if (result.success) {
        toast({
          title: "Message sent successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
        setEnquiryType('general');
      } else {
        toast({
          variant: "destructive",
          title: "Error sending message",
          description: "There was a problem sending your message. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
      });
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: "What is 22POULTRY?",
      answer: "22POULTRY is India's first integrated digital platform for the poultry industry, connecting farmers, distributors, processors, retailers, and service providers across the value chain. We offer market insights, networking opportunities, training resources, and financial assistance tools."
    },
    {
      question: "Is 22POULTRY free to use?",
      answer: "Yes, basic features of 22POULTRY are free for all users. We may offer premium features or services in the future that could require a subscription."
    },
    {
      question: "How do I join the 22POULTRY network?",
      answer: "You can simply click on the 'Sign Up' button on our homepage and follow the registration process. After creating your account, you'll need to complete a brief onboarding process to personalize your experience."
    },
    {
      question: "Can I sell my products on 22POULTRY?",
      answer: "Yes, 22POULTRY includes a marketplace feature where you can list your products and services. This feature is available to all verified users."
    },
    {
      question: "How can I apply for financial assistance through 22POULTRY?",
      answer: "After registering and logging in, navigate to the 'Financial' section where you can explore various loan options and financial services. You can apply directly through our platform."
    },
    {
      question: "Do you offer training programs?",
      answer: "Yes, we provide access to various training materials, webinars, and educational resources through our 'Training & Education' section. Both users and experts can contribute content, which is reviewed for quality."
    },
    {
      question: "How is the market data collected?",
      answer: "Our market data comes from a variety of reliable sources, including government databases, partner organizations, and direct market surveys. We update our data regularly to ensure accuracy."
    }
  ];

  return (
    <Layout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-gray-500 mt-1">Reach out to us with your questions or feedback</p>
        </motion.div>
        
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="message">Send Message</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="rounded-full bg-red-100 p-3 mr-4">
                        <Mail className="h-6 w-6 text-[#ea384c]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">the22poultry@gmail.com</p>
                        <p className="text-sm text-gray-500 mt-1">For general inquiries and support</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="rounded-full bg-red-100 p-3 mr-4">
                        <Phone className="h-6 w-6 text-[#ea384c]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">+91 8329556730</p>
                        <p className="text-sm text-gray-500 mt-1">Monday to Friday, 9am to 6pm IST</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="rounded-full bg-red-100 p-3 mr-4">
                        <MapPin className="h-6 w-6 text-[#ea384c]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Office Address</h3>
                        <p className="text-gray-600">BTM Layout, 18th Main Road, 7th Cross Road</p>
                        <p className="text-gray-600">Bengaluru South, Karnataka 560076, IN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-md h-full">
                  <div className="p-8 h-full">
                    <h2 className="text-2xl font-semibold mb-6">Follow Us</h2>
                    <p className="text-gray-600 mb-8">Stay updated with our latest news and announcements by following us on social media.</p>
                    
                    <div className="flex space-x-4 mb-8">
                      <a href="#" className="rounded-full bg-blue-600 p-3 text-white hover:bg-blue-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                      <a href="#" className="rounded-full bg-sky-500 p-3 text-white hover:bg-sky-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </a>
                      <a href="#" className="rounded-full bg-pink-600 p-3 text-white hover:bg-pink-700 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                      <a href="#" className="rounded-full bg-blue-800 p-3 text-white hover:bg-blue-900 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                      </a>
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="font-medium mb-2">Business Hours</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li className="flex justify-between">
                          <span>Monday - Friday:</span>
                          <span>9:00 AM - 6:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Saturday:</span>
                          <span>10:00 AM - 4:00 PM</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sunday:</span>
                          <span>Closed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="message" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-6">
                    <MessageSquare className="h-6 w-6 text-[#ea384c]" />
                    <h2 className="text-2xl font-semibold">Send us a message</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="Your full name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Your email address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input 
                        id="phone" 
                        placeholder="Your phone number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-type">Enquiry Type</Label>
                      <Select 
                        value={enquiryType} 
                        onValueChange={setEnquiryType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type of enquiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Enquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="Message subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Your message..." 
                        className="h-32" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-[#ea384c] hover:bg-[#d02f3d]" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-8">
                    <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
                    
                    <Accordion type="single" collapsible className="w-full">
                      {faqItems.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">Still have questions?</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        If you couldn't find the answer to your question in our FAQ, please don't hesitate to contact us directly.
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
                        onClick={() => document.querySelector('[data-state="inactive"][data-value="message"]')?.click()}
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContactUs;

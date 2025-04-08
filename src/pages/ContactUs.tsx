
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Headphones,
  Users,
  FileQuestion,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    issueType: 'question',
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, issueType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        issueType: 'question',
      });
    }, 1500);
  };

  // Sample FAQ data
  const faqItems = [
    {
      question: "What is 22POULTRY?",
      answer: "22POULTRY is a comprehensive platform designed specifically for poultry farmers. It offers tools and resources for market analysis, financial assistance, training and education, weather updates, networking opportunities, and a marketplace for buying and selling poultry products and supplies."
    },
    {
      question: "How do I access financial assistance?",
      answer: "Navigate to the Financial Assistance tab in the sidebar. There, you'll find information about loans, grants, subsidies, and other financial programs available for poultry farmers. You can also apply for financial assistance directly through the platform."
    },
    {
      question: "Is my data secure on 22POULTRY?",
      answer: "Yes, we take data security very seriously. All user data is encrypted and stored securely. We do not share your personal information with third parties without your explicit consent. You can read more about our data security measures in our Privacy Policy."
    },
    {
      question: "How often is market data updated?",
      answer: "Market data is updated daily. Price trends, demand forecasts, and other market analytics are refreshed every 24 hours to ensure you have access to the most current information."
    },
    {
      question: "Can I sell my products through 22POULTRY?",
      answer: "Yes, the Marketplace feature allows farmers to list their poultry products for sale. You can create listings, set prices, and connect with potential buyers directly through the platform."
    },
    {
      question: "How do I report an issue with the platform?",
      answer: "You can report issues through the Contact Us page. Select 'Technical Issue' from the dropdown menu and provide details about the problem you're experiencing. Our technical team will address your concern as soon as possible."
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6 pb-8"
      >
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] inline-block bg-clip-text text-transparent">
            How Can We Help You?
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our support team is here to assist you with any questions or concerns you may have.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Us
            </TabsTrigger>
            <TabsTrigger value="faq">
              <FileQuestion className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="support">
              <Headphones className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>
          
          {/* Contact Form Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Your email address"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type of Issue</Label>
                      <RadioGroup value={formData.issueType} onValueChange={handleIssueTypeChange} className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="question" id="question" />
                          <Label htmlFor="question">General Question</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="technical" id="technical" />
                          <Label htmlFor="technical">Technical Issue</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="feedback" id="feedback" />
                          <Label htmlFor="feedback">Feedback</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your issue or question in detail"
                        rows={5}
                        required
                        className="resize-none"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full sm:w-auto bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                      disabled={submitting}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0FA0CE]/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-[#0FA0CE]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">+91 888 777 6666</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#ea384c]/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-[#ea384c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">support@22poultry.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#0FA0CE]/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-[#0FA0CE]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">123 Poultry Avenue</p>
                        <p className="text-sm">Bengaluru, Karnataka 560001</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#ea384c]/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[#ea384c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hours</p>
                        <p className="font-medium">Monday - Friday</p>
                        <p className="text-sm">9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Follow Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button variant="outline" size="icon">
                        <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Facebook</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg className="h-5 w-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                        <span className="sr-only">Twitter</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg className="h-5 w-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Instagram</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg className="h-5 w-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <svg className="h-5 w-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">YouTube</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about 22POULTRY.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <p className="text-sm text-gray-500">
                  Didn't find what you're looking for?
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('contact')}
                >
                  Contact Us
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Support Tab */}
          <TabsContent value="support">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0FA0CE]/10 mb-2">
                    <Headphones className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <CardTitle>Technical Support</CardTitle>
                  <CardDescription>
                    Get help with technical issues, bugs, or platform navigation problems.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Our technical team is available Monday to Friday, 9 AM to 6 PM IST.
                    Average response time: 4 hours.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                    onClick={() => {
                      setActiveTab('contact');
                      setFormData(prev => ({ ...prev, issueType: 'technical', subject: 'Technical Support Request' }));
                    }}
                  >
                    Request Support
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#ea384c]/10 mb-2">
                    <Users className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <CardTitle>Account Support</CardTitle>
                  <CardDescription>
                    Get assistance with your account, subscription, or billing inquiries.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Our account specialists can help you manage your subscription, update account information, or resolve billing issues.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                    onClick={() => {
                      setActiveTab('contact');
                      setFormData(prev => ({ ...prev, issueType: 'question', subject: 'Account Support Request' }));
                    }}
                  >
                    Get Support
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#0FA0CE]/10 mb-2">
                    <ThumbsUp className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <CardTitle>Feedback & Suggestions</CardTitle>
                  <CardDescription>
                    Share your ideas and feedback to help us improve 22POULTRY.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    We value your input! Let us know how we can make 22POULTRY better for you and the entire farming community.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                    onClick={() => {
                      setActiveTab('contact');
                      setFormData(prev => ({ ...prev, issueType: 'feedback', subject: 'Feedback & Suggestions' }));
                    }}
                  >
                    Share Feedback
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Need immediate assistance?</h3>
                    <p className="text-gray-600">Our support team is ready to help you.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                  <Button className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default ContactUs;

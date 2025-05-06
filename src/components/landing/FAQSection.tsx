
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What is 22POULTRY?",
      answer: "22POULTRY is India's first integrated digital platform designed exclusively for the poultry industry. We provide real-time market data, networking opportunities, financial services, training resources, and a marketplace for poultry farmers and related businesses."
    },
    {
      question: "Is 22POULTRY available across all of India?",
      answer: "Yes, 22POULTRY's services are available throughout India. Our market data covers all major poultry markets across different states, and our platform can be accessed from anywhere in India with internet connectivity."
    },
    {
      question: "How accurate is the market data?",
      answer: "Our market data is collected daily from trusted sources across major poultry markets. We update prices in real-time and verify information through multiple channels to ensure accuracy and reliability for our users."
    },
    {
      question: "How can I get financial assistance through 22POULTRY?",
      answer: "22POULTRY connects farmers with financial institutions offering specialized loans and subsidies for the poultry industry. Once registered, you can browse available financial services, apply directly through our platform, and track your application status in real-time."
    },
    {
      question: "How do I sell my products on the marketplace?",
      answer: "After creating an account and completing your profile, navigate to the Marketplace section and click on 'Sell a Product'. Fill out the product details, upload photos, set your price, and publish your listing. You'll be notified when buyers show interest in your products."
    },
    {
      question: "Are the training resources available in regional languages?",
      answer: "Yes, many of our training resources are available in multiple regional languages including Hindi, Tamil, Telugu, Bengali, Marathi, and Gujarati. We're continuously adding more content in different languages to serve farmers across India."
    }
  ];
  
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 bg-purple-100 rounded-full mb-4">
            <span className="text-purple-600 text-sm font-medium flex items-center justify-center">
              <HelpCircle className="h-4 w-4 mr-1" /> Frequently Asked
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Common Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about 22POULTRY and how it can benefit your poultry business.
          </p>
        </motion.div>
        
        <div className="bg-gray-50 rounded-2xl p-8 shadow-md">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <AccordionItem value={`item-${index}`} className="border-b border-gray-200 py-2">
                  <AccordionTrigger className="text-left font-medium text-lg hover:text-[#ea384c]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Contact our support team for assistance.
          </p>
          <a 
            href="/contact" 
            className="text-[#ea384c] font-medium hover:underline"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;

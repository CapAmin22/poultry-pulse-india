
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      question: "How can I get technical support?",
      answer: "You can reach our support team through the Contact Us page on our website, email us at support@22poultry.com, or call our helpline at +91-1234567890. Our support team is available Monday to Saturday, 9 AM to 6 PM."
    },
    {
      question: "Is there a mobile application available?",
      answer: "Yes, 22POULTRY is available as a mobile application for both Android and iOS devices. You can download it from the Google Play Store or Apple App Store to access our services on the go."
    },
    {
      question: "What type of training resources do you offer?",
      answer: "We provide a wide range of training resources including video tutorials, PDF guides, webinars, virtual workshops, and expert Q&A sessions covering various aspects of poultry farming such as bird health, farm management, feed formulation, and business strategies."
    }
  ];
  
  return (
    <section className="py-16 px-4 sm:px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about 22POULTRY and how it can benefit your business.
          </p>
        </motion.div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;

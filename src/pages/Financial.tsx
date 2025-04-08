
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, Building, Calendar, ChevronRight, Download, FileText, Info, Landmark, Link2, PiggyBank, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const financialSchemes = [
  {
    id: 1,
    title: "Poultry Venture Capital Fund",
    provider: "Ministry of Agriculture",
    description: "Financial assistance for setting up small poultry units and related activities",
    subsidy: "25% of the project cost",
    eligibility: "Small-scale poultry farmers with land",
    deadline: "December 15, 2025",
    status: "open"
  },
  {
    id: 2,
    title: "Rural Backyard Poultry Development",
    provider: "National Bank for Agriculture and Rural Development",
    description: "Support for rural poultry farming to improve livelihoods of BPL families",
    subsidy: "Up to ₹50,000 per beneficiary",
    eligibility: "BPL families in rural areas",
    deadline: "January 30, 2026",
    status: "open"
  },
  {
    id: 3,
    title: "Credit Linked Capital Subsidy",
    provider: "Small Farmers' Agri-Business Consortium",
    description: "Financial assistance for technology upgradation of poultry processing units",
    subsidy: "35% capital subsidy on eligible investments",
    eligibility: "Existing poultry processors",
    deadline: "November 10, 2025",
    status: "open"
  },
  {
    id: 4,
    title: "Integrated Development of Small Ruminants and Rabbits",
    provider: "Animal Husbandry Department",
    description: "Comprehensive support for integrated poultry farming with other livestock",
    subsidy: "50% of project cost for SC/ST and women beneficiaries",
    eligibility: "Small farmers with integrated farming approach",
    deadline: "October 5, 2025",
    status: "open"
  },
  {
    id: 5,
    title: "Entrepreneurship Development Scheme",
    provider: "Ministry of MSME",
    description: "Support for poultry entrepreneurs setting up new businesses",
    subsidy: "Up to ₹25 lakhs with 15-35% subsidy component",
    eligibility: "New entrepreneurs in poultry sector",
    deadline: "March 31, 2025",
    status: "closing_soon"
  },
];

const loanOffers = [
  {
    id: 1,
    title: "Poultry Business Loan",
    bank: "State Bank of India",
    interestRate: "7.50% p.a.",
    loanAmount: "₹5 lakhs to ₹50 lakhs",
    tenure: "Up to 7 years",
    features: "No collateral up to ₹10 lakhs, quick processing"
  },
  {
    id: 2,
    title: "Kisan Credit Card for Poultry",
    bank: "Punjab National Bank",
    interestRate: "7.00% p.a.",
    loanAmount: "Based on scale of operations",
    tenure: "Running account with annual renewal",
    features: "Interest subvention of 2% for timely repayment"
  },
  {
    id: 3,
    title: "Poultry Equipment Financing",
    bank: "HDFC Bank",
    interestRate: "8.25% p.a.",
    loanAmount: "Up to ₹1 crore",
    tenure: "Up to 5 years",
    features: "Equipment as collateral, flexible repayment options"
  },
  {
    id: 4,
    title: "Women Poultry Entrepreneur Loan",
    bank: "Bank of Baroda",
    interestRate: "6.85% p.a.",
    loanAmount: "₹2 lakhs to ₹20 lakhs",
    tenure: "Up to 7 years",
    features: "0.5% concession in interest rate for women entrepreneurs"
  }
];

const insuranceProducts = [
  {
    id: 1,
    title: "Comprehensive Poultry Insurance",
    provider: "Agriculture Insurance Company",
    coverage: "Disease, natural calamities, accidents",
    premium: "4% of sum insured annually",
    maxCover: "Up to ₹50 lakhs",
    features: "Covers both birds and infrastructure"
  },
  {
    id: 2,
    title: "Livestock Health Insurance",
    provider: "National Insurance",
    coverage: "Disease outbreaks, epidemics",
    premium: "3.5% of sum insured annually",
    maxCover: "Up to ₹25 lakhs",
    features: "24/7 veterinary helpline included"
  },
  {
    id: 3,
    title: "Weather-Based Poultry Insurance",
    provider: "ICICI Lombard",
    coverage: "Extreme weather conditions affecting poultry health",
    premium: "3% of sum insured annually",
    maxCover: "Up to ₹30 lakhs",
    features: "Automated payouts based on weather parameters"
  }
];

const Financial: React.FC = () => {
  const handleSchemeApply = (schemeId: number) => {
    toast({
      title: "Application Initiated",
      description: "You've started the application process for this scheme.",
    });
  };
  
  const handleDownloadForm = (schemeId: number) => {
    toast({
      title: "Download Started",
      description: "The application form is being downloaded to your device.",
    });
  };
  
  const handleLoanEnquiry = (loanId: number) => {
    toast({
      title: "Loan Enquiry Sent",
      description: "A representative will contact you shortly with more details.",
    });
  };
  
  const handleInsuranceEnquiry = (insuranceId: number) => {
    toast({
      title: "Insurance Enquiry Sent",
      description: "A representative will contact you shortly with more details.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Financial Assistance</h1>
          <p className="text-gray-500 mt-1">
            Explore government schemes, loans, and insurance for poultry farmers
          </p>
        </motion.div>
        
        <Tabs defaultValue="schemes" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-100">
            <TabsTrigger 
              value="schemes" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Landmark className="h-4 w-4 mr-2 hidden sm:block" />
              Government Schemes
            </TabsTrigger>
            <TabsTrigger 
              value="loans" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <Banknote className="h-4 w-4 mr-2 hidden sm:block" />
              Bank Loans
            </TabsTrigger>
            <TabsTrigger 
              value="insurance" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ea384c]"
            >
              <FileText className="h-4 w-4 mr-2 hidden sm:block" />
              Insurance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schemes" className="mt-6 space-y-6">
            <Card className="border-none shadow-md mb-6">
              <CardHeader className="pb-0">
                <div className="flex items-start">
                  <div className="p-2 mr-4 rounded-md bg-[#ea384c]/10">
                    <Landmark className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">Government Schemes</CardTitle>
                    <CardDescription>Financial support programs and subsidies for poultry farmers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4 text-sm bg-blue-50 p-3 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>
                    These schemes are designed to support poultry farmers with financial assistance, subsidies, and incentives. 
                    Eligibility criteria, application procedures, and benefits vary by scheme.
                  </span>
                </p>
                
                <div className="space-y-4 mt-6">
                  {financialSchemes.map((scheme) => (
                    <motion.div 
                      key={scheme.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{scheme.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building className="h-4 w-4 mr-1" /> {scheme.provider}
                              </CardDescription>
                            </div>
                            <Badge className={
                              scheme.status === 'open' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : scheme.status === 'closing_soon'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                            }>
                              {scheme.status === 'open' ? 'Open' : 
                               scheme.status === 'closing_soon' ? 'Closing Soon' : 'Closed'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Subsidy</p>
                              <p className="font-medium">{scheme.subsidy}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Eligibility</p>
                              <p className="font-medium">{scheme.eligibility}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Application Deadline</p>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <p className="font-medium">{scheme.deadline}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadForm(scheme.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Form
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                            size="sm"
                            onClick={() => handleSchemeApply(scheme.id)}
                          >
                            Apply Now
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4 pb-6">
                <Button variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  View All Schemes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="loans" className="mt-6 space-y-6">
            <Card className="border-none shadow-md mb-6">
              <CardHeader className="pb-0">
                <div className="flex items-start">
                  <div className="p-2 mr-4 rounded-md bg-[#0FA0CE]/10">
                    <Banknote className="h-6 w-6 text-[#0FA0CE]" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">Bank Loans</CardTitle>
                    <CardDescription>Credit facilities for poultry business development and expansion</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4 text-sm bg-blue-50 p-3 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>
                    These loan products are designed specifically for poultry farmers and businesses.
                    Actual interest rates and terms may vary based on your profile and creditworthiness.
                  </span>
                </p>
                
                <div className="space-y-4 mt-6">
                  {loanOffers.map((loan) => (
                    <motion.div 
                      key={loan.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{loan.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building className="h-4 w-4 mr-1" /> {loan.bank}
                              </CardDescription>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              {loan.interestRate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Loan Amount</p>
                              <p className="font-medium">{loan.loanAmount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Tenure</p>
                              <p className="font-medium">{loan.tenure}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Key Features</p>
                              <p className="font-medium">{loan.features}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-2">
                          <Button 
                            className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                            size="sm"
                            onClick={() => handleLoanEnquiry(loan.id)}
                          >
                            Check Eligibility
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4 pb-6">
                <Button variant="outline" className="gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Compare All Loans
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="insurance" className="mt-6 space-y-6">
            <Card className="border-none shadow-md mb-6">
              <CardHeader className="pb-0">
                <div className="flex items-start">
                  <div className="p-2 mr-4 rounded-md bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">Poultry Insurance</CardTitle>
                    <CardDescription>Protect your poultry business against risks and uncertainties</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4 text-sm bg-blue-50 p-3 rounded-md flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>
                    Insurance protects against disease outbreaks, natural disasters, and other risks to your poultry business.
                    Premiums may vary based on flock size, location, and risk assessment.
                  </span>
                </p>
                
                <div className="space-y-4 mt-6">
                  {insuranceProducts.map((insurance) => (
                    <motion.div 
                      key={insurance.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{insurance.title}</CardTitle>
                              <CardDescription className="flex items-center mt-1">
                                <Building className="h-4 w-4 mr-1" /> {insurance.provider}
                              </CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              {insurance.premium}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Coverage</p>
                              <p className="font-medium">{insurance.coverage}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Maximum Coverage</p>
                              <p className="font-medium">{insurance.maxCover}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Key Features</p>
                              <p className="font-medium">{insurance.features}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open('#', '_blank')}
                            className="gap-2"
                          >
                            <Link2 className="h-4 w-4" />
                            View Policy Details
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-[#ea384c] to-[#0FA0CE] hover:opacity-90"
                            size="sm"
                            onClick={() => handleInsuranceEnquiry(insurance.id)}
                          >
                            Get a Quote
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Financial;

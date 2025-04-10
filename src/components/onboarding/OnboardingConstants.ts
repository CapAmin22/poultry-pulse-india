
// Define stakeholder roles with icons and descriptions
export const STAKEHOLDER_ROLES = [
  { 
    id: 'farmer', 
    name: 'Poultry Farmer', 
    description: 'I manage poultry farming operations',
    icon: 'LandPlot' 
  },
  { 
    id: 'distributor', 
    name: 'Distributor', 
    description: 'I distribute poultry products to markets',
    icon: 'Briefcase' 
  },
  { 
    id: 'retailer', 
    name: 'Retailer', 
    description: 'I sell poultry products to consumers',
    icon: 'Building' 
  },
  { 
    id: 'processor', 
    name: 'Processor', 
    description: 'I process poultry into various products',
    icon: 'Beaker' 
  },
  { 
    id: 'supplier', 
    name: 'Feed/Equipment Supplier', 
    description: 'I supply feed and equipment to farmers',
    icon: 'Leaf' 
  },
  { 
    id: 'financial', 
    name: 'Financial Professional',
    description: 'I provide financial services to the poultry industry',
    icon: 'BarChart2' 
  },
  { 
    id: 'trainer', 
    name: 'Training Provider', 
    description: 'I provide training services to the poultry industry',
    icon: 'GraduationCap' 
  },
  { 
    id: 'organization', 
    name: 'Organization/Association', 
    description: 'I represent a poultry industry organization',
    icon: 'Users' 
  },
  { 
    id: 'other', 
    name: 'Other', 
    description: 'My role is not listed here',
    icon: 'Users' 
  }
];

// Define farm/business size options
export const BUSINESS_SIZES = [
  { id: 'micro', name: 'Micro (< 100 birds)' },
  { id: 'small', name: 'Small (100-500 birds)' },
  { id: 'medium', name: 'Medium (500-2000 birds)' },
  { id: 'large', name: 'Large (2000-10000 birds)' },
  { id: 'enterprise', name: 'Enterprise (10000+ birds)' },
  { id: 'na', name: 'Not Applicable' }
];

// Define poultry types
export const POULTRY_TYPES = [
  { id: 'broiler', name: 'Broiler Chickens' },
  { id: 'layer', name: 'Layer Chickens' },
  { id: 'ducks', name: 'Ducks' },
  { id: 'turkey', name: 'Turkeys' },
  { id: 'quail', name: 'Quails' },
  { id: 'mixed', name: 'Mixed Poultry' },
  { id: 'other', name: 'Other' },
  { id: 'na', name: 'Not Applicable' }
];

// Define experience levels
export const EXPERIENCE_LEVELS = [
  { id: 'novice', name: 'Novice (< 1 year)' },
  { id: 'beginner', name: 'Beginner (1-3 years)' },
  { id: 'intermediate', name: 'Intermediate (3-5 years)' },
  { id: 'experienced', name: 'Experienced (5-10 years)' },
  { id: 'expert', name: 'Expert (10+ years)' }
];

// Define farming systems
export const FARMING_SYSTEMS = [
  { id: 'intensive', name: 'Intensive (Battery Cage)' },
  { id: 'semi_intensive', name: 'Semi-Intensive' },
  { id: 'free_range', name: 'Free Range' },
  { id: 'backyard', name: 'Backyard' },
  { id: 'organic', name: 'Organic' },
  { id: 'mixed', name: 'Mixed System' },
  { id: 'na', name: 'Not Applicable' }
];

// Define financial service types
export const FINANCIAL_SERVICES = [
  { id: 'loans', name: 'Loans & Credit' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'investment', name: 'Investment' },
  { id: 'subsidy', name: 'Subsidy Programs' },
  { id: 'consulting', name: 'Financial Consulting' },
  { id: 'banking', name: 'Banking Services' },
  { id: 'other', name: 'Other Financial Services' }
];

// Define training specializations
export const TRAINING_SPECIALIZATIONS = [
  { id: 'husbandry', name: 'Poultry Husbandry' },
  { id: 'health', name: 'Poultry Health & Disease Management' },
  { id: 'nutrition', name: 'Nutrition & Feed Management' },
  { id: 'business', name: 'Business Management' },
  { id: 'marketing', name: 'Marketing & Sales' },
  { id: 'biosecurity', name: 'Biosecurity' },
  { id: 'technology', name: 'Technology & Automation' },
  { id: 'other', name: 'Other Specializations' }
];

// Define organization types
export const ORGANIZATION_TYPES = [
  { id: 'trade', name: 'Trade Association' },
  { id: 'cooperative', name: 'Cooperative' },
  { id: 'ngo', name: 'NGO' },
  { id: 'govt', name: 'Government Body' },
  { id: 'research', name: 'Research Institution' },
  { id: 'education', name: 'Educational Institution' },
  { id: 'other', name: 'Other Organization Type' }
];

// Define states in India for location selection
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
].sort();

// Define languages spoken in India
export const INDIAN_LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 
  'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Assamese', 
  'Odia', 'Urdu', 'Other'
];

// Define interests based on user role
export const getInterestsForRole = (role: string) => {
  const commonInterests = ['Market Prices', 'Technology', 'Sustainability', 'Networking'];
  
  const roleSpecificInterests: Record<string, string[]> = {
    'farmer': ['Disease Prevention', 'Feed Management', 'Breeding', 'Housing', 'Waste Management'],
    'distributor': ['Logistics', 'Cold Chain', 'Quality Control', 'Export Markets'],
    'retailer': ['Consumer Trends', 'Retail Display', 'Inventory Management', 'Packaging'],
    'processor': ['Processing Equipment', 'Food Safety', 'Product Development', 'Packaging'],
    'supplier': ['Product Innovation', 'Supply Chain', 'Quality Assurance'],
    'financial': ['Financing', 'Loans', 'Insurance', 'Investment', 'Risk Management'],
    'trainer': ['Training Methods', 'Curriculum Development', 'Certification'],
    'organization': ['Policy', 'Advocacy', 'Research', 'Industry Standards'],
    'other': ['Best Practices', 'Equipment', 'International Trade', 'Regulations']
  };
  
  return [...commonInterests, ...(roleSpecificInterests[role] || roleSpecificInterests['other'])];
};

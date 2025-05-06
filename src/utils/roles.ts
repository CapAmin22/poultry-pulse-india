
export const ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  FINANCIAL: 'financial',
  TRAINER: 'trainer',
  DISTRIBUTOR: 'distributor',
  SUPPLIER: 'supplier',
  PROCESSOR: 'processor',
  RETAILER: 'retailer',
  RESEARCHER: 'researcher',
  VETERINARIAN: 'veterinarian',
  OTHER: 'other',
};

export type RoleType = keyof typeof ROLES;

// Detailed role information for UI display
export const ROLE_DETAILS = {
  [ROLES.ADMIN]: {
    title: 'Super Administrator',
    description: 'Manage all aspects of the platform including users, content, and system settings',
    icon: 'shield',
    color: 'bg-purple-500',
    permissions: ['manage_users', 'manage_content', 'system_settings', 'view_analytics']
  },
  [ROLES.FARMER]: {
    title: 'Poultry Farmer',
    description: 'Raise and manage poultry for egg or meat production',
    icon: 'egg',
    color: 'bg-green-500',
    permissions: ['sell_products', 'view_market_data', 'access_training']
  },
  [ROLES.FINANCIAL]: {
    title: 'Financial Provider',
    description: 'Offer loans, subsidies, and financial services to the poultry industry',
    icon: 'banknote',
    color: 'bg-blue-500',
    permissions: ['list_financial_services', 'manage_applications', 'view_applicants']
  },
  [ROLES.TRAINER]: {
    title: 'Trainer/Educator',
    description: 'Provide training, workshops, and educational content for poultry professionals',
    icon: 'book-open',
    color: 'bg-amber-500',
    permissions: ['create_courses', 'schedule_webinars', 'upload_resources']
  },
  [ROLES.DISTRIBUTOR]: {
    title: 'Distributor',
    description: 'Distribute poultry products across the supply chain',
    icon: 'truck',
    color: 'bg-indigo-500',
    permissions: ['sell_products', 'manage_inventory', 'logistics_management']
  },
  [ROLES.SUPPLIER]: {
    title: 'Supplier',
    description: 'Supply feed, equipment, and other materials to poultry businesses',
    icon: 'package',
    color: 'bg-orange-500',
    permissions: ['sell_products', 'manage_inventory', 'view_market_data']
  },
  [ROLES.PROCESSOR]: {
    title: 'Processor',
    description: 'Process poultry into various consumer products',
    icon: 'scissors',
    color: 'bg-red-500',
    permissions: ['sell_products', 'manage_inventory', 'quality_control']
  },
  [ROLES.RETAILER]: {
    title: 'Retailer',
    description: 'Sell poultry products directly to consumers',
    icon: 'shopping-bag',
    color: 'bg-teal-500',
    permissions: ['sell_products', 'manage_inventory', 'view_market_data']
  },
  [ROLES.RESEARCHER]: {
    title: 'Researcher',
    description: 'Conduct research to improve poultry farming practices and products',
    icon: 'microscope',
    color: 'bg-cyan-500',
    permissions: ['access_research_data', 'publish_findings', 'collaborate']
  },
  [ROLES.VETERINARIAN]: {
    title: 'Veterinarian',
    description: 'Provide healthcare services for poultry',
    icon: 'heart-pulse',
    color: 'bg-pink-500',
    permissions: ['offer_services', 'health_advisory', 'prescribe_treatment']
  },
  [ROLES.OTHER]: {
    title: 'Other',
    description: 'Other professionals related to the poultry industry',
    icon: 'users',
    color: 'bg-gray-500',
    permissions: ['basic_access']
  }
};

export const canSellOnMarketplace = (role: string): boolean => {
  const sellerRoles = [
    ROLES.FARMER,
    ROLES.DISTRIBUTOR,
    ROLES.SUPPLIER,
    ROLES.RETAILER,
    ROLES.PROCESSOR
  ];
  return sellerRoles.includes(role);
};

export const isFinancialProvider = (role: string): boolean => {
  return role === ROLES.FINANCIAL;
};

export const isTrainer = (role: string): boolean => {
  return role === ROLES.TRAINER;
};

export const isHealthcareProvider = (role: string): boolean => {
  return role === ROLES.VETERINARIAN;
};

export const isAdmin = (role: string): boolean => {
  return role === ROLES.ADMIN;
};

export const getRoleDisplayName = (role: string): string => {
  return ROLE_DETAILS[role as RoleType]?.title || 'User';
};

export const getRoleDescription = (role: string): string => {
  return ROLE_DETAILS[role as RoleType]?.description || '';
};

export const getRoleColor = (role: string): string => {
  return ROLE_DETAILS[role as RoleType]?.color || 'bg-gray-500';
};

export const getRolePermissions = (role: string): string[] => {
  return ROLE_DETAILS[role as RoleType]?.permissions || ['basic_access'];
};

export const getMarketplaceRoles = (): string[] => {
  return [
    ROLES.FARMER,
    ROLES.DISTRIBUTOR,
    ROLES.SUPPLIER,
    ROLES.PROCESSOR,
    ROLES.RETAILER
  ];
};

export const getFinancialRoles = (): string[] => {
  return [ROLES.FINANCIAL];
};

export const getTrainingRoles = (): string[] => {
  return [ROLES.TRAINER, ROLES.RESEARCHER];
};

export const getHealthcareRoles = (): string[] => {
  return [ROLES.VETERINARIAN];
};

export const getAdministrativeRoles = (): string[] => {
  return [ROLES.ADMIN];
};


export const ROLES = {
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

export const getRoleDisplayName = (role: string): string => {
  const displayNames: Record<string, string> = {
    [ROLES.FARMER]: 'Poultry Farmer',
    [ROLES.FINANCIAL]: 'Financial Provider',
    [ROLES.TRAINER]: 'Trainer/Educator',
    [ROLES.DISTRIBUTOR]: 'Distributor',
    [ROLES.SUPPLIER]: 'Supplier',
    [ROLES.PROCESSOR]: 'Processor',
    [ROLES.RETAILER]: 'Retailer',
    [ROLES.RESEARCHER]: 'Researcher',
    [ROLES.VETERINARIAN]: 'Veterinarian',
    [ROLES.OTHER]: 'Other'
  };
  
  return displayNames[role] || 'User';
};

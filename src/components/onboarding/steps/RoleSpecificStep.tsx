
import React from 'react';
import { StepProps } from '../OnboardingTypes';
import FarmerStep from './role-specific/FarmerStep';
import FinancialStep from './role-specific/FinancialStep';
import TrainerStep from './role-specific/TrainerStep';
import OrganizationStep from './role-specific/OrganizationStep';
import BusinessStep from './role-specific/BusinessStep';
import ProcessorStep from './role-specific/ProcessorStep';
import OtherStep from './role-specific/OtherStep';

const RoleSpecificStep: React.FC<StepProps> = (props) => {
  const { onboardingData } = props;
  
  switch (onboardingData.role) {
    case 'farmer':
      return <FarmerStep {...props} />;
    case 'financial':
      return <FinancialStep {...props} />;
    case 'trainer':
      return <TrainerStep {...props} />;
    case 'organization':
      return <OrganizationStep {...props} />;
    case 'distributor':
    case 'retailer':
    case 'supplier':
      return <BusinessStep {...props} />;
    case 'processor':
      return <ProcessorStep {...props} />;
    default:
      return <OtherStep {...props} />;
  }
};

export default RoleSpecificStep;


import React from 'react';
import FinancialDashboard from '@/pages/FinancialDashboard';
import { FinancialProvider } from '@/contexts/FinancialContext';

const FinancialAssistance: React.FC = () => {
  return (
    <FinancialProvider>
      <FinancialDashboard />
    </FinancialProvider>
  );
};

export default FinancialAssistance;

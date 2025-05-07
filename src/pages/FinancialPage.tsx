
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/ui/page-header';
import FinancialAssistance from '@/components/modules/FinancialAssistance';

const FinancialPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { state: { from: '/financial' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5565c]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Financial Services" 
        description="Access financial resources, loans, subsidies, and support for your poultry business"
        className="mb-6" 
      />
      
      <FinancialAssistance />
    </div>
  );
};

export default FinancialPage;

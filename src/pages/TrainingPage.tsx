
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/ui/page-header';
import Training from '@/pages/Training';

const TrainingPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { state: { from: '/training' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0FA0CE]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect
  }

  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Training & Education" 
        description="Access educational resources, courses, and training for poultry farming"
        className="mb-6" 
      />
      
      <Training />
    </div>
  );
};

export default TrainingPage;

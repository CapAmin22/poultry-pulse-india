
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

interface UseRoleReturnType {
  role: string;
  isLoading: boolean;
  error: Error | null;
  canSellOnMarketplace: boolean;
  isFinancialProvider: boolean;
  isTrainer: boolean;
  isHealthcareProvider: boolean;
  displayName: string;
}

export const useRole = (): UseRoleReturnType => {
  const { user } = useAuth();
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        
        const userRole = userMetadata.role || '';
        setRole(userRole);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user role'));
        console.error('Error fetching user role:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRole();
  }, [user]);
  
  const canSellOnMarketplace = ['farmer', 'distributor', 'supplier', 'retailer', 'processor'].includes(role);
  const isFinancialProvider = role === 'financial';
  const isTrainer = role === 'trainer';
  const isHealthcareProvider = role === 'veterinarian';
  
  const displayName = (() => {
    const displayNames: Record<string, string> = {
      'farmer': 'Poultry Farmer',
      'financial': 'Financial Provider',
      'trainer': 'Trainer/Educator',
      'distributor': 'Distributor',
      'supplier': 'Supplier',
      'processor': 'Processor',
      'retailer': 'Retailer',
      'researcher': 'Researcher',
      'veterinarian': 'Veterinarian',
      'other': 'Other'
    };
    
    return displayNames[role] || 'User';
  })();
  
  return {
    role,
    isLoading,
    error,
    canSellOnMarketplace,
    isFinancialProvider,
    isTrainer,
    isHealthcareProvider,
    displayName
  };
};

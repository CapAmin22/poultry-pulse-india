import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { ROLES } from '@/utils/roles';

interface UseRoleReturnType {
  role: string;
  isLoading: boolean;
  error: Error | null;
  canSellOnMarketplace: boolean;
  isFinancialProvider: boolean;
  isTrainer: boolean;
  isHealthcareProvider: boolean;
  isAdmin: boolean;
  displayName: string;
}

export const useRole = (): UseRoleReturnType => {
  const { user, isAdmin: authIsAdmin } = useAuth();
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
        
        // If user is already identified as admin from auth context, use that
        if (authIsAdmin) {
          setRole(ROLES.ADMIN);
          setIsLoading(false);
          return;
        }
        
        const { data: { user: userData } } = await supabase.auth.getUser();
        const userMetadata = userData?.user_metadata || {};
        
        // Check if role is explicitly set as admin in metadata
        if (userMetadata.role === ROLES.ADMIN) {
          setRole(ROLES.ADMIN);
        } else {
          // Otherwise use regular role
          const userRole = userMetadata.role || '';
          setRole(userRole);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user role'));
        console.error('Error fetching user role:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserRole();
  }, [user, authIsAdmin]);
  
  const canSellOnMarketplace = ['farmer', 'distributor', 'supplier', 'retailer', 'processor'].includes(role);
  const isFinancialProvider = role === 'financial';
  const isTrainer = role === 'trainer';
  const isHealthcareProvider = role === 'veterinarian';
  const isAdmin = role === 'admin';
  
  const displayName = (() => {
    const displayNames: Record<string, string> = {
      'admin': 'Super Administrator',
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
    isAdmin,
    displayName
  };
};

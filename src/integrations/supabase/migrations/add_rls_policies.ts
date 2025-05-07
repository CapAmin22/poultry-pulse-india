
import { supabase } from '../client';

/**
 * A utility function to apply RLS policies to a table
 * Note: This should be run in an authenticated context with admin privileges
 * @param tableName The table to add RLS policies to
 */
export async function applyRlsPolicy(tableName: string) {
  try {
    const { error } = await supabase.rpc('apply_rls_policy', { table_name: tableName });
    if (error) throw error;
    console.log(`Successfully applied RLS policy to ${tableName}`);
    return true;
  } catch (error) {
    console.error(`Failed to apply RLS policy to ${tableName}:`, error);
    return false;
  }
}

/**
 * Apply RLS policies to all tables
 */
export async function applyAllRlsPolicies() {
  const tables = [
    'financial_services',
    'financial_transactions',
    'job_listings',
    'loan_applications',
    'marketplace_listings',
    'network_connections',
    'network_discussions',
    'network_events',
    'network_experts',
    'network_farmers',
    'profiles'
  ];
  
  for (const table of tables) {
    await applyRlsPolicy(table);
  }
  
  console.log('Finished applying RLS policies to all tables');
}

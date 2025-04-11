
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    // Test connection by querying the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count()')
      .single();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful:', { profiles: data });
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

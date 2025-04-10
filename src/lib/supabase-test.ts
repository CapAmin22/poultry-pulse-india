
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    // First test basic connection
    const { data: healthCheck, error: healthError } = await supabase.from('_health').select('*');
    
    if (healthError) {
      console.error('Supabase health check failed:', healthError.message);
      return false;
    }

    // Then test profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count()')
      .single();
    
    if (error) {
      console.error('Profiles table test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful:', { healthCheck, profiles: data });
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

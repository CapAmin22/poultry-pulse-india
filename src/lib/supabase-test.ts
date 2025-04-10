
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  try {
    // Test the connection by attempting to get the server timestamp
    const { data, error } = await supabase
      .from('profiles')
      .select('count()')
      .single();
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

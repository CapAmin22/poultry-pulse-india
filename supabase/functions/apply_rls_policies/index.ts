// Follow this setup guide to integrate the Supabase 
// https://firebase.google.com/docs/functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    
    // Execute the SQL to apply RLS policies
    // First check if the admin_functions table exists and has our policy script
    const { data: adminFunctionData, error: adminFunctionError } = await supabaseClient
      .from('admin_functions')
      .select('*')
      .eq('name', 'apply_rls_policies')
      .single();
      
    if (adminFunctionError && adminFunctionError.code !== 'PGRST116') {
      // If it's not a "no rows returned" error (PGRST116), throw it
      throw adminFunctionError;
    }
    
    let sqlScript = "";
    
    // If we have a stored SQL script, use it
    if (adminFunctionData) {
      sqlScript = adminFunctionData.sql_script;
      
      // Execute the SQL script stored in the admin_functions table
      const { error: sqlError } = await supabaseClient.rpc('execute_sql_script', {
        sql_script: sqlScript
      });
      
      if (sqlError) throw sqlError;
    } else {
      // Otherwise, apply default RLS policies
      await applyDefaultRlsPolicies(supabaseClient);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "RLS policies applied successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error applying RLS policies:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "An error occurred while applying RLS policies"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

async function applyDefaultRlsPolicies(supabase: any) {
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
    // First enable RLS on the table
    await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
    });
    
    // Basic policies for each table
    await supabase.rpc('execute_sql', {
      sql: `
        -- Delete existing policies first to avoid duplicates
        DROP POLICY IF EXISTS "${table}_select_policy" ON public.${table};
        DROP POLICY IF EXISTS "${table}_insert_policy" ON public.${table};
        DROP POLICY IF EXISTS "${table}_update_policy" ON public.${table};
        DROP POLICY IF EXISTS "${table}_delete_policy" ON public.${table};
        
        -- Create policies
        CREATE POLICY "${table}_select_policy" ON public.${table}
          FOR SELECT USING (auth.uid() = user_id);
          
        CREATE POLICY "${table}_insert_policy" ON public.${table}
          FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        CREATE POLICY "${table}_update_policy" ON public.${table}
          FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY "${table}_delete_policy" ON public.${table}
          FOR DELETE USING (auth.uid() = user_id);
      `
    });
  }
  
  // Special policies for certain tables that are publicly viewable
  const publicTables = [
    'marketplace_listings',
    'network_events', 
    'network_experts',
    'network_farmers',
    'job_listings'
  ];
  
  for (const table of publicTables) {
    await supabase.rpc('execute_sql', {
      sql: `
        DROP POLICY IF EXISTS "${table}_public_select_policy" ON public.${table};
        
        CREATE POLICY "${table}_public_select_policy" ON public.${table}
          FOR SELECT USING (true);
      `
    });
  }
  
  // Special policy for profiles to be viewable by everyone
  await supabase.rpc('execute_sql', {
    sql: `
      DROP POLICY IF EXISTS "profiles_public_select_policy" ON public.profiles;
      
      CREATE POLICY "profiles_public_select_policy" ON public.profiles
        FOR SELECT USING (true);
    `
  });
}

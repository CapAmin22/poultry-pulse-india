
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
    const { data, error } = await supabaseClient
      .from('admin_functions')
      .select('*')
      .eq('name', 'apply_rls_policies')
      .single();
      
    if (error) throw error;
    
    // Execute the SQL script stored in the admin_functions table
    const { error: sqlError } = await supabaseClient.rpc('execute_sql_script', {
      sql_script: data.sql_script
    });
    
    if (sqlError) throw sqlError;
    
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
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

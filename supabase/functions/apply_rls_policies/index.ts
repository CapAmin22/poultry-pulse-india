
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client with Service Role Key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseServiceRoleKey || !supabaseUrl) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get the JWT token from the request
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid token or unauthorized");
    }

    // Check if the user is an admin
    if (user.user_metadata?.role !== "admin") {
      throw new Error("Only admins can apply RLS policies");
    }

    // Tables that need RLS policies
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

    console.log("Applying RLS policies for tables:", tables);

    const results = [];
    
    // Apply RLS policies to all tables
    for (const table of tables) {
      try {
        // Enable RLS if not already enabled
        await supabaseAdmin.rpc('execute_sql_script', {
          sql_script: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
        });
        
        results.push({ table, status: 'success' });
        console.log(`RLS enabled for ${table}`);
      } catch (error) {
        console.error(`Error enabling RLS for ${table}:`, error);
        results.push({ table, status: 'error', message: error.message });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in apply_rls_policies function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        },
        status: 500 
      }
    );
  }
});


-- Create a table to store admin functions
CREATE TABLE IF NOT EXISTS public.admin_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sql_script TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the admin_functions table
ALTER TABLE public.admin_functions ENABLE ROW LEVEL SECURITY;

-- Create policy that only allows admins to access admin_functions
CREATE POLICY "Only admins can access admin functions" ON public.admin_functions
  USING (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() AND (user_metadata->>'role' = 'admin')
    )
  );

-- Create a secure function to execute SQL scripts (admin only)
CREATE OR REPLACE FUNCTION public.execute_sql_script(sql_script TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
DECLARE
  script_to_execute TEXT;
BEGIN
  -- Check if the user is an admin
  IF NOT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND (user_metadata->>'role' = 'admin')
  ) THEN
    RAISE EXCEPTION 'Only administrators can execute SQL scripts';
  END IF;
  
  -- If no script is provided, execute the RLS policies script
  IF sql_script IS NULL THEN
    SELECT af.sql_script INTO script_to_execute
    FROM public.admin_functions af
    WHERE af.name = 'apply_rls_policies';
  ELSE
    script_to_execute := sql_script;
  END IF;
  
  -- Execute the script
  EXECUTE script_to_execute;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Insert the RLS policies script
INSERT INTO public.admin_functions (name, description, sql_script)
VALUES (
  'apply_rls_policies',
  'Apply Row Level Security policies to all tables',
  $SQL$
-- Enable Row Level Security for all tables
ALTER TABLE IF EXISTS public.financial_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.network_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.network_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.network_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.network_farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent duplicates
DROP POLICY IF EXISTS "Financial services are viewable by everyone" ON public.financial_services;
DROP POLICY IF EXISTS "Users can insert their own financial services" ON public.financial_services;
DROP POLICY IF EXISTS "Users can update their own financial services" ON public.financial_services;
DROP POLICY IF EXISTS "Users can delete their own financial services" ON public.financial_services;

DROP POLICY IF EXISTS "Users can view their own financial transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can insert their own financial transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can update their own financial transactions" ON public.financial_transactions;
DROP POLICY IF EXISTS "Users can delete their own financial transactions" ON public.financial_transactions;

DROP POLICY IF EXISTS "Job listings are viewable by everyone" ON public.job_listings;
DROP POLICY IF EXISTS "Users can insert their own job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can update their own job listings" ON public.job_listings;
DROP POLICY IF EXISTS "Users can delete their own job listings" ON public.job_listings;

DROP POLICY IF EXISTS "Users can view their own loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Financial providers can view loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can insert their own loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Financial providers can update loan applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can delete their own loan applications" ON public.loan_applications;

DROP POLICY IF EXISTS "Marketplace listings are viewable by everyone" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can insert their own marketplace listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can update their own marketplace listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can delete their own marketplace listings" ON public.marketplace_listings;

DROP POLICY IF EXISTS "Users can view their own network connections" ON public.network_connections;
DROP POLICY IF EXISTS "Users can insert their own network connections" ON public.network_connections;
DROP POLICY IF EXISTS "Users can delete their own network connections" ON public.network_connections;

DROP POLICY IF EXISTS "Network discussions are viewable by everyone" ON public.network_discussions;
DROP POLICY IF EXISTS "Users can insert their own network discussions" ON public.network_discussions;
DROP POLICY IF EXISTS "Users can update their own network discussions" ON public.network_discussions;
DROP POLICY IF EXISTS "Users can delete their own network discussions" ON public.network_discussions;

DROP POLICY IF EXISTS "Network events are viewable by everyone" ON public.network_events;
DROP POLICY IF EXISTS "Users can insert network events" ON public.network_events;
DROP POLICY IF EXISTS "Users can update their own network events" ON public.network_events;
DROP POLICY IF EXISTS "Users can delete their own network events" ON public.network_events;

DROP POLICY IF EXISTS "Network experts are viewable by everyone" ON public.network_experts;
DROP POLICY IF EXISTS "Users can insert their own expert profile" ON public.network_experts;
DROP POLICY IF EXISTS "Users can update their own expert profile" ON public.network_experts;
DROP POLICY IF EXISTS "Users can delete their own expert profile" ON public.network_experts;

DROP POLICY IF EXISTS "Network farmers are viewable by everyone" ON public.network_farmers;
DROP POLICY IF EXISTS "Users can insert their own farmer profile" ON public.network_farmers;
DROP POLICY IF EXISTS "Users can update their own farmer profile" ON public.network_farmers;
DROP POLICY IF EXISTS "Users can delete their own farmer profile" ON public.network_farmers;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies for financial_services table
CREATE POLICY "Financial services are viewable by everyone" ON public.financial_services
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own financial services" ON public.financial_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial services" ON public.financial_services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial services" ON public.financial_services
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for financial_transactions table
CREATE POLICY "Users can view their own financial transactions" ON public.financial_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own financial transactions" ON public.financial_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own financial transactions" ON public.financial_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own financial transactions" ON public.financial_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for job_listings table
CREATE POLICY "Job listings are viewable by everyone" ON public.job_listings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own job listings" ON public.job_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job listings" ON public.job_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job listings" ON public.job_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for loan_applications table
CREATE POLICY "Users can view their own loan applications" ON public.loan_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Financial providers can view loan applications" ON public.loan_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() AND user_metadata->>'role' = 'financial'
    )
  );

CREATE POLICY "Users can insert their own loan applications" ON public.loan_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Financial providers can update loan applications" ON public.loan_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() AND user_metadata->>'role' = 'financial'
    )
  );

CREATE POLICY "Users can delete their own loan applications" ON public.loan_applications
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for marketplace_listings table
CREATE POLICY "Marketplace listings are viewable by everyone" ON public.marketplace_listings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own marketplace listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketplace listings" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketplace listings" ON public.marketplace_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_connections table
CREATE POLICY "Users can view their own network connections" ON public.network_connections
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

CREATE POLICY "Users can insert their own network connections" ON public.network_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own network connections" ON public.network_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_discussions table
CREATE POLICY "Network discussions are viewable by everyone" ON public.network_discussions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own network discussions" ON public.network_discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own network discussions" ON public.network_discussions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own network discussions" ON public.network_discussions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_events table
CREATE POLICY "Network events are viewable by everyone" ON public.network_events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert network events" ON public.network_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own network events" ON public.network_events
  FOR UPDATE USING (auth.uid()::text = organizer OR auth.uid() = updated_by);

CREATE POLICY "Users can delete their own network events" ON public.network_events
  FOR DELETE USING (auth.uid()::text = organizer);

-- Create policies for network_experts table
CREATE POLICY "Network experts are viewable by everyone" ON public.network_experts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own expert profile" ON public.network_experts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expert profile" ON public.network_experts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expert profile" ON public.network_experts
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_farmers table
CREATE POLICY "Network farmers are viewable by everyone" ON public.network_farmers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own farmer profile" ON public.network_farmers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer profile" ON public.network_farmers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farmer profile" ON public.network_farmers
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for profiles table
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
$SQL$
) 
ON CONFLICT (name) DO UPDATE 
SET sql_script = EXCLUDED.sql_script;

-- Create a function to apply RLS policy to a specific table
CREATE OR REPLACE FUNCTION public.apply_rls_policy(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
BEGIN
  -- Check if the user is an admin
  IF NOT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND (user_metadata->>'role' = 'admin')
  ) THEN
    RAISE EXCEPTION 'Only administrators can apply RLS policies';
  END IF;
  
  -- Enable RLS on the table
  EXECUTE format('ALTER TABLE IF EXISTS public.%I ENABLE ROW LEVEL SECURITY', table_name);
  
  -- Apply specific policies based on the table
  CASE table_name
    WHEN 'financial_services' THEN
      -- Drop existing policies
      EXECUTE $policy$
        DROP POLICY IF EXISTS "Financial services are viewable by everyone" ON public.financial_services;
        DROP POLICY IF EXISTS "Users can insert their own financial services" ON public.financial_services;
        DROP POLICY IF EXISTS "Users can update their own financial services" ON public.financial_services;
        DROP POLICY IF EXISTS "Users can delete their own financial services" ON public.financial_services;
        
        -- Create policies
        CREATE POLICY "Financial services are viewable by everyone" ON public.financial_services
          FOR SELECT USING (true);
        
        CREATE POLICY "Users can insert their own financial services" ON public.financial_services
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own financial services" ON public.financial_services
          FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own financial services" ON public.financial_services
          FOR DELETE USING (auth.uid() = user_id);
      $policy$;
      
    WHEN 'financial_transactions' THEN
      -- Apply financial_transactions policies
      EXECUTE $policy$
        DROP POLICY IF EXISTS "Users can view their own financial transactions" ON public.financial_transactions;
        DROP POLICY IF EXISTS "Users can insert their own financial transactions" ON public.financial_transactions;
        DROP POLICY IF EXISTS "Users can update their own financial transactions" ON public.financial_transactions;
        DROP POLICY IF EXISTS "Users can delete their own financial transactions" ON public.financial_transactions;
        
        CREATE POLICY "Users can view their own financial transactions" ON public.financial_transactions
          FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own financial transactions" ON public.financial_transactions
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own financial transactions" ON public.financial_transactions
          FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own financial transactions" ON public.financial_transactions
          FOR DELETE USING (auth.uid() = user_id);
      $policy$;
      
    -- Add more cases for other tables
    
    ELSE
      RAISE EXCEPTION 'Unsupported table: %', table_name;
  END CASE;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;


-- Create a function to apply RLS policy to a specific table
CREATE OR REPLACE FUNCTION public.apply_rls_policy(table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = ''
AS $$
DECLARE
  has_user_id BOOLEAN;
BEGIN
  -- Only admins can execute this function
  IF NOT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND user_metadata->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Permission denied: only admins can apply RLS policies';
  END IF;
  
  -- Check if the table has a user_id column
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = table_name
      AND column_name = 'user_id'
  ) INTO has_user_id;
  
  -- Enable RLS on the table
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  
  -- If the table has a user_id column, create standard RLS policies
  IF has_user_id THEN
    -- Drop existing policies first
    EXECUTE format('DROP POLICY IF EXISTS "%I_select_policy" ON public.%I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%I_insert_policy" ON public.%I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%I_update_policy" ON public.%I', table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS "%I_delete_policy" ON public.%I', table_name, table_name);
    
    -- Create new policies
    EXECUTE format('CREATE POLICY "%I_select_policy" ON public.%I FOR SELECT USING (auth.uid() = user_id)', table_name, table_name);
    EXECUTE format('CREATE POLICY "%I_insert_policy" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', table_name, table_name);
    EXECUTE format('CREATE POLICY "%I_update_policy" ON public.%I FOR UPDATE USING (auth.uid() = user_id)', table_name, table_name);
    EXECUTE format('CREATE POLICY "%I_delete_policy" ON public.%I FOR DELETE USING (auth.uid() = user_id)', table_name, table_name);
    
    -- Special policies for public viewable tables
    IF table_name IN ('marketplace_listings', 'network_events', 'network_experts', 'network_farmers', 'job_listings', 'profiles') THEN
      EXECUTE format('DROP POLICY IF EXISTS "%I_public_select_policy" ON public.%I', table_name, table_name);
      EXECUTE format('CREATE POLICY "%I_public_select_policy" ON public.%I FOR SELECT USING (true)', table_name, table_name);
    END IF;
  ELSE
    RAISE NOTICE 'Table % does not have a user_id column, applying generic RLS', table_name;
    -- Create admin-only policies for tables without user_id
    EXECUTE format('DROP POLICY IF EXISTS "%I_admin_policy" ON public.%I', table_name, table_name);
    EXECUTE format('CREATE POLICY "%I_admin_policy" ON public.%I FOR ALL USING (auth.jwt() ? ''is_admin'' AND (auth.jwt()->>''is_admin'')::boolean)', table_name, table_name);
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error applying RLS policy to %: %', table_name, SQLERRM;
    RETURN FALSE;
END;
$$;

-- Create a function to execute arbitrary SQL as admin
CREATE OR REPLACE FUNCTION public.execute_sql(sql TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = ''
AS $$
BEGIN
  -- Only admins can execute this function
  IF NOT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND user_metadata->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Permission denied: only admins can execute SQL';
  END IF;
  
  EXECUTE sql;
  RETURN TRUE;
END;
$$;

-- Insert the RLS policy script into admin_functions
INSERT INTO public.admin_functions (name, description, sql_script)
VALUES (
  'apply_rls_policies',
  'Applies RLS policies to all tables',
  '
-- Enable Row Level Security for all tables
ALTER TABLE public.financial_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for financial_services table
DROP POLICY IF EXISTS "Financial services are viewable by everyone" ON public.financial_services;
CREATE POLICY "Financial services are viewable by everyone" ON public.financial_services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own financial services" ON public.financial_services;
CREATE POLICY "Users can insert their own financial services" ON public.financial_services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own financial services" ON public.financial_services;
CREATE POLICY "Users can update their own financial services" ON public.financial_services
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own financial services" ON public.financial_services;
CREATE POLICY "Users can delete their own financial services" ON public.financial_services
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for financial_transactions table
DROP POLICY IF EXISTS "Users can view their own financial transactions" ON public.financial_transactions;
CREATE POLICY "Users can view their own financial transactions" ON public.financial_transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own financial transactions" ON public.financial_transactions;
CREATE POLICY "Users can insert their own financial transactions" ON public.financial_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own financial transactions" ON public.financial_transactions;
CREATE POLICY "Users can update their own financial transactions" ON public.financial_transactions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own financial transactions" ON public.financial_transactions;
CREATE POLICY "Users can delete their own financial transactions" ON public.financial_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for job_listings table
DROP POLICY IF EXISTS "Job listings are viewable by everyone" ON public.job_listings;
CREATE POLICY "Job listings are viewable by everyone" ON public.job_listings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own job listings" ON public.job_listings;
CREATE POLICY "Users can insert their own job listings" ON public.job_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own job listings" ON public.job_listings;
CREATE POLICY "Users can update their own job listings" ON public.job_listings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own job listings" ON public.job_listings;
CREATE POLICY "Users can delete their own job listings" ON public.job_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for loan_applications table
DROP POLICY IF EXISTS "Users can view their own loan applications" ON public.loan_applications;
CREATE POLICY "Users can view their own loan applications" ON public.loan_applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Financial providers can view loan applications" ON public.loan_applications;
CREATE POLICY "Financial providers can view loan applications" ON public.loan_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() AND user_metadata->>'role' = ''financial''
    )
  );

DROP POLICY IF EXISTS "Users can insert their own loan applications" ON public.loan_applications;
CREATE POLICY "Users can insert their own loan applications" ON public.loan_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Financial providers can update loan applications" ON public.loan_applications;
CREATE POLICY "Financial providers can update loan applications" ON public.loan_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 
      FROM auth.users 
      WHERE id = auth.uid() AND user_metadata->>'role' = ''financial''
    )
  );

DROP POLICY IF EXISTS "Users can delete their own loan applications" ON public.loan_applications;
CREATE POLICY "Users can delete their own loan applications" ON public.loan_applications
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for marketplace_listings table
DROP POLICY IF EXISTS "Marketplace listings are viewable by everyone" ON public.marketplace_listings;
CREATE POLICY "Marketplace listings are viewable by everyone" ON public.marketplace_listings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own marketplace listings" ON public.marketplace_listings;
CREATE POLICY "Users can insert their own marketplace listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own marketplace listings" ON public.marketplace_listings;
CREATE POLICY "Users can update their own marketplace listings" ON public.marketplace_listings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own marketplace listings" ON public.marketplace_listings;
CREATE POLICY "Users can delete their own marketplace listings" ON public.marketplace_listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_connections table
DROP POLICY IF EXISTS "Users can view their own network connections" ON public.network_connections;
CREATE POLICY "Users can view their own network connections" ON public.network_connections
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = connected_user_id);

DROP POLICY IF EXISTS "Users can insert their own network connections" ON public.network_connections;
CREATE POLICY "Users can insert their own network connections" ON public.network_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own network connections" ON public.network_connections;
CREATE POLICY "Users can delete their own network connections" ON public.network_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_discussions table
DROP POLICY IF EXISTS "Network discussions are viewable by everyone" ON public.network_discussions;
CREATE POLICY "Network discussions are viewable by everyone" ON public.network_discussions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own network discussions" ON public.network_discussions;
CREATE POLICY "Users can insert their own network discussions" ON public.network_discussions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own network discussions" ON public.network_discussions;
CREATE POLICY "Users can update their own network discussions" ON public.network_discussions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own network discussions" ON public.network_discussions;
CREATE POLICY "Users can delete their own network discussions" ON public.network_discussions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_events table
DROP POLICY IF EXISTS "Network events are viewable by everyone" ON public.network_events;
CREATE POLICY "Network events are viewable by everyone" ON public.network_events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert network events" ON public.network_events;
CREATE POLICY "Users can insert network events" ON public.network_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their own network events" ON public.network_events;
CREATE POLICY "Users can update their own network events" ON public.network_events
  FOR UPDATE USING (auth.uid()::text = organizer OR auth.uid() = updated_by);

DROP POLICY IF EXISTS "Users can delete their own network events" ON public.network_events;
CREATE POLICY "Users can delete their own network events" ON public.network_events
  FOR DELETE USING (auth.uid()::text = organizer);

-- Create policies for network_experts table
DROP POLICY IF EXISTS "Network experts are viewable by everyone" ON public.network_experts;
CREATE POLICY "Network experts are viewable by everyone" ON public.network_experts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own expert profile" ON public.network_experts;
CREATE POLICY "Users can insert their own expert profile" ON public.network_experts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expert profile" ON public.network_experts;
CREATE POLICY "Users can update their own expert profile" ON public.network_experts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expert profile" ON public.network_experts;
CREATE POLICY "Users can delete their own expert profile" ON public.network_experts
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for network_farmers table
DROP POLICY IF EXISTS "Network farmers are viewable by everyone" ON public.network_farmers;
CREATE POLICY "Network farmers are viewable by everyone" ON public.network_farmers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own farmer profile" ON public.network_farmers;
CREATE POLICY "Users can insert their own farmer profile" ON public.network_farmers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own farmer profile" ON public.network_farmers;
CREATE POLICY "Users can update their own farmer profile" ON public.network_farmers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own farmer profile" ON public.network_farmers;
CREATE POLICY "Users can delete their own farmer profile" ON public.network_farmers
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for profiles table
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to fix search_path issue
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ""
AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;
  '
) ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  sql_script = EXCLUDED.sql_script,
  updated_at = now();

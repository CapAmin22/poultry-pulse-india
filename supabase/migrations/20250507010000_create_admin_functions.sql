
-- Create an admin_functions table to store SQL scripts for administrative functions
CREATE TABLE IF NOT EXISTS public.admin_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sql_script TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to admin_functions
ALTER TABLE public.admin_functions ENABLE ROW LEVEL SECURITY;

-- Only allow admins to access the admin functions
CREATE POLICY "Only authenticated users with admin role can access admin functions" 
ON public.admin_functions
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND user_metadata->>'role' = 'admin'
  )
);

-- Create a function to execute arbitrary SQL with proper security checks
CREATE OR REPLACE FUNCTION execute_sql_script(sql_script TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
SET search_path = ''
AS $$
BEGIN
  -- Only admins can execute SQL scripts
  IF NOT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() AND user_metadata->>'role' = 'admin'
  ) THEN
    RAISE EXCEPTION 'Permission denied: only admins can execute SQL scripts';
  END IF;
  
  -- Execute the SQL script
  EXECUTE sql_script;
  
  RETURN TRUE;
END;
$$;

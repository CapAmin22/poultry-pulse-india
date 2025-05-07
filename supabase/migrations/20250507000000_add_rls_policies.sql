
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

-- Create function to fix search_path issue
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


-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policy to allow authenticated users to upload to avatars bucket
CREATE POLICY "Allow authenticated users to upload avatar" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars');

-- Set up policy to allow users to update their own avatars
CREATE POLICY "Allow users to update their own avatar" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Set up policy to allow public access to read avatars
CREATE POLICY "Allow public to read avatars" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

-- Ensure profiles table is properly created
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id BIGSERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            created_at TIMESTAMPTZ DEFAULT now(),
            username TEXT,
            bio TEXT
        );
        
        -- Add RLS policies for profiles
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view all profiles" 
            ON public.profiles FOR SELECT 
            USING (true);
            
        CREATE POLICY "Users can update own profile" 
            ON public.profiles FOR UPDATE 
            USING (auth.uid() = user_id);
            
        CREATE POLICY "Users can insert own profile" 
            ON public.profiles FOR INSERT 
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;

-- Make sure a user profile is created when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (new.id, new.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;

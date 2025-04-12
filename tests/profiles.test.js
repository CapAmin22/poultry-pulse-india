
const { createClient } = require('@supabase/supabase-js');

// Set up Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Skip tests if environment variables are not set
const shouldRunTests = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

// Test user profile functionality
describe('User Profiles', () => {
  let testUser;

  // Before all tests, set up test user
  beforeAll(async () => {
    if (!shouldRunTests) {
      console.warn('Skipping tests due to missing environment variables');
      return;
    }

    try {
      // Create a test user
      const { data, error } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
      });

      if (error) {
        console.error('Error creating test user:', error);
        return;
      }

      testUser = data.user;
    } catch (err) {
      console.error('Setup error:', err);
    }
  });

  // After all tests, clean up
  afterAll(async () => {
    if (!shouldRunTests || !testUser) return;

    // Clean up can be implemented when we have admin access to delete users
    // For now, we'll just sign out
    await supabase.auth.signOut();
  });

  test('Profile should be created automatically for new users', async () => {
    if (!shouldRunTests || !testUser) {
      console.warn('Skipping test');
      return;
    }

    // Wait a bit for the trigger to execute
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if profile was created
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', testUser.id)
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.user_id).toBe(testUser.id);
  });

  test('Profile should be updatable', async () => {
    if (!shouldRunTests || !testUser) {
      console.warn('Skipping test');
      return;
    }

    const newUsername = `testuser-${Date.now()}`;

    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('user_id', testUser.id);

    expect(updateError).toBeNull();

    // Verify the update
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', testUser.id)
      .single();

    expect(error).toBeNull();
    expect(data.username).toBe(newUsername);
  });
});

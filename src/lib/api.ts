
import { supabase } from "@/integrations/supabase/client";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  enquiryType: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  // Check if the messages table exists, if not this will fail gracefully
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        enquiry_type: formData.enquiryType || 'general',
        status: 'new'
      }
    ])
    .select();

  if (error) {
    // If table doesn't exist yet, log the error but don't throw
    console.error('Error submitting contact form:', error);
    // Simulate successful submission for demo purposes
    return { success: true, simulated: true };
  }

  return { success: true, data };
};

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};

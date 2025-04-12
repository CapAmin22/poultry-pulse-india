
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  enquiryType: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          username: formData.name,
          bio: `${formData.subject}: ${formData.message}`,
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting contact form:', error);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error.message || "There was a problem sending your message. Please try again.",
      });
      return { success: false, error };
    }

    toast({
      title: "Message sent successfully",
      description: "We'll get back to you soon!",
    });
    return { success: true, data };
  } catch (err) {
    console.error('Contact form submission error:', err);
    toast({
      variant: "destructive",
      title: "Error sending message",
      description: "An unexpected error occurred. Please try again.",
    });
    return { success: false, error: err };
  }
};

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    if (!file) {
      throw new Error('No file selected');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: { avatar_url: urlData.publicUrl }
    });

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    toast({
      variant: "destructive",
      title: "Upload failed",
      description: error.message || "There was a problem uploading your image. Please try again.",
    });
    return { success: false, error };
  }
};

export const getNotifications = async (userId: string) => {
  // This is a placeholder. In a real app, you would fetch notifications from the database.
  // For now, we'll return mock data
  return {
    success: true,
    data: [
      { id: 1, title: 'New price update', message: 'Egg prices have been updated for your region', time: '10 min ago', read: false },
      { id: 2, title: 'Weather alert', message: 'Upcoming rainstorm may affect your farm area', time: '1 hour ago', read: false },
      { id: 3, title: 'New training material', message: 'Check out new training resources on disease prevention', time: '3 hours ago', read: false },
    ]
  };
};

export const getMessages = async (userId: string) => {
  // This is a placeholder. In a real app, you would fetch messages from the database.
  // For now, we'll return mock data
  return {
    success: true,
    data: [
      { id: 1, sender: 'Support Team', message: 'How can we help you today?', time: '2 min ago', read: false },
      { id: 2, sender: 'Marketing', message: 'New marketplace opportunities available', time: '1 day ago', read: false },
    ]
  };
};

export const markNotificationsAsRead = async (userId: string, notificationIds?: number[]) => {
  // This is a placeholder. In a real app, you would update the database.
  return { success: true };
};

export const markMessagesAsRead = async (userId: string, messageIds?: number[]) => {
  // This is a placeholder. In a real app, you would update the database.
  return { success: true };
};

export const searchData = async (query: string) => {
  // This is a placeholder. In a real app, you would search across multiple tables.
  if (!query.trim()) return { success: true, data: [] };
  
  try {
    // Mock search results based on query
    const results = [
      { 
        id: 1, 
        title: 'Market Prices', 
        description: 'Current poultry market prices', 
        category: 'Statistics', 
        path: '/statistics' 
      },
      { 
        id: 2, 
        title: 'Disease Prevention', 
        description: 'Tips for preventing common poultry diseases', 
        category: 'Training', 
        path: '/training' 
      },
      { 
        id: 3, 
        title: 'Financial Assistance', 
        description: 'Available loans and grants for poultry farmers', 
        category: 'Financial', 
        path: '/financial' 
      },
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return { success: true, data: results };
  } catch (error) {
    console.error('Search error:', error);
    return { success: false, error };
  }
};

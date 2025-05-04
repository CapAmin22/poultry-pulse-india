
export interface Farmer {
  id?: string;
  user_id: string;
  name: string;
  location: string;
  farm_type: string;
  farm_size: string;
  expertise?: string[];
  experience?: string;
  contact_number?: string;
  image_url?: string;
  created_at?: string;
}

export interface Expert {
  id?: string;
  user_id: string;
  name: string;
  title: string;
  organization: string;
  expertise: string[];
  experience: string;
  location: string;
  image_url?: string;
  verified?: boolean;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  organizer?: string;
  contact?: string;
  category?: string;
  created_at?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  contact_email?: string;
  created_at?: string;
  job_type: string;
  industry?: string;
}

export interface NetworkPost {
  id: string;
  user_id: string;
  author_name: string;
  author_image?: string;
  content: string;
  image_url?: string;
  likes: number;
  comments: number;
  created_at: string;
}

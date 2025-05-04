export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financial_services: {
        Row: {
          category: string
          contact_number: string
          created_at: string
          description: string
          eligibility_criteria: string[] | null
          email: string
          id: string
          image_url: string | null
          interest_rate: string | null
          max_amount: string | null
          provider_name: string
          required_documents: string[] | null
          tags: string[] | null
          tenure: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          contact_number: string
          created_at?: string
          description: string
          eligibility_criteria?: string[] | null
          email: string
          id?: string
          image_url?: string | null
          interest_rate?: string | null
          max_amount?: string | null
          provider_name: string
          required_documents?: string[] | null
          tags?: string[] | null
          tenure?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          contact_number?: string
          created_at?: string
          description?: string
          eligibility_criteria?: string[] | null
          email?: string
          id?: string
          image_url?: string | null
          interest_rate?: string | null
          max_amount?: string | null
          provider_name?: string
          required_documents?: string[] | null
          tags?: string[] | null
          tenure?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          customer: string | null
          description: string
          id: string
          notes: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          customer?: string | null
          description: string
          id?: string
          notes?: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          customer?: string | null
          description?: string
          id?: string
          notes?: string | null
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company: string
          contact_email: string
          created_at: string
          description: string
          id: string
          industry: string | null
          job_type: string
          location: string
          requirements: string[]
          salary_range: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          contact_email: string
          created_at?: string
          description: string
          id?: string
          industry?: string | null
          job_type: string
          location: string
          requirements: string[]
          salary_range?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          contact_email?: string
          created_at?: string
          description?: string
          id?: string
          industry?: string | null
          job_type?: string
          location?: string
          requirements?: string[]
          salary_range?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          additional_info: string | null
          amount: number
          annual_revenue: number
          collateral: string
          contact_number: string | null
          created_at: string
          duration: string
          existing_loans: string | null
          farm_size: string
          farm_type: string
          id: string
          purpose: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_info?: string | null
          amount: number
          annual_revenue: number
          collateral: string
          contact_number?: string | null
          created_at?: string
          duration: string
          existing_loans?: string | null
          farm_size: string
          farm_type: string
          id?: string
          purpose: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_info?: string | null
          amount?: number
          annual_revenue?: number
          collateral?: string
          contact_number?: string | null
          created_at?: string
          duration?: string
          existing_loans?: string | null
          farm_size?: string
          farm_type?: string
          id?: string
          purpose?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          category: string
          condition: string | null
          contact_number: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string
          price: string
          quantity: string | null
          subcategory: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          condition?: string | null
          contact_number?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          price: string
          quantity?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          condition?: string | null
          contact_number?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          price?: string
          quantity?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      network_connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      network_discussions: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      network_events: {
        Row: {
          attendees_count: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          location: string
          organizer: string
          title: string
          type: string
          updated_by: string | null
        }
        Insert: {
          attendees_count?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location: string
          organizer: string
          title: string
          type: string
          updated_by?: string | null
        }
        Update: {
          attendees_count?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          organizer?: string
          title?: string
          type?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      network_experts: {
        Row: {
          created_at: string
          experience: string
          expertise: string[]
          id: string
          image_url: string | null
          name: string
          organization: string
          title: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          experience: string
          expertise: string[]
          id?: string
          image_url?: string | null
          name: string
          organization: string
          title: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          experience?: string
          expertise?: string[]
          id?: string
          image_url?: string | null
          name?: string
          organization?: string
          title?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      network_farmers: {
        Row: {
          contact_number: string | null
          created_at: string
          experience: string
          expertise: string[]
          farm_size: string
          farm_type: string
          id: string
          image_url: string | null
          location: string
          name: string
          user_id: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          experience: string
          expertise: string[]
          farm_size: string
          farm_type: string
          id?: string
          image_url?: string | null
          location: string
          name: string
          user_id: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          experience?: string
          expertise?: string[]
          farm_size?: string
          farm_type?: string
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: number
          user_id: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: never
          user_id?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: never
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

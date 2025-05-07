
export interface Transaction {
  id?: string;
  user_id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  transaction_date: string;
  created_at?: string;
  customer?: string;
  notes?: string;
}

export interface LoanApplication {
  id?: string;
  user_id: string;
  amount: number;
  purpose: string;
  duration: string;
  farm_type: string;
  farm_size: string;
  annual_revenue: number;
  collateral: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  created_at?: string;
  updated_at?: string;
  contact_number?: string;
  existing_loans?: string;
  additional_info?: string;
}

export interface FinancialService {
  id?: string;
  user_id: string;
  title: string;
  category: string;
  provider_name: string;
  interest_rate?: string;
  max_amount?: string;
  tenure?: string;
  description: string;
  contact_number: string;
  email: string;
  eligibility_criteria?: string[];
  required_documents?: string[];
  image_url?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

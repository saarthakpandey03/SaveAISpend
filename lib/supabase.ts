import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Audit {
  id: string;
  report_id: string;
  team_size: number;
  team_type: string;
  primary_use_case: string;
  tools: Record<string, unknown>;
  current_monthly_spend: number;
  optimized_monthly_spend: number;
  monthly_savings: number;
  annual_savings: number;
  savings_rate: number;
  summary: string;
  recommendations: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  created_at: string;
}

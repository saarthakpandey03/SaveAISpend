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
  timestamp?: string;
  overallConfidence?: string;
  totalTools?: number;
  toolsAlreadyOptimized?: number;
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

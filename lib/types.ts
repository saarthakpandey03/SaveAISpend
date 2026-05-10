/**
 * TYPE DEFINITIONS FOR STACKSPEND
 * 
 * Comprehensive type-safe definitions for the entire audit engine.
 * These types ensure that audit logic is consistent, readable, and maintainable.
 */

// ============================================================================
// TOOL & PLAN TYPES
// ============================================================================

export type ToolName =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "gemini"
  | "openai-api"
  | "anthropic-api"
  | "windsurf"
  | "v0";

export type CursorPlan = "hobby" | "pro" | "business" | "enterprise";
export type GitHubCopilotPlan = "individual" | "business" | "enterprise";
export type ClaudePlan = "free" | "pro" | "team" | "api-pay-as-you-go" | "api-enterprise";
export type ChatGPTPlan = "free" | "plus" | "team" | "enterprise" | "api-pay-as-you-go";
export type GeminiPlan = "free" | "pro" | "ultra" | "api-free" | "api-paid";
export type OpenAIAPIPlan = "pay-as-you-go" | "pay-as-you-go-gpt4-turbo";
export type AnthropicAPIPlan = "pay-as-you-go";
export type WindsurfPlan = "pro";
export type V0Plan = "free" | "pro";

export type ToolPlan =
  | CursorPlan
  | GitHubCopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | GeminiPlan
  | OpenAIAPIPlan
  | AnthropicAPIPlan
  | WindsurfPlan
  | V0Plan;

// ============================================================================
// TEAM PROFILE TYPES
// ============================================================================

export type TeamType = "solo" | "startup" | "agency" | "enterprise";
export type UseCase = "coding" | "writing" | "research" | "data" | "mixed";
export type PainPoint = "subscriptions" | "api" | "seats" | "unsure";

export interface TeamProfile {
  size: number; // Number of team members
  teamType: TeamType;
  useCase: UseCase;
  painPoint?: PainPoint;
}

// ============================================================================
// AUDIT INPUT TYPES
// ============================================================================

export interface ToolInput {
  toolId: ToolName;
  plan: ToolPlan;
  monthlySpend: number; // Current monthly spend
  seats: number; // Number of active seats
}

export interface AuditInput {
  id?: string; // Optional audit session ID
  teamProfile: TeamProfile;
  tools: ToolInput[];
  timestamp?: string;
}

// ============================================================================
// AUDIT RESULT TYPES
// ============================================================================

export type PricingDiscrepancy =
  | "above_retail"
  | "at_retail"
  | "below_retail"
  | "usage_based"
  | "custom_pricing"
  | "unknown";

export interface ToolRecommendation {
  toolId: ToolName;
  toolName: string;
  currentPlan: ToolPlan;
  /** Monthly spend the user reported (invoice / estimate) */
  userReportedMonthly: number;
  /** Monthly total at official public list price for selected plan × seats */
  officialRetailMonthly: number;
  pricingDiscrepancy: PricingDiscrepancy;
  /** User reported minus official retail (positive = paying above list) */
  reportingDeltaVsRetailMonthly: number;
  /** Monthly savings if paying list: retail minus optimized */
  savingsVsRetailMonthly: number;
  /** @deprecated use userReportedMonthly — kept for backwards compatibility */
  currentMonthlyCost: number;
  recommendedPlan: ToolPlan | null; // null if already optimized
  optimizedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  confidence: "high" | "moderate" | "low";
  reason: string;
  actions: string[]; // Specific action items
}

export interface FullAuditResult {
  auditId: string;
  timestamp: string;
  teamProfile: TeamProfile;
  
  // Financial summary
  currentMonthlySpend: number;
  /** Sum of official list-price totals for selected plans (per pricing-data) */
  retailBaselineMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  savingsRate: number; // 0-1, e.g., 0.15 = 15% savings
  /** Potential monthly savings vs list: retail baseline − optimized (floor at 0) */
  monthlySavingsVsRetailBaseline: number;
  
  // Recommendations
  recommendations: ToolRecommendation[];
  
  // Summary & analysis
  summary: string;
  overallConfidence: "high" | "moderate" | "low";
  optimizationState: "significant" | "moderate" | "minor" | "optimized";
  
  // Metadata
  totalTools: number;
  toolsWithSavings: number;
  toolsAlreadyOptimized: number;
}

// ============================================================================
// REPORT STORAGE TYPES
// ============================================================================

export interface StoredAuditReport {
  auditId: string;
  auditInput: AuditInput;
  auditResult: FullAuditResult;
  createdAt: string;
  expiresAt?: string;
  isPublic: boolean;
  publicViewCount?: number;
}

export interface ReportMetadata {
  auditId: string;
  createdAt: string;
  teamSize: number;
  teamType: TeamType;
  totalTools: number;
  annualSavings: number;
  isPublic: boolean;
}

// ============================================================================
// LEAD CAPTURE TYPES
// ============================================================================

export interface LeadCapture {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  capturedAt: string;
  auditId?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AuditError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "AuditError";
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Maybe<T> = T | null | undefined;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

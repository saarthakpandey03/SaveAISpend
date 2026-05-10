/**
 * AUDIT ENGINE
 * 
 * The core decision engine that generates audit recommendations.
 * All rules are defensible, based on typical team usage patterns.
 * 
 * RULES PHILOSOPHY:
 * - Conservative: Errors on the side of caution
 * - Evidence-based: Real usage patterns from industry benchmarks
 * - Transparent: Reasons are always provided
 * - Testable: Each rule can be validated independently
 */

import {
  AuditInput,
  FullAuditResult,
  PricingDiscrepancy,
  ToolRecommendation,
  ToolName,
  ToolPlan,
  TeamProfile,
} from "./types";
import {
  toolsPricing,
  getOfficialRetailMonthly,
  type OfficialRetailMode,
} from "./pricing-data";

const RETAIL_TOLERANCE_RATIO = 0.06;
const RETAIL_TOLERANCE_MIN = 1;

function classifyPricingDiscrepancy(
  userMonthly: number,
  retailTotalMonthly: number,
  mode: OfficialRetailMode
): PricingDiscrepancy {
  if (mode === "usage_based") return "usage_based";
  if (mode === "custom_pricing") return "custom_pricing";
  if (mode === "unknown") return "unknown";
  if (retailTotalMonthly <= 0) return "unknown";
  const tol = Math.max(RETAIL_TOLERANCE_MIN, retailTotalMonthly * RETAIL_TOLERANCE_RATIO);
  const d = userMonthly - retailTotalMonthly;
  if (Math.abs(d) <= tol) return "at_retail";
  if (d > tol) return "above_retail";
  return "below_retail";
}

type ToolRuleResult = {
  recommendedPlan: ToolPlan | null;
  optimizedSeats?: number;
  /** When list pricing does not apply (e.g. API vs subscription substitute) */
  optimizedMonthlyHint?: number;
  reason: string;
  actions: string[];
  confidence: "high" | "moderate" | "low";
};

// ============================================================================
// AUDIT ENGINE MAIN FUNCTION
// ============================================================================

/**
 * Generate a complete audit based on team profile and current tool usage.
 * 
 * This is the entry point for all audit logic.
 * It orchestrates individual tool analysis, calculates savings, and produces
 * a comprehensive report with recommendations.
 */
export function generateAudit(input: AuditInput): FullAuditResult {
  const auditId = input.id || generateAuditId();
  const timestamp = input.timestamp || new Date().toISOString();

  // Analyze each tool individually (every known tool keeps a row for UI + totals)
  const recommendations: ToolRecommendation[] = input.tools
    .map((tool) => analyzeToolUsage(tool, input.teamProfile))
    .filter((rec): rec is ToolRecommendation => rec !== null);

  const inputMonthlySpend = input.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const currentMonthlySpend = inputMonthlySpend;
  const optimizedFromRows = recommendations.reduce(
    (sum, rec) => sum + rec.optimizedMonthlyCost,
    0
  );
  const modeledToolIds = new Set(recommendations.map((r) => r.toolId));
  const orphanMonthlySpend = input.tools
    .filter((t) => !modeledToolIds.has(t.toolId))
    .reduce((sum, t) => sum + t.monthlySpend, 0);
  const optimizedMonthlySpend = optimizedFromRows + orphanMonthlySpend;
  const retailBaselineMonthlySpend = recommendations.reduce(
    (sum, r) => sum + r.officialRetailMonthly,
    0
  );
  const monthlySavingsVsRetailBaseline = Math.max(
    0,
    retailBaselineMonthlySpend - optimizedMonthlySpend
  );
  const monthlySavings = Math.max(0, currentMonthlySpend - optimizedMonthlySpend);
  const annualSavings = monthlySavings * 12;
  const savingsRate =
    currentMonthlySpend > 0 ? monthlySavings / currentMonthlySpend : 0;
  const savingsPercentage = Math.round(savingsRate * 100);

  // Determine optimization state and confidence
  const toolsWithSavings = recommendations.filter((r) => r.monthlySavings > 0).length;
  const toolsAlreadyOptimized = recommendations.length - toolsWithSavings;
  const optimizationState = getOptimizationState(savingsPercentage);
  const overallConfidence = getOverallConfidence(
    recommendations,
    input.teamProfile,
    savingsPercentage
  );

  // Generate summary
  const summary = generateAuditSummary(
    input.teamProfile,
    recommendations,
    savingsPercentage,
    optimizationState
  );

  return {
    auditId,
    timestamp,
    teamProfile: input.teamProfile,
    currentMonthlySpend,
    retailBaselineMonthlySpend,
    optimizedMonthlySpend,
    monthlySavings,
    annualSavings,
    savingsPercentage,
    savingsRate,
    monthlySavingsVsRetailBaseline,
    recommendations,
    summary,
    overallConfidence,
    optimizationState,
    totalTools: input.tools.length,
    toolsWithSavings,
    toolsAlreadyOptimized,
  };
}

// ============================================================================
// INDIVIDUAL TOOL ANALYSIS
// ============================================================================

/**
 * Analyze a single tool and determine optimization recommendation.
 * 
 * This function applies specific rules for each tool type.
 * Rules are based on typical team behavior and cost patterns.
 */
function analyzeToolUsage(
  tool: { toolId: ToolName; plan: ToolPlan; monthlySpend: number; seats: number },
  teamProfile: TeamProfile
): ToolRecommendation | null {
  const toolInfo = toolsPricing[tool.toolId];
  if (!toolInfo) return null;

  const toolName = toolInfo.name;
  const userReportedMonthly = tool.monthlySpend;

  const selectedRetail = getOfficialRetailMonthly(
    tool.toolId,
    String(tool.plan),
    tool.seats
  );
  const officialRetailMonthly = selectedRetail.totalMonthly;
  const pricingDiscrepancy = classifyPricingDiscrepancy(
    userReportedMonthly,
    officialRetailMonthly,
    selectedRetail.mode
  );
  const reportingDeltaVsRetailMonthly =
    userReportedMonthly - officialRetailMonthly;

  const recommendation = getToolRecommendation(
    tool.toolId,
    tool.plan as ToolPlan,
    tool.seats,
    teamProfile,
    userReportedMonthly
  );

  const augmentReason = (base: string) => {
    if (selectedRetail.mode !== "per_seat_list") return base;
    if (pricingDiscrepancy === "above_retail") {
      return `${base} Your reported spend is above standard public list pricing (~$${officialRetailMonthly}/mo for this plan × ${tool.seats} seat(s)). Check invoices, add-ons, or unused seats.`;
    }
    if (pricingDiscrepancy === "below_retail") {
      return `${base} Your reported spend is below public list pricing (~$${officialRetailMonthly}/mo)—you may have discounts or credits; optimization may hinge on usage.`;
    }
    return base;
  };

  if (!recommendation) {
    const savingsVsRetailMonthly = Math.max(
      0,
      officialRetailMonthly - userReportedMonthly
    );
    let reason = augmentReason(
      "No automatic plan change matched—compare your entry to public list pricing in /lib/pricing-data."
    );
    if (pricingDiscrepancy === "usage_based") {
      reason =
        "Usage-based/API billing has no single list total; benchmark against subscriptions and your actual usage.";
    }

    return {
      toolId: tool.toolId,
      toolName,
      currentPlan: tool.plan as ToolPlan,
      userReportedMonthly,
      officialRetailMonthly,
      pricingDiscrepancy,
      reportingDeltaVsRetailMonthly,
      savingsVsRetailMonthly,
      currentMonthlyCost: userReportedMonthly,
      recommendedPlan: null,
      optimizedMonthlyCost: userReportedMonthly,
      monthlySavings: 0,
      annualSavings: 0,
      savingsPercentage: 0,
      confidence: "low",
      reason,
      actions: ["Revisit after usage grows or vendors change pricing"],
    };
  }

  const {
    recommendedPlan,
    optimizedSeats,
    optimizedMonthlyHint,
    reason,
    actions,
    confidence,
  } = recommendation;

  let optimizedMonthlyCost: number;
  if (optimizedMonthlyHint != null) {
    optimizedMonthlyCost = optimizedMonthlyHint;
  } else {
    const optPlanStr = String(recommendedPlan ?? tool.plan);
    const seatsForOpt = optimizedSeats ?? tool.seats;
    const optRetail = getOfficialRetailMonthly(
      tool.toolId,
      optPlanStr,
      seatsForOpt
    );
    optimizedMonthlyCost = optRetail.totalMonthly;
    if (recommendedPlan === "free") {
      optimizedMonthlyCost = 0;
    }
  }

  const monthlySavings = Math.max(0, userReportedMonthly - optimizedMonthlyCost);
  const annualSavings = monthlySavings * 12;
  const userAnnual = userReportedMonthly * 12;
  const savingsPercentage =
    userAnnual > 0 ? Math.round((annualSavings / userAnnual) * 100) : 0;

  const savingsVsRetailMonthly = Math.max(
    0,
    officialRetailMonthly - optimizedMonthlyCost
  );

  return {
    toolId: tool.toolId,
    toolName,
    currentPlan: tool.plan as ToolPlan,
    userReportedMonthly,
    officialRetailMonthly,
    pricingDiscrepancy,
    reportingDeltaVsRetailMonthly,
    savingsVsRetailMonthly,
    currentMonthlyCost: userReportedMonthly,
    recommendedPlan,
    optimizedMonthlyCost,
    monthlySavings,
    annualSavings,
    savingsPercentage,
    confidence,
    reason: augmentReason(reason),
    actions,
  };
}

// ============================================================================
// TOOL-SPECIFIC RECOMMENDATION RULES
// ============================================================================

/**
 * Determine optimal plan for each tool based on team profile.
 * 
 * These are the core business rules. Each rule is defensible and
 * based on typical usage patterns or vendor pricing structures.
 */
function getToolRecommendation(
  toolId: ToolName,
  currentPlan: ToolPlan,
  seats: number,
  teamProfile: TeamProfile,
  userMonthlySpend: number
): ToolRuleResult | null {
  // CURSOR RULES
  if (toolId === "cursor") {
    if (teamProfile.size <= 5 && currentPlan === "business") {
      return {
        recommendedPlan: "pro",
        optimizedSeats: seats,
        reason: `Teams under 5 people rarely need Cursor Business (list $40/seat/mo). Pro (list $20/seat/mo) often suffices.`,
        actions: [
          "Downgrade to Pro plan at list pricing",
          `At public rates: save ~$${(40 - 20) * seats}/month vs Business × seats`,
          "Verify you don't need Business-only controls",
        ],
        confidence: "high",
      };
    }
    const expectedSeats = Math.ceil(teamProfile.size * 0.6);
    if (seats > expectedSeats) {
      return {
        recommendedPlan: currentPlan,
        optimizedSeats: expectedSeats,
        reason: `Your ${teamProfile.size}-person team likely has ~${expectedSeats} active Cursor users at typical adoption. Extra seats inflate spend vs list price × needed seats.`,
        actions: [
          `Reduce from ${seats} to ${expectedSeats} seats`,
          "Review usage in vendor analytics",
        ],
        confidence: "moderate",
      };
    }
  }

  if (toolId === "github-copilot") {
    if (teamProfile.size <= 3 && currentPlan === "business") {
      return {
        recommendedPlan: "individual",
        optimizedSeats: seats,
        reason: `Small groups rarely need Copilot Business (list $19/seat/mo). Individual (list $10/seat/mo) is often enough.`,
        actions: [
          "Switch to Individual at public list pricing",
          `Illustrative savings ~$${(19 - 10) * seats}/month at list rates`,
        ],
        confidence: "high",
      };
    }
    if (seats > teamProfile.size) {
      const targetSeats = Math.ceil(teamProfile.size * 0.65);
      return {
        recommendedPlan: currentPlan,
        optimizedSeats: targetSeats,
        reason: `${seats} seats for a ${teamProfile.size}-person team is often more than active usage.`,
        actions: [`Target ~${targetSeats} seats based on typical activation`],
        confidence: "moderate",
      };
    }
  }

  if (toolId === "claude") {
    if (teamProfile.size >= 5 && currentPlan === "pro" && seats >= 3) {
      return {
        recommendedPlan: "team",
        optimizedSeats: 1,
        reason: `Multiple Pro seats (list $20/seat) can exceed one Team workspace (list pricing in catalog)—compare totals vs your invoice.`,
        actions: [
          "Compare consolidated Team vs individual Pro at public rates",
          "Validate seat model against your Anthropic contract",
        ],
        confidence: "high",
      };
    }
  }

  if (toolId === "chatgpt") {
    if (teamProfile.size <= 2 && currentPlan === "team") {
      const plusSeats = Math.max(1, Math.min(teamProfile.size, seats));
      return {
        recommendedPlan: "plus",
        optimizedSeats: plusSeats,
        reason: `For very small teams, Team (list $30/seat/mo in our catalog) may exceed Plus (list $20/seat) needs.`,
        actions: [
          "Compare Plus vs Team using public list prices × seats you need",
          `If ${plusSeats} paid seat(s) suffice, Plus is often cheaper at list rates`,
        ],
        confidence: "high",
      };
    }
    if (teamProfile.size >= 8 && currentPlan === "plus" && seats >= 4) {
      return {
        recommendedPlan: "team",
        optimizedSeats: 1,
        reason: `Many individual Plus seats (list $20 each) can exceed a Team rollout—compare at list pricing for your org.`,
        actions: [
          "Model Team plan list price vs sum of Plus seats",
          "Confirm shared workspace fits governance needs",
        ],
        confidence: "high",
      };
    }
  }

  if (toolId === "gemini") {
    if (currentPlan === "pro" && teamProfile.size <= 2) {
      return {
        recommendedPlan: "free",
        optimizedSeats: 1,
        reason: `Small teams may run on Gemini Free and upgrade only when limits bite (list Pro is $20/seat in catalog).`,
        actions: ["Try Free tier", "Upgrade only when usage requires"],
        confidence: "moderate",
      };
    }
  }

  if (toolId === "openai-api" || toolId === "anthropic-api") {
    if (userMonthlySpend > 0 && userMonthlySpend < 40) {
      const cap = 20;
      return {
        recommendedPlan: null,
        optimizedMonthlyHint: Math.min(userMonthlySpend, cap),
        reason: `Your reported API spend ($${userMonthlySpend}/mo) is in a range where a ~$${cap}/mo subscription list price might beat light API usage—depends on tokens.`,
        actions: [
          "Compare last month’s API bill to ChatGPT Plus / Claude Pro list pricing",
          "Heavy API users may still prefer usage-based billing",
        ],
        confidence: "low",
      };
    }
  }

  return null;
}

// ============================================================================
// AUDIT SUMMARY GENERATION
// ============================================================================

/**
 * Generate a human-readable summary of the audit findings.
 */
function generateAuditSummary(
  teamProfile: TeamProfile,
  recommendations: ToolRecommendation[],
  savingsPercentage: number,
  optimizationState: string
): string {
  const aboveRetail = recommendations.filter(
    (r) => r.pricingDiscrepancy === "above_retail"
  );
  const belowRetail = recommendations.filter(
    (r) => r.pricingDiscrepancy === "below_retail"
  );

  if (optimizationState === "optimized" && aboveRetail.length === 0) {
    return `Your ${teamProfile.size}-person ${teamProfile.teamType} team: against public list prices in our catalog, reported spends look aligned with typical retail or lower. Few automated plan moves apply; we’ll flag new pricing changes as vendors update.`;
  }

  const toolsWithSavings = recommendations.filter((r) => r.monthlySavings > 0);

  const retailNote =
    aboveRetail.length > 0
      ? ` ${aboveRetail.length} line(s) show reported spend above standard public list pricing—investigate billing, add-ons, or seat counts.`
      : belowRetail.length > 0
        ? ` Some lines are below public list pricing (discounts/credits possible)—savings vs list may be limited until usage is validated.`
        : "";

  if (savingsPercentage >= 30) {
    return `Against vendor list pricing in our dataset, your ${teamProfile.size}-person team could reduce reported spend by ~${savingsPercentage}% before optimization. Hot spots: ${toolsWithSavings
      .slice(0, 2)
      .map((r) => r.toolName)
      .join(", ")}. ${retailNote.trim()}`;
  }

  if (savingsPercentage >= 15) {
    return `Moderate upside: ~${savingsPercentage}% vs your stated bills, using public plan prices as the benchmark. Review: ${toolsWithSavings
      .slice(0, 2)
      .map((r) => `${r.toolName} (${r.savingsPercentage}%)`)
      .join(", ")}.${retailNote}`;
  }

  return `We compared your entries to current public list prices (see methodology), then applied plan/seat rules. Indicated savings are ~${savingsPercentage}% of your reported spend; validate invoices and usage.${retailNote}`;
}

// ============================================================================
// OPTIMIZATION STATE DETERMINATION
// ============================================================================

function getOptimizationState(
  savingsPercentage: number
): "significant" | "moderate" | "minor" | "optimized" {
  if (savingsPercentage >= 30) return "significant";
  if (savingsPercentage >= 15) return "moderate";
  if (savingsPercentage > 0) return "minor";
  return "optimized";
}

// ============================================================================
// CONFIDENCE SCORING
// ============================================================================

/**
 * Determine overall confidence in the audit recommendations.
 */
function getOverallConfidence(
  recommendations: ToolRecommendation[],
  teamProfile: TeamProfile,
  savingsPercentage: number
): "high" | "moderate" | "low" {
  if (recommendations.length === 0) {
    return "low";
  }

  // High confidence if:
  // - Most recommendations are high confidence
  // - Team profile is clear
  // - Savings are significant

  const highConfidenceCount = recommendations.filter((r) => r.confidence === "high")
    .length;
  const highConfidenceRatio =
    recommendations.length > 0 ? highConfidenceCount / recommendations.length : 0;

  if (highConfidenceRatio >= 0.7 && savingsPercentage >= 15) {
    return "high";
  }

  if (savingsPercentage < 5) {
    return "low"; // Low confidence when minimal savings
  }

  return "moderate";
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a unique audit ID
 */
export function generateAuditId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `audit-${timestamp}-${random}`;
}

/**
 * Validate audit input before processing
 */
export function validateAuditInput(input: AuditInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.teamProfile || input.teamProfile.size < 1) {
    errors.push("Team size must be at least 1");
  }

  if (!input.tools || input.tools.length === 0) {
    errors.push("At least one tool must be specified");
  }

  if (input.tools.some((t) => t.seats < 1)) {
    errors.push("All tools must have at least 1 seat");
  }

  if (input.tools.some((t) => t.monthlySpend < 0)) {
    errors.push("Monthly spend cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

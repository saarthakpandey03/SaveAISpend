/**
 * Maps engine-native recommendations into legacy AuditResult rows used by ResultsDisplay.
 */

import type { AuditResult } from "@/lib/audit-data";
import type { ToolRecommendation } from "@/lib/types";

export function toolRecommendationsToAuditResults(
  recs: ToolRecommendation[]
): AuditResult[] {
  return recs.map((r) => ({
    toolId: r.toolId,
    toolName: r.toolName,
    currentCost: r.currentMonthlyCost * 12,
    estimatedSavings: r.annualSavings,
    savingsPercentage: r.savingsPercentage,
    recommendations: r.actions?.length ? r.actions : [r.reason],
  }));
}

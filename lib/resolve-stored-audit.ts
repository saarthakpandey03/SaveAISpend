/**
 * Resolves the latest audit from localStorage for results views.
 * Prefer keyed report storage; fall back to embedded snapshot on auditData.
 */

import { aiTools, type ToolEntry, type AuditResult } from "@/lib/audit-data";
import { generateAudit } from "@/lib/audit-engine";
import type { FullAuditResult, TeamProfile, ToolInput } from "@/lib/types";
import { loadAuditResult } from "@/lib/report-storage";
import { toolRecommendationsToAuditResults } from "@/lib/map-audit-display";

export type ResolvedStoredAudit = {
  full: FullAuditResult;
  tools: ToolEntry[];
  displayResults: AuditResult[];
};

function isFullAuditResult(value: unknown): value is FullAuditResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<FullAuditResult>;
  return (
    typeof v.auditId === "string" &&
    Array.isArray(v.recommendations) &&
    v.teamProfile != null &&
    typeof v.currentMonthlySpend === "number" &&
    typeof v.annualSavings === "number"
  );
}

export function resolveLatestAuditFromStorage(): ResolvedStoredAudit | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auditData");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      auditId?: string;
      auditResult?: unknown;
      tools?: ToolEntry[];
    };

    let full: FullAuditResult | null = null;

    if (parsed.auditId) {
      full = loadAuditResult(parsed.auditId);
    }

    if (!full && isFullAuditResult(parsed.auditResult)) {
      full = parsed.auditResult;
    }

    if (!full) return null;

    const tools = Array.isArray(parsed.tools) ? parsed.tools : [];

    if (
      typeof full.retailBaselineMonthlySpend !== "number" &&
      tools.length > 0 &&
      (parsed as { teamProfile?: TeamProfile }).teamProfile
    ) {
      try {
        full = generateAudit({
          id: full.auditId,
          teamProfile: (parsed as { teamProfile: TeamProfile }).teamProfile,
          tools: tools as ToolInput[],
          timestamp: full.timestamp,
        });
      } catch {
        /* keep loaded snapshot */
      }
    }

    let displayResults = toolRecommendationsToAuditResults(full.recommendations);

    if (displayResults.length === 0 && tools.length > 0) {
      displayResults = tools.map((t) => ({
        toolId: t.toolId,
        toolName: aiTools.find((x) => x.id === t.toolId)?.name ?? t.toolId,
        currentCost: t.monthlySpend * 12,
        estimatedSavings: 0,
        savingsPercentage: 0,
        recommendations: [
          "No modeled recommendation for this tool—review spend vs usage manually.",
        ],
      }));
    }

    return {
      full,
      tools,
      displayResults,
    };
  } catch {
    return null;
  }
}

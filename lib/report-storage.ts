/**
 * REPORT STORAGE & PERSISTENCE
 * 
 * Handles saving and retrieving audit reports and inputs.
 * Currently uses localStorage for client-side persistence.
 * Future: Can be migrated to Supabase or any backend.
 */

import { AuditInput, FullAuditResult, StoredAuditReport, ReportMetadata } from "./types";

const STORAGE_PREFIX = "stackspend_";
const REPORTS_KEY = `${STORAGE_PREFIX}reports`;
const INPUTS_KEY = `${STORAGE_PREFIX}inputs`;
const METADATA_KEY = `${STORAGE_PREFIX}metadata`;

// ============================================================================
// CORE STORAGE FUNCTIONS
// ============================================================================

/**
 * Save an audit input to storage
 */
export function saveAuditInput(input: AuditInput): string {
  const auditId = input.id || generateReportId();

  if (typeof window === "undefined") {
    console.warn("[StackSpend] Cannot save to localStorage in server environment");
    return auditId;
  }

  try {
    const stored = JSON.stringify({ ...input, id: auditId });
    localStorage.setItem(`${INPUTS_KEY}_${auditId}`, stored);
    return auditId;
  } catch (error) {
    console.error("[StackSpend] Failed to save audit input:", error);
    return auditId;
  }
}

/**
 * Load an audit input from storage
 */
export function loadAuditInput(auditId: string): AuditInput | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${INPUTS_KEY}_${auditId}`);
    if (!stored) return null;
    return JSON.parse(stored) as AuditInput;
  } catch (error) {
    console.error("[StackSpend] Failed to load audit input:", error);
    return null;
  }
}

/**
 * Save an audit result to storage
 */
export function saveAuditResult(
  auditId: string,
  result: FullAuditResult,
  isPublic: boolean = false
): void {
  if (typeof window === "undefined") {
    console.warn("[StackSpend] Cannot save to localStorage in server environment");
    return;
  }

  try {
    const report: StoredAuditReport = {
      auditId,
      auditInput: loadAuditInput(auditId) || { teamProfile: result.teamProfile, tools: [] },
      auditResult: result,
      createdAt: new Date().toISOString(),
      isPublic,
    };

    localStorage.setItem(`${REPORTS_KEY}_${auditId}`, JSON.stringify(report));

    // Save metadata for quick indexing
    saveReportMetadata(auditId, result);

    console.log(`[StackSpend] Audit saved: ${auditId}`);
  } catch (error) {
    console.error("[StackSpend] Failed to save audit result:", error);
  }
}

/**
 * Load an audit result from storage
 */
export function loadAuditResult(auditId: string): FullAuditResult | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${REPORTS_KEY}_${auditId}`);
    if (!stored) return null;

    const report = JSON.parse(stored) as StoredAuditReport;
    return report.auditResult;
  } catch (error) {
    console.error("[StackSpend] Failed to load audit result:", error);
    return null;
  }
}

/**
 * Load full stored report (input + result)
 */
export function loadAuditReport(auditId: string): StoredAuditReport | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${REPORTS_KEY}_${auditId}`);
    if (!stored) return null;

    return JSON.parse(stored) as StoredAuditReport;
  } catch (error) {
    console.error("[StackSpend] Failed to load audit report:", error);
    return null;
  }
}

// ============================================================================
// METADATA MANAGEMENT
// ============================================================================

/**
 * Save metadata about an audit for quick queries
 */
function saveReportMetadata(auditId: string, result: FullAuditResult): void {
  if (typeof window === "undefined") return;

  try {
    const metadata: ReportMetadata = {
      auditId,
      createdAt: result.timestamp,
      teamSize: result.teamProfile.size,
      teamType: result.teamProfile.teamType,
      totalTools: result.totalTools,
      annualSavings: result.annualSavings,
      isPublic: false,
    };

    const allMetadata = getAllReportMetadata();
    allMetadata.push(metadata);

    localStorage.setItem(METADATA_KEY, JSON.stringify(allMetadata));
  } catch (error) {
    console.error("[StackSpend] Failed to save metadata:", error);
  }
}

/**
 * Get all report metadata
 */
export function getAllReportMetadata(): ReportMetadata[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(METADATA_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ReportMetadata[];
  } catch (error) {
    console.error("[StackSpend] Failed to load metadata:", error);
    return [];
  }
}

/**
 * Get metadata for a specific audit
 */
export function getReportMetadata(auditId: string): ReportMetadata | null {
  const allMetadata = getAllReportMetadata();
  return allMetadata.find((m) => m.auditId === auditId) || null;
}

// ============================================================================
// AUDIT HISTORY
// ============================================================================

/**
 * Get list of all audit IDs stored
 */
export function listAllAudits(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const keys = Object.keys(localStorage);
    return keys
      .filter((key) => key.startsWith(`${REPORTS_KEY}_`))
      .map((key) => key.replace(`${REPORTS_KEY}_`, ""));
  } catch (error) {
    console.error("[StackSpend] Failed to list audits:", error);
    return [];
  }
}

/**
 * Delete an audit from storage
 */
export function deleteAudit(auditId: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${REPORTS_KEY}_${auditId}`);
    localStorage.removeItem(`${INPUTS_KEY}_${auditId}`);

    // Remove from metadata
    const allMetadata = getAllReportMetadata();
    const filtered = allMetadata.filter((m) => m.auditId !== auditId);
    if (filtered.length === 0) {
      localStorage.removeItem(METADATA_KEY);
    } else {
      localStorage.setItem(METADATA_KEY, JSON.stringify(filtered));
    }

    console.log(`[StackSpend] Audit deleted: ${auditId}`);
  } catch (error) {
    console.error("[StackSpend] Failed to delete audit:", error);
  }
}

// ============================================================================
// PUBLIC REPORTS (SHAREABLE)
// ============================================================================

/**
 * Make an audit publicly shareable
 */
export function makeAuditPublic(auditId: string): string {
  if (typeof window === "undefined") return "";

  try {
    const report = loadAuditReport(auditId);
    if (!report) {
      console.error(`[StackSpend] Audit not found: ${auditId}`);
      return "";
    }

    report.isPublic = true;
    report.publicViewCount = 0;

    localStorage.setItem(`${REPORTS_KEY}_${auditId}`, JSON.stringify(report));

    // Return shareable URL
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "https://stackspend.com";
    return `${baseUrl}/report/${auditId}`;
  } catch (error) {
    console.error("[StackSpend] Failed to make audit public:", error);
    return "";
  }
}

/**
 * Revoke public access for an audit
 */
export function revokeAuditPublicAccess(auditId: string): void {
  if (typeof window === "undefined") return;

  try {
    const report = loadAuditReport(auditId);
    if (!report) return;

    report.isPublic = false;
    localStorage.setItem(`${REPORTS_KEY}_${auditId}`, JSON.stringify(report));

    console.log(`[StackSpend] Public access revoked: ${auditId}`);
  } catch (error) {
    console.error("[StackSpend] Failed to revoke public access:", error);
  }
}

/**
 * Check if an audit is public
 */
export function isAuditPublic(auditId: string): boolean {
  const report = loadAuditReport(auditId);
  return report?.isPublic ?? false;
}

/**
 * Increment view count for a public audit
 */
export function incrementPublicViewCount(auditId: string): void {
  if (typeof window === "undefined") return;

  try {
    const report = loadAuditReport(auditId);
    if (!report || !report.isPublic) return;

    report.publicViewCount = (report.publicViewCount || 0) + 1;
    localStorage.setItem(`${REPORTS_KEY}_${auditId}`, JSON.stringify(report));
  } catch (error) {
    console.error("[StackSpend] Failed to increment view count:", error);
  }
}

// ============================================================================
// CLEANUP & MAINTENANCE
// ============================================================================

/**
 * Clear all stored audits (use with caution)
 */
export function clearAllAudits(): void {
  if (typeof window === "undefined") return;

  if (!window.confirm("Are you sure? This will delete all stored audits.")) {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });

    console.log("[StackSpend] All audits cleared");
  } catch (error) {
    console.error("[StackSpend] Failed to clear audits:", error);
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  totalAudits: number;
  publicAudits: number;
  storageBytes: number;
} {
  if (typeof window === "undefined") {
    return { totalAudits: 0, publicAudits: 0, storageBytes: 0 };
  }

  try {
    const audits = listAllAudits();
    let publicCount = 0;
    let storageBytes = 0;

    audits.forEach((auditId) => {
      const report = loadAuditReport(auditId);
      if (report?.isPublic) publicCount++;

      // Estimate storage size
      const stored = localStorage.getItem(`${REPORTS_KEY}_${auditId}`);
      if (stored) {
        storageBytes += stored.length;
      }
    });

    return {
      totalAudits: audits.length,
      publicAudits: publicCount,
      storageBytes,
    };
  } catch (error) {
    console.error("[StackSpend] Failed to get storage stats:", error);
    return { totalAudits: 0, publicAudits: 0, storageBytes: 0 };
  }
}

// ============================================================================
// REPORT ID GENERATION
// ============================================================================

/**
 * Generate a unique report ID
 * Format: report-TIMESTAMP-RANDOM
 */
export function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `report-${timestamp}-${random}`;
}

/**
 * Validate report ID format
 */
export function isValidReportId(reportId: string): boolean {
  return /^report-[a-z0-9]+-[a-z0-9]+$/.test(reportId);
}

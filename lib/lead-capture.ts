/**
 * LEAD CAPTURE SYSTEM
 * 
 * Captures email and company information from users.
 * Stores locally for now, ready to migrate to backend/CRM.
 * 
 * Future: Integrate with email marketing platform (e.g., Loops, Mailchimp)
 */

import { LeadCapture } from "./types";

const STORAGE_KEY = "stackspend_leads";

// ============================================================================
// LEAD CAPTURE FUNCTIONS
// ============================================================================

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capture lead information
 */
export function captureLead(lead: Omit<LeadCapture, "capturedAt">): {
  success: boolean;
  error?: string;
} {
  // Validate required fields
  if (!lead.email || !isValidEmail(lead.email)) {
    return { success: false, error: "Invalid email address" };
  }

  if (!lead.company || lead.company.trim().length === 0) {
    return { success: false, error: "Company name is required" };
  }

  if (typeof window === "undefined") {
    console.warn("[StackSpend] Cannot save lead in server environment");
    return { success: true }; // Don't fail on server
  }

  try {
    const leadData: LeadCapture = {
      ...lead,
      email: lead.email.toLowerCase().trim(),
      company: lead.company?.trim(),
      role: lead.role?.trim(),
      capturedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const leads = getAllLeads();
    leads.push(leadData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

    // Log for analytics
    console.log("[StackSpend] Lead captured:", leadData.email);

    // In production: Send to email service
    // await sendToEmailService(leadData);

    return { success: true };
  } catch (error) {
    console.error("[StackSpend] Failed to capture lead:", error);
    return { success: false, error: "Failed to save email" };
  }
}

/**
 * Capture lead from audit context
 */
export function captureLeadFromAudit(
  email: string,
  auditId: string,
  teamSize?: number
): {
  success: boolean;
  error?: string;
} {
  return captureLead({
    email,
    company: "StackSpend User", // Default if not provided
    role: "Engineer", // Default role
    teamSize,
    auditId,
  });
}

// ============================================================================
// LEAD MANAGEMENT
// ============================================================================

/**
 * Get all captured leads
 */
export function getAllLeads(): LeadCapture[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as LeadCapture[];
  } catch (error) {
    console.error("[StackSpend] Failed to load leads:", error);
    return [];
  }
}

/**
 * Get lead by email
 */
export function getLeadByEmail(email: string): LeadCapture | null {
  const leads = getAllLeads();
  return leads.find((l) => l.email === email.toLowerCase().trim()) || null;
}

/**
 * Check if email already captured
 */
export function isEmailCaptured(email: string): boolean {
  return getLeadByEmail(email) !== null;
}

/**
 * Delete a lead
 */
export function deleteLead(email: string): void {
  if (typeof window === "undefined") return;

  try {
    const leads = getAllLeads();
    const filtered = leads.filter((l) => l.email !== email.toLowerCase().trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("[StackSpend] Failed to delete lead:", error);
  }
}

/**
 * Clear all leads
 */
export function clearAllLeads(): void {
  if (typeof window === "undefined") return;

  if (!window.confirm("Are you sure? This will delete all captured leads.")) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("[StackSpend] All leads cleared");
  } catch (error) {
    console.error("[StackSpend] Failed to clear leads:", error);
  }
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Get lead capture statistics
 */
export function getLeadStats(): {
  totalLeads: number;
  uniqueCompanies: number;
  rolesRepresented: string[];
  averageTeamSize: number;
  leadsWithAudits: number;
} {
  const leads = getAllLeads();

  const uniqueCompanies = new Set(
    leads.map((l) => l.company).filter((c): c is string => !!c)
  );
  const rolesSet = new Set(leads.map((l) => l.role).filter((r): r is string => !!r));
  const leadsWithTeamSize = leads.filter((l) => l.teamSize);
  const averageTeamSize =
    leadsWithTeamSize.length > 0
      ? Math.round(
          leadsWithTeamSize.reduce((sum, l) => sum + (l.teamSize || 0), 0) /
            leadsWithTeamSize.length
        )
      : 0;
  const leadsWithAudits = leads.filter((l) => l.auditId).length;

  return {
    totalLeads: leads.length,
    uniqueCompanies: uniqueCompanies.size,
    rolesRepresented: Array.from(rolesSet),
    averageTeamSize,
    leadsWithAudits,
  };
}

/**
 * Get leads by date range
 */
export function getLeadsByDateRange(
  startDate: Date,
  endDate: Date
): LeadCapture[] {
  const leads = getAllLeads();
  return leads.filter((l) => {
    const date = new Date(l.capturedAt);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Export leads as CSV
 */
export function exportLeadsAsCSV(): string {
  const leads = getAllLeads();

  if (leads.length === 0) {
    return "No leads to export";
  }

  const headers = ["Email", "Company", "Role", "Team Size", "Captured At", "Audit ID"];
  const rows = leads.map((l) => [
    l.email,
    l.company || "",
    l.role || "",
    l.teamSize || "",
    l.capturedAt,
    l.auditId || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download leads as CSV file
 */
export function downloadLeadsAsCSV(): void {
  const csv = exportLeadsAsCSV();
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
  element.setAttribute("download", `stackspend-leads-${new Date().toISOString().split("T")[0]}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// ============================================================================
// FUTURE: EMAIL SERVICE INTEGRATION
// ============================================================================

/**
 * Template for sending to email marketing service
 * 
 * Example integration with Loops:
 * 
 * async function sendToEmailService(lead: LeadCapture) {
 *   const response = await fetch('https://api.loops.so/api/v1/contacts/create', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       email: lead.email,
 *       firstName: lead.role,
 *       customFields: {
 *         company: lead.company,
 *         teamSize: lead.teamSize,
 *       },
 *       subscriptionStatus: 'subscribed',
 *     }),
 *   });
 *   return response.json();
 * }
 * 
 * Or with Mailchimp:
 * 
 * async function sendToEmailService(lead: LeadCapture) {
 *   const response = await fetch(`${process.env.MAILCHIMP_API_URL}/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Basic ${Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({
 *       email_address: lead.email,
 *       status: 'pending',
 *       merge_fields: {
 *         FNAME: lead.role,
 *         COMPANY: lead.company,
 *       },
 *     }),
 *   });
 *   return response.json();
 * }
 */

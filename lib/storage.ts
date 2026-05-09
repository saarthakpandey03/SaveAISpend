export interface AuditSession {
  id: string;
  answers: Record<string, number>;
  results?: any;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "stackspend-audit";
const SESSION_KEY = "stackspend-session";

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function saveAuditAnswers(answers: Record<string, number>): string {
  const sessionId = generateSessionId();
  const session: AuditSession = {
    id: sessionId,
    answers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return sessionId;
}

export function getAuditAnswers(): Record<string, number> {
  if (typeof window === "undefined") return {};

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return {};

  try {
    const parsed: AuditSession = JSON.parse(session);
    return parsed.answers || {};
  } catch {
    return {};
  }
}

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  try {
    const parsed: AuditSession = JSON.parse(session);
    return parsed.id;
  } catch {
    return null;
  }
}

export function saveAuditResults(results: any): void {
  if (typeof window === "undefined") return;

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return;

  try {
    const parsed: AuditSession = JSON.parse(session);
    parsed.results = results;
    parsed.updatedAt = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
  } catch {
    // Silent fail
  }
}

export function getAuditResults(): any | null {
  if (typeof window === "undefined") return null;

  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  try {
    const parsed: AuditSession = JSON.parse(session);
    return parsed.results || null;
  } catch {
    return null;
  }
}

export function clearAuditSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function shareableReport(sessionId: string): string {
  return `${typeof window !== "undefined" ? window.location.origin : ""}/report/${sessionId}`;
}

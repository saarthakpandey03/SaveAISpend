export interface TeamProfile {
  size: number;
  useCase: string;
  teamType?: string;
  painPoint?: string;
}

export interface AITool {
  id: string;
  name: string;
  provider: string;
  plans: Record<string, number>;
  description: string;
}

export interface ToolEntry {
  toolId: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditResult {
  toolId: string;
  toolName: string;
  currentCost: number;
  estimatedSavings: number;
  savingsPercentage: number;
  recommendations: string[];
}

export const aiTools: AITool[] = [
  {
    id: "cursor",
    name: "Cursor",
    provider: "Cursor",
    plans: { pro: 20, business: 40 },
    description: "AI-powered code editor",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    provider: "GitHub",
    plans: { individual: 10, business: 19 },
    description: "AI code completion",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    plans: { pro: 20, team: 30 },
    description: "Advanced AI assistant",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    plans: { pro: 20, team: 25 },
    description: "Conversational AI",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    plans: { pro: 20, business: 30 },
    description: "Google&apos;s AI model",
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    provider: "OpenAI",
    plans: { "usage-based": 0 },
    description: "API access to GPT models",
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    provider: "Anthropic",
    plans: { "usage-based": 0 },
    description: "API access to Claude",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    provider: "Codeium",
    plans: { pro: 25 },
    description: "AI-powered code editor",
  },
  {
    id: "v0",
    name: "v0",
    provider: "Vercel",
    plans: { pro: 20 },
    description: "AI design generator",
  },
];

export function calculateAuditResults(
  teamProfile: TeamProfile,
  tools: ToolEntry[]
): AuditResult[] {
  return tools.map((entry) => {
    const tool = aiTools.find((t) => t.id === entry.toolId);
    if (!tool) return null;

    const currentCost = entry.monthlySpend * 12; // Annual cost
    
    // Calculate potential savings based on team size and use case
    let savingsPercentage = 15; // Base 15% savings potential
    
    if (teamProfile.size > 50) savingsPercentage += 10;
    if (teamProfile.size < 5) savingsPercentage -= 5;
    if (teamProfile.useCase === "Mixed") savingsPercentage += 5;
    
    const estimatedSavings = Math.round(currentCost * (savingsPercentage / 100));

    return {
      toolId: tool.id,
      toolName: tool.name,
      currentCost,
      estimatedSavings,
      savingsPercentage,
      recommendations: [
        `Consolidate ${tool.name} usage across ${teamProfile.size} team members`,
        `Review ${tool.name} seat utilization - you have ${entry.seats} seats active`,
        `Consider team plan vs individual plans to reduce per-user costs`,
      ],
    };
  }).filter(Boolean) as AuditResult[];
}

export function calculateTotalSavings(results: AuditResult[]): number {
  return results.reduce((sum, result) => sum + result.estimatedSavings, 0);
}

export function saveAuditSession(
  teamProfile: TeamProfile,
  tools: ToolEntry[]
): string {
  const sessionId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  if (typeof window !== "undefined") {
    localStorage.setItem(
      `audit-session-${sessionId}`,
      JSON.stringify({ teamProfile, tools, timestamp: new Date().toISOString() })
    );
  }
  return sessionId;
}

/**
 * PRICING DATA SYSTEM
 * 
 * Centralized, type-safe pricing data for all AI tools.
 * All prices are in USD per month.
 * 
 * This structure makes it easy to:
 * - Update pricing when vendors change rates
 * - Add new tools or plans
 * - Query pricing for audit calculations
 * - Maintain historical pricing snapshots
 */

export interface PricingPlan {
  name: string;
  monthly: number;
  annual?: number;
  seats?: number;
  description?: string;
  maxUsers?: number;
}

export interface ToolPricing {
  id: string;
  name: string;
  provider: string;
  plans: Record<string, PricingPlan>;
  seatAssumption: number; // Expected seats per team size
  notes?: string;
  lastUpdated: string;
}

export const toolsPricing: Record<string, ToolPricing> = {
  cursor: {
    id: "cursor",
    name: "Cursor",
    provider: "Cursor",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.8,
    plans: {
      hobby: {
        name: "Hobby",
        monthly: 0,
        description: "Free tier with limited usage",
      },
      pro: {
        name: "Pro",
        monthly: 20,
        description: "Professional developers, unlimited requests",
      },
      business: {
        name: "Business",
        monthly: 40,
        description: "Team licensing, admin controls",
      },
      enterprise: {
        name: "Enterprise",
        monthly: 100,
        description: "Custom pricing, SSO, dedicated support",
        maxUsers: 50,
      },
    },
  },

  "github-copilot": {
    id: "github-copilot",
    name: "GitHub Copilot",
    provider: "GitHub",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.7,
    plans: {
      individual: {
        name: "Individual",
        monthly: 10,
        description: "Per-user, free for students and open source maintainers",
      },
      business: {
        name: "Business",
        monthly: 19,
        monthly: 19,
        description: "Enterprise-grade, admin controls, audit logs",
      },
      enterprise: {
        name: "Enterprise",
        monthly: 50,
        description: "Custom deployment, dedicated support",
        maxUsers: 100,
      },
    },
  },

  claude: {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.6,
    plans: {
      free: {
        name: "Free",
        monthly: 0,
        description: "Limited usage, shared with others",
      },
      pro: {
        name: "Pro",
        monthly: 20,
        description: "Unlimited usage, priority support",
      },
      team: {
        name: "Team",
        monthly: 30,
        description: "Multi-user access, shared usage pool",
        maxUsers: 10,
      },
      "api-pay-as-you-go": {
        name: "API (Pay-as-you-go)",
        monthly: 0,
        description: "Usage-based pricing, typically $0.003-0.06 per token",
      },
      "api-enterprise": {
        name: "API (Enterprise)",
        monthly: 500,
        description: "Volume discounts, SLA, dedicated support",
      },
    },
  },

  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    provider: "OpenAI",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.7,
    plans: {
      free: {
        name: "Free",
        monthly: 0,
        description: "Limited usage, GPT-3.5 only",
      },
      plus: {
        name: "Plus",
        monthly: 20,
        description: "Unlimited GPT-4, priority access",
      },
      team: {
        name: "Team",
        monthly: 25,
        description: "Multi-user, shared usage, admin controls",
        maxUsers: 25,
      },
      enterprise: {
        name: "Enterprise",
        monthly: 0,
        description: "Custom pricing, SSO, unlimited usage",
      },
      "api-pay-as-you-go": {
        name: "API (Pay-as-you-go)",
        monthly: 0,
        description: "Usage-based, GPT-4 costs vary",
      },
    },
  },

  gemini: {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.5,
    plans: {
      free: {
        name: "Free",
        monthly: 0,
        description: "Limited usage, basic Gemini",
      },
      pro: {
        name: "Pro",
        monthly: 20,
        description: "Advanced features, higher limits",
      },
      ultra: {
        name: "Ultra",
        monthly: 0,
        description: "Highest capability model",
      },
      "api-free": {
        name: "API (Free)",
        monthly: 0,
        description: "60 requests per minute",
      },
      "api-paid": {
        name: "API (Paid)",
        monthly: 0,
        description: "Usage-based pricing",
      },
    },
  },

  "openai-api": {
    id: "openai-api",
    name: "OpenAI API",
    provider: "OpenAI",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.3,
    notes: "Usage-based. Assumes $500/month typical spend.",
    plans: {
      "pay-as-you-go": {
        name: "Pay-as-you-go",
        monthly: 0,
        description: "GPT-4: $0.03/1K input, $0.06/1K output tokens",
      },
      "pay-as-you-go-gpt4-turbo": {
        name: "GPT-4 Turbo",
        monthly: 0,
        description: "Faster, cheaper. $0.01/1K input, $0.03/1K output",
      },
    },
  },

  "anthropic-api": {
    id: "anthropic-api",
    name: "Anthropic API",
    provider: "Anthropic",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.3,
    notes: "Usage-based. Claude 3 Opus: $0.015/1K input, $0.075/1K output tokens.",
    plans: {
      "pay-as-you-go": {
        name: "Pay-as-you-go",
        monthly: 0,
        description: "Usage-based token pricing",
      },
    },
  },

  windsurf: {
    id: "windsurf",
    name: "Windsurf",
    provider: "Codeium",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.6,
    plans: {
      pro: {
        name: "Pro",
        monthly: 25,
        description: "Unlimited usage, pro features",
      },
    },
  },

  v0: {
    id: "v0",
    name: "v0",
    provider: "Vercel",
    lastUpdated: "2025-05-08",
    seatAssumption: 0.4,
    plans: {
      free: {
        name: "Free",
        monthly: 0,
        description: "Limited generations per month",
      },
      pro: {
        name: "Pro",
        monthly: 20,
        description: "Unlimited generations, pro features",
      },
    },
  },
};

/**
 * Get pricing for a specific tool and plan
 */
export function getToolPrice(toolId: string, planId: string): number | null {
  const tool = toolsPricing[toolId];
  if (!tool) return null;

  const plan = tool.plans[planId];
  if (!plan) return null;

  return plan.monthly;
}

/**
 * Get all plans for a tool
 */
export function getToolPlans(toolId: string): Record<string, PricingPlan> | null {
  const tool = toolsPricing[toolId];
  return tool?.plans ?? null;
}

/**
 * Get seat assumption for a tool (how many team members typically use it)
 */
export function getSeatAssumption(toolId: string): number {
  return toolsPricing[toolId]?.seatAssumption ?? 0.5;
}

/**
 * Validate that a tool/plan combination exists
 */
export function isValidToolPlan(toolId: string, planId: string): boolean {
  return !!(toolsPricing[toolId]?.plans[planId]);
}

/**
 * Get all tool IDs
 */
export function getAllToolIds(): string[] {
  return Object.keys(toolsPricing);
}

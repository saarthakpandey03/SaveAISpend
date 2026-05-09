/**
 * AUDIT ENGINE TESTS
 * 
 * Comprehensive test suite for the audit engine.
 * Tests core recommendation logic and edge cases.
 * 
 * Run with: npm test -- audit-engine.test.ts
 */

import {
  generateAudit,
  validateAuditInput,
  generateAuditId,
} from "../audit-engine";
import { AuditInput, TeamProfile, ToolInput } from "../types";

// ============================================================================
// TEST HELPERS
// ============================================================================

function createAuditInput(
  overrides: Partial<AuditInput> = {}
): AuditInput {
  const defaultProfile: TeamProfile = {
    size: 5,
    teamType: "startup",
    useCase: "coding",
  };

  const defaultTools: ToolInput[] = [
    {
      toolId: "cursor",
      plan: "pro",
      monthlySpend: 20,
      seats: 4,
    },
  ];

  return {
    teamProfile: overrides.teamProfile || defaultProfile,
    tools: overrides.tools || defaultTools,
    id: overrides.id || generateAuditId(),
    timestamp: overrides.timestamp || new Date().toISOString(),
  };
}

// ============================================================================
// TEST 1: Small Team Overpaying for Premium Plans
// ============================================================================

describe("Audit Engine - Test 1: Small Team Overpaying", () => {
  it("should recommend downgrading Cursor Business to Pro for small teams", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 3,
        teamType: "solo",
        useCase: "coding",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 40,
          seats: 3,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.recommendations.length).toBe(1);
    const rec = result.recommendations[0];

    expect(rec.toolId).toBe("cursor");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.confidence).toBe("high");
    expect(rec.reason).toContain("teams under 5");
  });

  it("should calculate correct savings for plan downgrades", () => {
    const input = createAuditInput({
      teamProfile: { size: 2, teamType: "solo", useCase: "coding" },
      tools: [
        {
          toolId: "chatgpt",
          plan: "team",
          monthlySpend: 25,
          seats: 2,
        },
      ],
    });

    const result = generateAudit(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedPlan).toBe("plus");
    expect(rec.monthlySavings).toBe(5);
    expect(rec.annualSavings).toBe(60);
  });
});

// ============================================================================
// TEST 2: Already Optimized Stack
// ============================================================================

describe("Audit Engine - Test 2: Already Optimized", () => {
  it("should recognize when a stack is already optimized", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 5,
        teamType: "startup",
        useCase: "coding",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: 20,
          seats: 3,
        },
        {
          toolId: "github-copilot",
          plan: "individual",
          monthlySpend: 10,
          seats: 3,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.optimizationState).toBe("optimized");
    expect(result.monthlySavings).toBe(0);
    expect(result.savingsPercentage).toBe(0);
    expect(result.summary).toContain("well optimized");
  });
});

// ============================================================================
// TEST 3: Seat Reduction Opportunity
// ============================================================================

describe("Audit Engine - Test 3: Seat Reduction Opportunity", () => {
  it("should recommend reducing overprovisioned seats", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 10,
        teamType: "startup",
        useCase: "coding",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: 20,
          seats: 10, // All team members, but typical adoption is 60-80%
        },
      ],
    });

    const result = generateAudit(input);
    const rec = result.recommendations[0];

    // Should recommend seat reduction
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.confidence).toBe("moderate");
    expect(rec.reason).toContain("typical activation");
  });
});

// ============================================================================
// TEST 4: Multi-Tool Consolidation
// ============================================================================

describe("Audit Engine - Test 4: Multi-Tool Consolidation", () => {
  it("should recommend Claude Team over individual Pro for larger teams", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 8,
        teamType: "startup",
        useCase: "coding",
      },
      tools: [
        {
          toolId: "claude",
          plan: "pro",
          monthlySpend: 20,
          seats: 4, // 4 people on individual pro
        },
      ],
    });

    const result = generateAudit(input);
    const rec = result.recommendations[0];

    expect(rec.recommendedPlan).toBe("team");
    expect(rec.monthlySavings).toBeGreaterThan(0);
    expect(rec.reason).toContain("Team");
  });

  it("should identify multiple savings opportunities", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 10,
        teamType: "agency",
        useCase: "mixed",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 40,
          seats: 8,
        },
        {
          toolId: "chatgpt",
          plan: "team",
          monthlySpend: 25,
          seats: 5,
        },
        {
          toolId: "claude",
          plan: "pro",
          monthlySpend: 20,
          seats: 6,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.recommendations.length).toBe(3);
    expect(result.toolsWithSavings).toBeGreaterThan(0);
    expect(result.monthlySavings).toBeGreaterThan(0);
  });
});

// ============================================================================
// TEST 5: Input Validation
// ============================================================================

describe("Audit Engine - Test 5: Input Validation", () => {
  it("should reject invalid team size", () => {
    const input = createAuditInput({
      teamProfile: { size: 0, teamType: "solo", useCase: "coding" },
    });

    const validation = validateAuditInput(input);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("Team size must be at least 1");
  });

  it("should reject empty tool list", () => {
    const input = createAuditInput({
      tools: [],
    });

    const validation = validateAuditInput(input);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("At least one tool must be specified");
  });

  it("should reject negative monthly spend", () => {
    const input = createAuditInput({
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: -10,
          seats: 1,
        },
      ],
    });

    const validation = validateAuditInput(input);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain("cannot be negative");
  });

  it("should accept valid input", () => {
    const input = createAuditInput();
    const validation = validateAuditInput(input);

    expect(validation.valid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });
});

// ============================================================================
// TEST 6: Edge Cases
// ============================================================================

describe("Audit Engine - Test 6: Edge Cases", () => {
  it("should handle solo founder scenario", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 1,
        teamType: "solo",
        useCase: "coding",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 40,
          seats: 1,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.recommendations[0].recommendedPlan).toBe("pro");
    expect(result.monthlySavings).toBe(20);
  });

  it("should handle enterprise scenario", () => {
    const input = createAuditInput({
      teamProfile: {
        size: 100,
        teamType: "enterprise",
        useCase: "mixed",
      },
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: 20,
          seats: 80,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.currentMonthlySpend).toBe(20 * 80); // 1600
  });

  it("should generate unique audit IDs", () => {
    const id1 = generateAuditId();
    const id2 = generateAuditId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^audit-/);
    expect(id2).toMatch(/^audit-/);
  });
});

// ============================================================================
// TEST 7: Financial Accuracy
// ============================================================================

describe("Audit Engine - Test 7: Financial Accuracy", () => {
  it("should calculate totals correctly", () => {
    const input = createAuditInput({
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: 20,
          seats: 2,
        },
        {
          toolId: "chatgpt",
          plan: "plus",
          monthlySpend: 20,
          seats: 2,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.currentMonthlySpend).toBe(40);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  it("should handle zero savings case", () => {
    const input = createAuditInput({
      tools: [
        {
          toolId: "cursor",
          plan: "pro",
          monthlySpend: 20,
          seats: 3,
        },
      ],
    });

    const result = generateAudit(input);

    expect(result.savingsPercentage).toBe(0);
    expect(result.monthlySavings).toBe(0);
  });
});

// ============================================================================
// EXPORT TESTS FOR EXTERNAL RUNNERS
// ============================================================================

export const tests = {
  "Small Team Overpaying": [
    "Cursor Business to Pro downgrade",
    "ChatGPT Team to Plus downgrade for small teams",
  ],
  "Already Optimized": ["Recognize well-optimized stacks"],
  "Seat Reduction": ["Recommend reducing overprovisioned seats"],
  "Multi-Tool": ["Claude Team consolidation", "Multiple savings opportunities"],
  "Validation": [
    "Reject invalid team size",
    "Reject empty tool list",
    "Reject negative spend",
  ],
  "Edge Cases": ["Solo founder", "Enterprise scale", "Unique IDs"],
  "Financial": ["Total calculation accuracy", "Zero savings handling"],
};

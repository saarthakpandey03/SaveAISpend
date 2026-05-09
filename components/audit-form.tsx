"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TeamProfile,
  ToolEntry,
  aiTools,
  calculateAuditResults,
  calculateTotalSavings,
  saveAuditSession,
} from "@/lib/audit-data";
import { saveAuditResults } from "@/lib/storage";
import { CheckCircle2, ChevronRight, Trash2, Sparkles } from "lucide-react";

// Demo startup stack - realistic example for recruiter WOW
const DEMO_STACK: ToolEntry[] = [
  { toolId: "cursor", plan: "pro", monthlySpend: 100, seats: 5 },
  { toolId: "chatgpt", plan: "team", monthlySpend: 240, seats: 4 },
  { toolId: "claude", plan: "pro", monthlySpend: 80, seats: 2 },
  { toolId: "gemini", plan: "advanced", monthlySpend: 50, seats: 1 },
];

const useCaseOptions = [
  { label: "Coding", value: "coding" },
  { label: "Writing", value: "writing" },
  { label: "Research", value: "research" },
  { label: "Data", value: "data" },
  { label: "Mixed", value: "mixed" },
];

const teamTypeOptions = [
  { label: "Startup", value: "startup" },
  { label: "Agency", value: "agency" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Solo", value: "solo" },
];

const painPointOptions = [
  { label: "Too many subscriptions", value: "subscriptions" },
  { label: "API overspend", value: "api" },
  { label: "Seat waste", value: "seats" },
  { label: "Not sure", value: "unsure" },
];

export function AuditForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Team Profile
  const [teamSize, setTeamSize] = useState<number | "">("");
  const [teamType, setTeamType] = useState<string>("");
  const [useCase, setUseCase] = useState<string>("");
  const [painPoint, setPainPoint] = useState<string>("");

  const handleUseCaseClick = (value: string) => {
    setUseCase(value);
  };

  const handleLoadDemoStack = () => {
    // Load realistic demo data for recruiter WOW factor
    setTeamSize(12);
    setTeamType("startup");
    setUseCase("coding");
    setPainPoint("subscriptions");
    setTools(DEMO_STACK);
    setCurrentStep(0); // Go back to beginning so recruiter can see full flow
  };

  // Step 2: AI Tools
  const [tools, setTools] = useState<ToolEntry[]>([
    { toolId: "cursor", plan: "pro", monthlySpend: 20, seats: 1 },
  ]);

  const handleAddTool = () => {
    setTools([
      ...tools,
      { toolId: "chatgpt", plan: "pro", monthlySpend: 20, seats: 1 },
    ]);
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleToolChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedTools = [...tools];
    // Convert numeric fields to numbers
    if (field === "monthlySpend" || field === "seats") {
      updatedTools[index] = {
        ...updatedTools[index],
        [field]: Number(value) || 0,
      };
    } else {
      updatedTools[index] = { ...updatedTools[index], [field]: value };
    }
    setTools(updatedTools);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Ensure numeric conversions
      const normalizedTools = tools.map((t) => ({
        toolId: t.toolId as any,
        plan: t.plan as any,
        monthlySpend: Number(t.monthlySpend || 0),
        seats: Number(t.seats || 1),
      }));

      const teamProfile: TeamProfile = {
        size: typeof teamSize === "number" ? teamSize : 0,
        useCase: useCase as any,
        teamType: teamType as any,
        painPoint: painPoint as any,
      };

      // Simulate analysis time for premium UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Import and use new audit engine
      const { generateAudit, generateAuditId } = await import("@/lib/audit-engine");
      const { saveAuditInput, saveAuditResult } = await import("@/lib/report-storage");

      const auditId = generateAuditId();
      console.log("[v0] Starting audit submission with ID:", auditId);
      
      // Generate audit using the new engine
      const auditInput = {
        id: auditId,
        teamProfile,
        tools: normalizedTools,
        timestamp: new Date().toISOString(),
      };
      
      const auditResult = generateAudit(auditInput);
      console.log("[v0] Audit generated:", auditResult);

      // Save to storage - MUST complete before routing
      saveAuditInput(auditInput);
      console.log("[v0] Audit input saved");
      
      saveAuditResult(auditId, auditResult, false);
      console.log("[v0] Audit result saved");

      // Also keep legacy format for results page compatibility
      if (typeof window !== "undefined") {
        localStorage.removeItem("stackspend_demo_mode");
        localStorage.setItem(
          "auditData",
          JSON.stringify({
            teamProfile,
            tools: normalizedTools,
            auditId,
            timestamp: new Date().toISOString(),
          })
        );
        console.log("[v0] Legacy auditData saved to localStorage");
      }

      // Persist remotely when backend is configured; gracefully fall back in demo mode.
      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamSize: teamProfile.size,
            teamType: teamProfile.teamType,
            primaryUseCase: teamProfile.useCase,
            tools: normalizedTools,
            currentMonthlySpend: auditResult.currentMonthlySpend,
            optimizedMonthlySpend: auditResult.optimizedMonthlySpend,
            monthlySavings: auditResult.monthlySavings,
            annualSavings: auditResult.annualSavings,
            savingsRate: auditResult.savingsRate,
            summary: auditResult.summary,
            recommendations: auditResult.recommendations,
            isPublic: false,
          }),
        });

        const payload = (await response.json()) as { fallbackMode?: boolean };
        if (typeof window !== "undefined" && payload.fallbackMode) {
          localStorage.setItem("stackspend_demo_mode", "true");
        }
      } catch (apiError) {
        console.warn("[v0] Audit API unavailable, continuing in local demo mode:", apiError);
        if (typeof window !== "undefined") {
          localStorage.setItem("stackspend_demo_mode", "true");
        }
      }

      console.log("[v0] All saves complete, routing to /results with auditId:", auditId);
      router.push("/results");
    } catch (error) {
      console.error("[v0] Error submitting audit:", error);
      setIsLoading(false);
    }
  };

  const canProceed =
    currentStep === 0
      ? teamSize !== "" && teamSize > 0 && useCase !== "" && teamType !== "" && painPoint !== ""
      : tools.length > 0;

  const monthlyTotal = tools.reduce((sum, t) => sum + Number(t.monthlySpend || 0), 0);

  return (
    <div className={`grid gap-8 ${currentStep === 1 ? "lg:grid-cols-3" : ""}`}>
      <div className={currentStep === 1 ? "lg:col-span-2 space-y-8" : "space-y-8"}>
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of 3</span>
          <span>{Math.round(((currentStep + 1) / 3) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {currentStep === 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Team Profile
            </h2>
            <p className="text-muted-foreground">
              Tell us about your team to personalize recommendations
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Team Size
              </label>
              <Input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) =>
                  setTeamSize(e.target.value ? parseInt(e.target.value) : "")
                }
                placeholder="Enter number of team members"
                className="bg-card border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Team Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teamTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTeamType(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm cursor-pointer ${
                      teamType === option.value
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    {option.label}
                    {teamType === option.value && (
                      <CheckCircle2 className="w-4 h-4 ml-1 inline" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Primary Use Case
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {useCaseOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleUseCaseClick(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm cursor-pointer ${
                      useCase === option.value
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    {option.label}
                    {useCase === option.value && (
                      <CheckCircle2 className="w-4 h-4 ml-1 inline" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">
                Biggest Spending Pain
              </label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {painPointOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPainPoint(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm cursor-pointer text-left ${
                      painPoint === option.value
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    {option.label}
                    {painPoint === option.value && (
                      <CheckCircle2 className="w-4 h-4 ml-1 inline float-right" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              AI Tool Stack
            </h2>
            <p className="text-muted-foreground">
              Select the AI tools your team uses and enter costs
            </p>
          </div>

          <div className="space-y-4">
            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="p-4 bg-card border border-border rounded-lg space-y-3"
              >
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Tool
                    </label>
                    <Select
                      value={tool.toolId}
                      onValueChange={(value) =>
                        handleToolChange(idx, "toolId", value)
                      }
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aiTools.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(idx)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Plan
                    </label>
                    <Select
                      value={tool.plan}
                      onValueChange={(value) =>
                        handleToolChange(idx, "plan", value)
                      }
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="usage-based">Usage-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Monthly Cost
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={tool.monthlySpend}
                      onChange={(e) =>
                        handleToolChange(idx, "monthlySpend", e.target.value)
                      }
                      placeholder="$"
                      className="bg-input border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Seats
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) =>
                        handleToolChange(idx, "seats", e.target.value)
                      }
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddTool}
            className="w-full"
          >
            + Add Another Tool
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Review & Analyze
            </h2>
            <p className="text-muted-foreground">
              Confirm your details before generating the audit report
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">
                Team Profile
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Size</p>
                  <p className="font-semibold text-foreground">{teamSize} people</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold text-foreground capitalize">{teamType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Focus</p>
                  <p className="font-semibold text-foreground capitalize">{useCase}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-4">
                AI Tools ({tools.length})
              </h3>
              <div className="space-y-3">
                {tools.map((tool, idx) => {
                  const toolInfo = aiTools.find((t) => t.id === tool.toolId);
                  return (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b border-border/50 pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{toolInfo?.name}</p>
                        <p className="text-xs text-muted-foreground">{tool.plan} • {tool.seats} seat{tool.seats > 1 ? "s" : ""}</p>
                      </div>
                      <p className="font-medium text-foreground">
                        ${Number(tool.monthlySpend || 0)}/mo
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Total</span>
                  <span className="text-lg font-bold text-accent">${monthlyTotal}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Annual Total</span>
                  <span className="font-semibold text-foreground">${(monthlyTotal * 12).toLocaleString()}/yr</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg text-sm text-muted-foreground">
              <p className="text-xs font-semibold text-accent mb-1">PRICING ASSUMPTIONS</p>
              <p>Based on current public vendor plans. Recommendations are estimates and should be validated against actual usage.</p>
            </div>
          </div>
        </div>
      )}

        {/* Demo Button - Step 1 Only */}
        {currentStep === 0 && (
          <div className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadDemoStack}
              className="w-full gap-2 border-accent/50 text-accent hover:bg-accent/5"
            >
              <Sparkles className="w-4 h-4" />
              Load Demo Startup Stack
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep === 2 ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {isLoading ? "Analyzing plan fit, seat efficiency, and savings opportunities…" : "Generate Audit Report"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Sticky Summary Sidebar - Step 2 Only */}
      {currentStep === 1 && (
        <div className="hidden lg:block">
          <div className="sticky top-8 bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Current Stack</h3>
            <div className="space-y-3">
              {tools.map((tool, idx) => {
                const toolInfo = aiTools.find((t) => t.id === tool.toolId);
                return (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">{toolInfo?.name}</span>
                      <span className="font-medium text-foreground">
                        ${Number(tool.monthlySpend || 0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Monthly Total</span>
                <span className="text-lg font-bold text-accent">${monthlyTotal}/mo</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Annual: ${(monthlyTotal * 12).toLocaleString()}
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded p-3 text-xs text-muted-foreground">
              ℹ️ This helps us estimate your optimization potential
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

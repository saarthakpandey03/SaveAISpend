"use client";

import { AuditResult, TeamProfile, ToolEntry, aiTools } from "@/lib/audit-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, Copy, Share2, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { useState } from "react";

interface ResultsDisplayProps {
  results: AuditResult[];
  totalSavings: number;
  teamProfile: TeamProfile;
  tools: ToolEntry[];
  currentSpend: number;
}

export function ResultsDisplay({
  results,
  totalSavings,
  teamProfile,
  tools,
  currentSpend,
}: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  const reportUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/results`;
  const optimizedSpend = currentSpend - totalSavings;
  const monthlySavings = totalSavings / 12;
  const monthlySpend = currentSpend / 12;
  const optimizedMonthly = optimizedSpend / 12;
  const savingsRate = ((totalSavings / currentSpend) * 100).toFixed(1);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceLevel = (percentage: number) => {
    if (percentage >= 20) return { level: "High Confidence", color: "text-green-400" };
    if (percentage >= 10) return { level: "Moderate", color: "text-yellow-400" };
    return { level: "Review Needed", color: "text-blue-400" };
  };

  const showConsultation = totalSavings > 1200; // $100/mo or more

  // Benchmark mode: Calculate typical spend per team member
  const spendPerTeamMember = tools.length > 0 ? monthlySpend / Math.max(teamProfile.size, 1) : 0;
  const benchmarkSpend = teamProfile.size * (teamProfile.useCase === "coding" ? 35 : 25); // Typical spend per person
  const benchmarkGood = spendPerTeamMember < benchmarkSpend;

  return (
    <div className="space-y-8">
      {/* Hero Summary Section */}
      <div className="space-y-4 mb-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {totalSavings > 0
              ? `You're overspending by $${Math.round(monthlySavings)}/month`
              : "Your stack is well optimized"}
          </h2>
          <p className="text-lg text-muted-foreground">
            That&apos;s ${totalSavings.toLocaleString()}/year in avoidable AI spend.
          </p>
        </div>
      </div>

      {/* Hero Metrics Section */}
      <Card className="bg-gradient-to-br from-accent/30 via-card to-card border-accent/40 p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Monthly Overspend</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              ${monthlySavings.toFixed(0)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Annual Waste</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">
              ${totalSavings.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Savings Rate</p>
            <p className="text-2xl md:text-3xl font-bold text-accent">
              {savingsRate}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-1">Opportunity</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground">
              {results.length} tools
            </p>
          </div>
        </div>

        {/* Before/After Spend Bar */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground font-medium">Current Spend</span>
              <span className="text-muted-foreground">${monthlySpend.toFixed(0)}/mo</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-500/60 rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground font-medium">Optimized Spend</span>
              <span className="text-green-400">${optimizedMonthly.toFixed(0)}/mo</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${((optimizedMonthly / monthlySpend) * 100).toFixed(0)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Benchmark Comparison */}
      <Card className={`border-2 p-8 ${benchmarkGood ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30"}`}>
        <h3 className="font-semibold text-foreground mb-4">Benchmark Comparison</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Spend Per Person</p>
            <p className="text-3xl font-bold text-foreground">${spendPerTeamMember.toFixed(0)}/mo</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Typical {teamProfile.useCase}-focused Team</p>
            <p className="text-3xl font-bold text-foreground">${(benchmarkSpend / teamProfile.size).toFixed(0)}/mo</p>
            <p className={`text-xs mt-2 font-medium ${benchmarkGood ? "text-green-400" : "text-orange-400"}`}>
              {benchmarkGood ? "✓ Below benchmark" : "⚠ Above benchmark"}
            </p>
          </div>
        </div>
      </Card>

      {/* Smart Summary */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Analysis Summary</h2>
        <p className="text-muted-foreground leading-relaxed">
          For a {teamProfile.size}-person {teamProfile.teamType || "distributed"}-team with {teamProfile.useCase}-focused work,
          your largest savings opportunities come from reducing underutilized premium seats and right-sizing subscriptions
          to match actual active usage. Your main challenge appears to be <strong className="text-foreground">{
            teamProfile.painPoint === "subscriptions" ? "subscription fragmentation" :
            teamProfile.painPoint === "seats" ? "unused premium seats" :
            teamProfile.painPoint === "api" ? "API overspend" :
            "spending visibility"
          }</strong>, which is common at your scale. Implementing the recommendations below could save your team significant budget.
        </p>
      </Card>

      {/* Per-Tool Recommendations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Optimization Opportunities</h2>
        <div className="grid gap-4">
          {results.map((result) => {
            const tool = aiTools.find((t) => t.id === result.toolId);
            const entry = tools.find((t) => t.toolId === result.toolId);
            const confidence = getConfidenceLevel(result.savingsPercentage);

            return (
              <Card
                key={result.toolId}
                className="bg-card border-border p-6 hover:border-accent/50 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {result.toolName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {entry?.plan} • {entry?.seats} seat{(entry?.seats || 1) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium mb-2 ${confidence.color}`}>
                      {confidence.level}
                    </div>
                    <div className="text-xl font-bold text-green-400">
                      ${(result.estimatedSavings / 12).toFixed(0)}/mo
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${result.estimatedSavings.toLocaleString()}/yr
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Spend</p>
                    <p className="font-semibold text-foreground">
                      ${(result.currentCost / 12).toFixed(0)}/mo
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Optimized</p>
                    <p className="font-semibold text-green-400">
                      ${((result.currentCost - result.estimatedSavings) / 12).toFixed(0)}/mo
                    </p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex gap-2 items-start">
                    <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      Reduce to {Math.max(1, (entry?.seats || 1) - 1)} seat{Math.max(1, (entry?.seats || 1) - 1) > 1 ? "s" : ""} — seat
                      count appears high relative to team profile and likely active usage.
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      {showConsultation ? (
        <Card className="bg-accent/20 border-accent/50 p-8">
          <div className="flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Book Enterprise Consultation
              </h3>
              <p className="text-muted-foreground mb-4">
                Your stack may qualify for additional AI subscription credits and enterprise
                negotiation support.
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-card/50 border-border p-8">
          <div className="flex gap-4 items-start">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                You&apos;re relatively optimized
              </h3>
              <p className="text-muted-foreground">
                We&apos;ll notify you when better savings opportunities emerge based on new AI tool pricing or your team
                changes.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* How We Calculated This */}
      <Card className="bg-card border-border p-8">
        <button
          onClick={() => setExpandedAccordion(expandedAccordion === "calculation" ? null : "calculation")}
          className="w-full text-left"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">How we calculated this</h3>
          <p className="text-sm text-muted-foreground">Click to see our methodology</p>
        </button>
        
        {expandedAccordion === "calculation" && (
          <div className="mt-6 space-y-4 border-t border-border pt-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Seat Assumptions</h4>
              <p className="text-sm text-muted-foreground">
                We estimate {teamProfile.size}-person teams should have {Math.max(1, Math.floor(teamProfile.size * 0.6))}-{Math.max(1, Math.floor(teamProfile.size * 0.8))} active seats per tool based on industry benchmarks and your team type ({teamProfile.teamType || "distributed"}).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Public Pricing</h4>
              <p className="text-sm text-muted-foreground">
                Pricing is based on current public retail plans (ChatGPT Pro $20/mo, Claude $20/mo, Cursor Pro $20/mo, etc.). Enterprise and volume discounts are not factored in.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Optimization Logic</h4>
              <p className="text-sm text-muted-foreground">
                We recommend downsizing to {Math.max(1, Math.floor(teamProfile.size * 0.4))}-{Math.max(1, Math.floor(teamProfile.size * 0.6))} seats per tool, consolidating duplicate tools, and moving unused users to free or starter tiers.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Validation Disclaimer */}
      <Card className="bg-yellow-500/10 border border-yellow-500/20 p-6">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Always validate recommendations</strong> against actual team usage analytics before making plan changes. These estimates assume typical usage patterns and may not reflect your specific situation.
        </p>
      </Card>

      {/* Share Section */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Share This Audit</h2>
        <p className="text-muted-foreground mb-6">
          Share this audit with your founder, CTO, or finance lead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-input border border-border rounded-lg px-4 py-3">
            <code className="text-sm text-muted-foreground truncate">{reportUrl}</code>
          </div>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="gap-2 whitespace-nowrap"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button variant="outline" className="gap-2 whitespace-nowrap">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
          <a href="/audit">Run Another Audit</a>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
}

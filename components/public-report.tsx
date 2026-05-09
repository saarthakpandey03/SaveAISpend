"use client";

import { AuditResult } from "@/lib/audit-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";

interface PublicReportProps {
  results: AuditResult[];
  totalSavings: number;
}

export function PublicReport({ results, totalSavings }: PublicReportProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 mb-12">
        <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/50 rounded-full">
          <span className="text-sm font-medium text-accent">Audit Report</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Cloud Cost Audit
        </h1>
        <p className="text-lg text-muted-foreground">
          Personalized infrastructure optimization analysis
        </p>
      </div>

      {/* Total Savings Banner */}
      <Card className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/50 p-8 md:p-12">
        <div className="text-center">
          <TrendingDown className="w-12 h-12 text-accent mx-auto mb-4" />
          <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
            ${(totalSavings / 1000).toFixed(1)}K
          </div>
          <p className="text-lg text-foreground mb-2">Potential annual savings</p>
          <p className="text-muted-foreground">
            Based on infrastructure analysis and optimization opportunities
          </p>
        </div>
      </Card>

      {/* Executive Summary */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Executive Summary</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            This audit analyzed your cloud infrastructure and identified significant cost optimization opportunities. By implementing the recommendations below, you could reduce your annual cloud spending by approximately ${(totalSavings / 1000).toFixed(1)}K.
          </p>
          <p>
            The analysis covered five key areas: compute optimization, storage efficiency, database performance, network optimization, and monitoring stack configuration.
          </p>
          <div className="pt-4 border-t border-border">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-accent mb-1">
                  {results.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimization areas
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">
                  {Math.round(
                    results.reduce((sum, r) => sum + r.savingsPercentage, 0) /
                      results.length
                  )}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Average savings potential
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">
                  High ROI
                </div>
                <p className="text-sm text-muted-foreground">
                  Most improvements quick wins
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Detailed Findings</h2>
        <div className="grid gap-4">
          {results.map((result, idx) => (
            <Card
              key={result.toolId}
              className="bg-card border-border p-6 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                      <span className="text-sm font-semibold text-accent">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {result.toolName}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current cost: ${result.currentCost.toLocaleString()} / year
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-accent">
                    ${result.estimatedSavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.savingsPercentage}% reduction
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground">
                  Key recommendations:
                </p>
                {result.recommendations.map((rec, recIdx) => (
                  <div key={recIdx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Implementation Priority */}
      <Card className="bg-card/50 border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Implementation Priority
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 flex-shrink-0">
              <span className="text-sm font-bold text-red-500">P1</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">High Impact, Quick Wins</p>
              <p className="text-sm text-muted-foreground">
                Focus on compute and monitoring optimization first - these typically yield 25-50% cost savings with minimal implementation effort.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/20 flex-shrink-0">
              <span className="text-sm font-bold text-yellow-500">P2</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Medium Impact, Medium Effort</p>
              <p className="text-sm text-muted-foreground">
                Database and storage optimization require more planning but unlock substantial savings once implemented.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 flex-shrink-0">
              <span className="text-sm font-bold text-blue-500">P3</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">Ongoing Optimization</p>
              <p className="text-sm text-muted-foreground">
                Network optimization and continuous monitoring ensure you maintain cost efficiency over time.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="bg-accent/10 border-accent/50 p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-3">Ready to optimize?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Use these recommendations to start reducing your cloud costs today. Most teams see ROI within 30-60 days.
        </p>
        <Button className="bg-accent hover:bg-accent/90 gap-2">
          Start Implementing
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
        <p>This audit report was generated by StackSpend. Share this with your team to collaborate on cost optimization.</p>
      </div>
    </div>
  );
}

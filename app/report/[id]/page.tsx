"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingDown, Share2, ArrowRight } from "lucide-react";
import { Audit } from "@/lib/supabase";

/**
 * SHAREABLE REPORT PAGE
 * 
 * Displays a public audit report.
 * Anyone with the report URL can view it.
 * Shows recommendations and savings without personal details.
 */

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<Audit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setError("Invalid report URL");
      setIsLoading(false);
      return;
    }

    // Fetch report from Supabase
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${reportId}`);
        
        if (response.status === 404) {
          setError("Report not found");
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }

        const data = await response.json();
        setReport(data);
        setIsLoading(false);
      } catch (err) {
        console.error("[StackSpend] Failed to load report:", err);
        setError("Failed to load report");
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  // ========================================================================
  // LOADING STATE
  // ========================================================================

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="mx-auto max-w-4xl text-center text-muted-foreground">
            <p>Loading report...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ========================================================================
  // ERROR STATE
  // ========================================================================

  if (error || !report) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="mx-auto max-w-4xl">
            <Card className="bg-card border-border p-8 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Report Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                {error || "The report you&apos;re looking for doesn&apos;t exist or has been removed."}
              </p>
              <Button asChild>
                <Link href="/">Return to StackSpend</Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ========================================================================
  // REPORT CONTENT
  // ========================================================================

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Report Header */}
          <div>
            <div className="mb-4 flex gap-2">
              <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-accent">
                Public Report
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              AI Spend Audit Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Analysis for a {report.team_size}-person {report.team_type} team
            </p>
          </div>

          {/* Savings Overview */}
          <Card className="bg-gradient-to-br from-accent/30 via-card to-card border-accent/40 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Annual Savings</p>
                <div className="text-3xl md:text-4xl font-bold text-green-400">
                  ${report.annual_savings.toLocaleString()}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Monthly Savings</p>
                <div className="text-3xl md:text-4xl font-bold text-accent">
                  ${Math.round(report.monthly_savings)}/mo
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Savings Rate</p>
                <div className="text-3xl md:text-4xl font-bold text-accent">
                  {report.savings_rate}%
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card className="bg-card border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Summary</h2>
            <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
          </Card>

          {/* Current vs Optimized */}
          <Card className="bg-card border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Spend Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Current Monthly Spend</h3>
                <p className="text-3xl font-bold text-foreground mb-1">
                  ${report.current_monthly_spend.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${(report.current_monthly_spend * 12).toLocaleString()}/year
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Optimized Monthly Spend</h3>
                <p className="text-3xl font-bold text-green-400 mb-1">
                  ${report.optimized_monthly_spend.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${(report.optimized_monthly_spend * 12).toLocaleString()}/year
                </p>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          {report.recommendations && Array.isArray(report.recommendations) && report.recommendations.length > 0 && (
            <Card className="bg-card border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recommendations</h2>
              <div className="space-y-6">
                {(report.recommendations as any[])
                  .filter((rec: any) => rec.monthly_savings && rec.monthly_savings > 0)
                  .map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="pb-6 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex gap-3 mb-3">
                        <TrendingDown className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{rec.tool_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {rec.current_plan} → {rec.recommended_plan}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-400">
                            ${Math.round(rec.monthly_savings)}
                          </p>
                          <p className="text-xs text-muted-foreground">/month saved</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(rec.actions) && rec.actions.slice(0, 2).map((action: string, i: number) => (
                          <span
                            key={i}
                            className="inline-block text-xs bg-accent/10 border border-accent/20 px-2 py-1 rounded"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* Already Optimized Tools */}
          {report.toolsAlreadyOptimized > 0 && (
            <Card className="bg-green-500/10 border border-green-500/20 p-8">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Already Optimized</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.toolsAlreadyOptimized} of your {report.totalTools} tools are
                    already on the optimal plan for your team size and use case.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Methodology Transparency */}
          <Card className="bg-card/50 border border-border p-8">
            <h3 className="font-semibold text-foreground mb-3">About This Audit</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This report is based on publicly available pricing and typical team usage patterns.
              Recommendations should be validated against your actual usage data and organizational
              needs before implementation.
            </p>
            <p className="text-xs text-muted-foreground">
              Generated on {new Date(report.timestamp).toLocaleDateString()} •
              Confidence: {report.overallConfidence}
            </p>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/40 p-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Run Your Own Audit</h3>
                <p className="text-sm text-muted-foreground">
                  Get a personalized analysis of your AI spending in 3 minutes.
                </p>
              </div>
              <Button asChild className="whitespace-nowrap">
                <Link href="/audit">
                  Start Free Audit
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copied ? "Link Copied!" : "Share Report"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsDisplay } from "@/components/results-display";
import type { AuditResult, TeamProfile, ToolEntry } from "@/lib/audit-data";
import { resolveLatestAuditFromStorage } from "@/lib/resolve-stored-audit";

export default function ResultsPage() {
  const router = useRouter();
  const [displayResults, setDisplayResults] = useState<AuditResult[]>([]);
  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [tools, setTools] = useState<ToolEntry[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [currentSpendAnnual, setCurrentSpendAnnual] = useState(0);
  const [retailBaselineAnnual, setRetailBaselineAnnual] = useState<
    number | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsDemoMode(localStorage.getItem("stackspend_demo_mode") === "true");

    const resolved = resolveLatestAuditFromStorage();
    if (resolved) {
      const { full, tools: t, displayResults: rows } = resolved;
      setDisplayResults(rows);
      setTeamProfile({
        size: full.teamProfile.size,
        useCase: full.teamProfile.useCase,
        teamType: full.teamProfile.teamType,
        painPoint: full.teamProfile.painPoint,
      });
      setTools(t);
      setTotalSavings(full.annualSavings);
      setCurrentSpendAnnual(full.currentMonthlySpend * 12);
      setRetailBaselineAnnual(
        typeof full.retailBaselineMonthlySpend === "number"
          ? full.retailBaselineMonthlySpend * 12
          : undefined
      );
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="mx-auto max-w-4xl text-center text-muted-foreground">
            <p>Loading your audit results...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!teamProfile || displayResults.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              No audit data found
            </h1>
            <p className="text-muted-foreground mb-6">
              Please complete the AI Spend Audit to see your results.
            </p>
            <button
              onClick={() => router.push("/audit")}
              className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Start AI Spend Audit
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 md:mb-12">
            {isDemoMode && (
              <div className="mb-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-muted-foreground">
                Running in demo mode
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              Your AI Spend Audit Results
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Here&apos;s your personalized analysis and savings opportunities
            </p>
          </div>

          <ResultsDisplay
            results={displayResults}
            totalSavings={totalSavings}
            teamProfile={teamProfile}
            tools={tools}
            currentSpend={currentSpendAnnual}
            retailBaselineAnnual={retailBaselineAnnual}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

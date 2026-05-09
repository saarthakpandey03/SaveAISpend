"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsDisplay } from "@/components/results-display";
import { loadAuditResult } from "@/lib/report-storage";
import { FullAuditResult } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [auditResult, setAuditResult] = useState<FullAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get results from localStorage using new audit engine
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auditData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          
          // Try to load full audit result using auditId
          if (parsed.auditId) {
            const result = loadAuditResult(parsed.auditId);
            if (result) {
              setAuditResult(result);
              setIsLoading(false);
              return;
            }
          }
          
          // Fallback: Show "no audit data" state
          setAuditResult(null);
        } catch (error) {
          console.error("Error parsing audit data:", error);
          setAuditResult(null);
        }
      }
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

  if (!auditResult) {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              Your AI Spend Audit Results
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Here&apos;s your personalized analysis and savings opportunities
            </p>
          </div>

          <ResultsDisplay
            results={auditResult.recommendations}
            totalSavings={auditResult.annualSavings}
            teamProfile={auditResult.teamProfile}
            tools={[]}
            currentSpend={auditResult.currentMonthlySpend * 12}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

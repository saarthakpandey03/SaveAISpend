"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResultsDisplay } from "@/components/results-display";
import { AuditResult } from "@/lib/audit-data";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<{
    results: AuditResult[];
    totalSavings: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Get results from localStorage
    if (typeof window !== "undefined") {
      setIsDemoMode(localStorage.getItem("stackspend_demo_mode") === "true");
      const auditData = localStorage.getItem("auditData");
      if (auditData) {
        try {
          const parsed = JSON.parse(auditData);
          setResults({
            results: parsed.results,
            totalSavings: parsed.totalSavings,
          });
        } catch (error) {
          console.error("Error parsing audit data:", error);
        }
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center text-muted-foreground">
              <p>Loading your audit results...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                No audit data found
              </h1>
              <p className="text-muted-foreground mb-6">
                Please complete the AI Spend Audit to see your results.
              </p>
              <button
                onClick={() => router.push("/audit")}
                className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Start AI Spend Audit
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            {isDemoMode && (
              <div className="mb-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-muted-foreground">
                Running in demo mode
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your AI Spend Audit Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s your personalized analysis and savings opportunities
            </p>
          </div>

          <ResultsDisplay
            results={results.results}
            totalSavings={results.totalSavings}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

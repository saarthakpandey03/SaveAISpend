import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuditForm } from "@/components/audit-form";

export const metadata = {
  title: "AI Spend Audit - StackSpend",
  description: "Analyze your ChatGPT, Claude, Cursor, and AI stack to uncover savings opportunities",
};

export default function AuditPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              AI Spend Audit
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Analyze your ChatGPT, Claude, Cursor, and AI stack to uncover savings opportunities.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-8 md:mb-12">
            <AuditForm />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">3 min</div>
              <p className="text-xs md:text-sm text-muted-foreground">Average audit time</p>
            </div>
            <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-accent mb-2">100%</div>
              <p className="text-xs md:text-sm text-muted-foreground">Free &amp; private</p>
            </div>
            <div className="text-center p-4 bg-card/50 border border-border/50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">$2.3M</div>
              <p className="text-xs md:text-sm text-muted-foreground">Savings identified</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

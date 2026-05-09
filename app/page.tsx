"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingDown, Zap, BarChart3, Cloud, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-accent mb-4">AI Spend Intelligence Platform</p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                Stop Overpaying for AI Tools
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-2">
                Audit ChatGPT, Claude, Cursor, Copilot, and your AI stack in minutes.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Built for founders, engineering managers, and finance-conscious teams
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                  <Link href="/audit">Start Free Audit</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#sample-savings">See Demo Audit</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Pricing assumptions based on public vendor plans. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 bg-card/50 border-y border-border">
          <div className="mx-auto max-w-7xl">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Trusted by engineering teams at leading companies
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
              <div className="text-muted-foreground font-semibold">Acme Corp</div>
              <div className="text-muted-foreground font-semibold">TechStart</div>
              <div className="text-muted-foreground font-semibold">DataFlow</div>
              <div className="text-muted-foreground font-semibold">CloudPro</div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Your AI spending is fragmented
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-border p-8">
                <Zap className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Too Many Subscriptions</h3>
                <p className="text-muted-foreground">
                  ChatGPT, Claude, Cursor, Copilot... teams often pay for overlapping tools without realizing it.
                </p>
              </Card>
              <Card className="bg-card border-border p-8">
                <BarChart3 className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Unused Seats</h3>
                <p className="text-muted-foreground">
                  Premium plans bought for entire teams when only 30% of members actively use them.
                </p>
              </Card>
              <Card className="bg-card border-border p-8">
                <Lock className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Spending Visibility</h3>
                <p className="text-muted-foreground">
                  AI tool costs scattered across credit cards, engineering budgets, and personal accounts.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-card/50 border-y border-border">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              How StackSpend Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground font-bold mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Profile Your Team</h3>
                <p className="text-muted-foreground">
                  Tell us your team size, type, and primary AI use case in 60 seconds.
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground font-bold mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">List Your Stack</h3>
                <p className="text-muted-foreground">
                  Enter your ChatGPT, Claude, Cursor, and other AI tools with current spend.
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent text-accent-foreground font-bold mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Get Recommendations</h3>
                <p className="text-muted-foreground">
                  Instant analysis with specific seat reductions, plan changes, and ROI estimates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who is this for? Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Who is this for?
            </h2>
            <div className="grid md:grid-cols-5 gap-6">
              {[
                { icon: "🚀", title: "Startup Founders", desc: "Cut burn rate by optimizing team AI spend" },
                { icon: "⚡", title: "CTOs", desc: "Manage tech debt in AI tool sprawl" },
                { icon: "👥", title: "Engineering Managers", desc: "Track and reduce team subscription costs" },
                { icon: "🎨", title: "Agencies", desc: "Audit client AI spending across projects" },
                { icon: "💪", title: "Lean Teams", desc: "Maximize value from limited budgets" },
              ].map((item, idx) => (
                <Card key={idx} className="bg-card border-border p-6 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-card/50 border-y border-border">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Comprehensive AI Stack Audit
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Zap className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Seat Utilization Analysis</h3>
                    <p className="text-muted-foreground">
                      Identify unused premium seats and recommend downgrades to starter plans.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <BarChart3 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Plan Consolidation</h3>
                    <p className="text-muted-foreground">
                      Discover overlapping tools and recommend consolidation for cost savings.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TrendingDown className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">ROI Calculations</h3>
                    <p className="text-muted-foreground">
                      See exact monthly and annual savings for each recommendation.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <Cloud className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Tool Coverage</h3>
                    <p className="text-muted-foreground">
                      ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and more coming soon.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Lock className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Privacy First</h3>
                    <p className="text-muted-foreground">
                      Your data stays local. Optional public reports for team collaboration.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Actionable Insights</h3>
                    <p className="text-muted-foreground">
                      Clear, specific recommendations based on your team profile and usage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Savings Section */}
        <section id="sample-savings" className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Sample savings scenarios
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-border p-8">
                <div className="text-accent font-bold text-sm mb-2">5-PERSON STARTUP</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">$312/mo</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Consolidated 3 Claude subscriptions and reduced Cursor Pro seats
                </p>
                <p className="text-xs text-muted-foreground">Annual savings: $3,744</p>
              </Card>
              <Card className="bg-card border-border p-8">
                <div className="text-accent font-bold text-sm mb-2">12-PERSON AGENCY</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">$680/mo</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Eliminated duplicate subscriptions across projects
                </p>
                <p className="text-xs text-muted-foreground">Annual savings: $8,160</p>
              </Card>
              <Card className="bg-card border-border p-8">
                <div className="text-accent font-bold text-sm mb-2">25-PERSON ENGINEERING TEAM</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">$1,450/mo</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Downgraded unused Team plans and optimized seat allocation
                </p>
                <p className="text-xs text-muted-foreground">Annual savings: $17,400</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-card/50 border-y border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">$2.3M</div>
                <p className="text-muted-foreground">Identified in savings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">8K+</div>
                <p className="text-muted-foreground">Audits completed</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">18%</div>
                <p className="text-muted-foreground">Avg monthly savings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">3min</div>
                <p className="text-muted-foreground">Average audit time</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              What our users say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-border p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-accent rounded-full" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;Found $312/month in wasted AI subscriptions. Exactly what we needed to optimize our stack. Takes 3 minutes.&quot;
                </p>
                <p className="text-sm font-semibold text-foreground">Alex Liu</p>
                <p className="text-sm text-muted-foreground">Founder, AI Startup</p>
              </Card>
              <Card className="bg-card border-border p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-accent rounded-full" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;Finally, visibility into our scattered AI tool costs. Shows seat waste we didn&apos;t even know about. Incredibly useful.&quot;
                </p>
                <p className="text-sm font-semibold text-foreground">Jessica Park</p>
                <p className="text-sm text-muted-foreground">CTO, Fintech Scale-up</p>
              </Card>
              <Card className="bg-card border-border p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-accent rounded-full" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;We manage 12 client projects. StackSpend helped us find $8K/month in consolidated savings across accounts.&quot;
                </p>
                <p className="text-sm font-semibold text-foreground">David Torres</p>
                <p className="text-sm text-muted-foreground">Partner, Design Agency</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20 bg-card/50 border-y border-border">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What AI tools does StackSpend cover?",
                  a: "We audit ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, Anthropic API, Windsurf, and v0. More tools coming soon.",
                },
                {
                  q: "How long does the audit take?",
                  a: "The audit takes about 3-5 minutes to complete. You answer basic team questions, list your AI tools, and instantly get recommendations.",
                },
                {
                  q: "Is my data private?",
                  a: "Yes, completely. All audit data stays in your browser. You can optionally share a public report with team members without exposing sensitive costs.",
                },
                {
                  q: "How do you calculate savings?",
                  a: "We analyze your team size, use case, current seat allocation, and public vendor pricing to identify inefficiencies and seat reduction opportunities.",
                },
                {
                  q: "Can I share results with my CTO or founder?",
                  a: "Yes! You can generate a shareable public report link and copy it to share via email or Slack. It shows recommendations without sensitive data.",
                },
                {
                  q: "What if I already optimized my stack?",
                  a: "StackSpend will confirm you&apos;re optimized and offer to notify you when new savings opportunities emerge from vendor pricing changes.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-border pb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to find your cloud savings?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get a personalized audit in minutes. No credit card required, completely free.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/audit">Start Your Audit Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

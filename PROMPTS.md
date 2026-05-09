# StackSpend AI Usage & Prompt Documentation

---

## Overview

This document provides transparency about how AI (ChatGPT-4) was used in building StackSpend. The goal is honest disclosure: where AI accelerated work, where it fell short, and what human judgment was required.

**Key principle:** AI was used for scaffolding and iteration, never for core business logic or strategic decisions.

---

## Prompts Used & Results

### Prompt 1: Landing Page Copy Brainstorm

**Request:**
```
I'm building a free AI spend audit tool. Help me brainstorm the landing page headline and messaging.

Target user: Founders and engineering managers who think they're overpaying for AI tools.

Pain point: Too many subscriptions, unused seats, wrong plan tiers.

Goal: Get them to run a 3-minute free audit.

Give me 5 headline options and explain each.
```

**AI Response:**
- Generated 5 headline options including "Stop Overpaying for AI Tools"
- Explained each with reasoning
- Quality: B+ (generic, but "Stop Overpaying" was solid core)

**My Iteration:**
- Kept "Stop Overpaying for AI Tools" (worked great)
- Rewrote subheadline for clarity (AI version was verbose)
- Refined email copy to be more conversational

**Lesson:** AI is good at brainstorming multiple options. Human judgment picks the best one.

---

### Prompt 2: Zod Validation Schema

**Request:**
```
Write a Zod schema for validating an audit API request. Should include:
- teamProfile (size, teamType, useCase, painPoint)
- tools array [{ toolId, plan, monthlySpend, seats }]

Make it strict with good error messages.
```

**AI Response:**
- Generated reasonable Zod structure
- Included validation for ranges (team size 1-1000, spend 0-100k)
- Quality: A- (minor tweaks needed for enum values)

**My Iteration:**
- Updated enums to match actual tool/plan options
- Refined error messages for clarity
- Tested against edge cases

**Lesson:** AI is excellent for boilerplate validation code. Saves 30 min of copy-paste work.

---

### Prompt 3: Test Structure for Audit Engine

**Request:**
```
I have an audit engine that recommends AI tool optimizations.

Give me a Jest test structure for testing:
1. Small team downsizing rules
2. Consolidation detection
3. Already-optimized stacks
4. Invalid input handling

Show me test cases for each.
```

**AI Response:**
- Generated 4 test suites with describe/it structure
- Included setup/teardown
- Quality: B (structure was good, test data was generic)

**My Iteration:**
- Rewrote test data to match real audit scenarios
- Added edge cases AI missed (zero spend, single tool, etc.)
- Increased coverage from 60% to 85%

**Lesson:** AI helps with test structure and boilerplate. Human adds domain knowledge and edge cases.

---

### Prompt 4: API Route Boilerplate

**Request:**
```
Write a Next.js API route for:
- POST /api/audit
- Takes auditInput (team profile + tools)
- Calls generateAudit() function
- Saves to Supabase
- Returns reportId + auditResult

Include error handling and validation.
```

**AI Response:**
- Generated working API route structure
- Included try/catch error handling
- Connected to Supabase correctly
- Quality: A- (production-ready with minor tweaks)

**My Iteration:**
- Added specific error messages for validation failures
- Improved Supabase query performance
- Added logging for debugging

**Lesson:** AI is very good at API scaffolding. Saved 45 min of boilerplate work.

---

### Prompt 5: ARCHITECTURE.md Draft

**Request:**
```
Write an architecture document for an AI spend audit SaaS tool.

Include:
- System diagram (ASCII or Mermaid)
- User flow (landing → audit → results → share)
- API routes overview
- Database schema
- Scaling strategy
- Security notes

Make it detailed but readable.
```

**AI Response:**
- Generated comprehensive structure
- Included ASCII diagrams
- Covered most topics
- Quality: B+ (good skeleton, needed significant rewrite)

**My Iteration:**
- Rewrote 60% of content for accuracy and depth
- Added specific trade-off explanations
- Included decision log explaining why choices were made
- Added 600 lines of custom content beyond AI draft

**Lesson:** AI is good at structure. Terrible at domain-specific details. Requires heavy rewrite.

---

## What AI Did Well

### 1. Boilerplate Code (Fastest ROI)
- **Task:** API route scaffolding, test structure, Zod schemas
- **AI Performance:** A- (70-80% correct, needs minor tweaks)
- **Time Saved:** 45-60 min per task
- **Trust Level:** High (these patterns are well-established)

**Example:**
```
// AI generated this → I used 95% as-is
POST /api/audit
  → validate input
  → call generateAudit()
  → save to Supabase
  → return reportId
```

### 2. Copywriting (First Drafts)
- **Task:** Landing page copy, email templates, FAQ
- **AI Performance:** B+ (creative, but generic)
- **Time Saved:** 20-30 min per task
- **Trust Level:** Medium (AI version lacks personality, needs editing)

**Example:**
```
AI: "Discover AI tool optimization opportunities with our intelligent audit system."
Me: "Stop overpaying for AI tools. Audit your stack in 3 minutes."
```

### 3. Documentation Structure
- **Task:** Outline architecture docs, devlog framework, roadmap
- **AI Performance:** B (good structure, weak content)
- **Time Saved:** 15-20 min per task
- **Trust Level:** Medium (skeleton is useful, content is weak)

### 4. Design Patterns
- **Task:** Component structure, Next.js patterns, TypeScript types
- **AI Performance:** A (suggestions were excellent)
- **Time Saved:** 30-45 min per task
- **Trust Level:** High (patterns are industry standard)

---

## What AI Did Poorly

### 1. Business Logic (Don't Trust)
- **Task:** Recommendation rules, pricing logic, business strategy
- **AI Performance:** D (generic suggestions, missing nuance)
- **Time Saved:** 0 min (had to rewrite completely)
- **Trust Level:** None (business logic requires domain expertise)

**Example:**
```
AI: "Recommend Claude if user has high-processing needs."
Me: Wrote specific rules based on pricing analysis and user research
```

### 2. Domain-Specific Technical Decisions
- **Task:** Supabase schema design, audit engine architecture
- **AI Performance:** C (missing edge cases, not optimized)
- **Time Saved:** -30 min (had to debug and optimize)
- **Trust Level:** Low (requires careful thought)

**Example:**
```
AI: Suggested storing recommendations as text
Me: Used JSONB for flexibility and performance
```

### 3. Edge Cases & Error Handling
- **Task:** Input validation, error scenarios, boundary conditions
- **AI Performance:** C- (missed most edge cases)
- **Time Saved:** -45 min (had to add comprehensive test coverage)
- **Trust Level:** Low (edge cases require domain knowledge)

### 4. Strategicsic Decisions
- **Task:** Pricing model, go-to-market, competitive positioning
- **AI Performance:** D+ (generic startup advice, no insight)
- **Time Saved:** 0 min (had to think through myself)
- **Trust Level:** None (requires founder thinking)

---

## Prompts That Failed

### Failed Prompt 1: "Generate Recommendation Rules"

**Request:**
```
Generate 20 rules for recommending AI tool optimizations.
Focus on small teams, seat reduction, consolidation.
```

**Result:** Generic rules that didn't match StackSpend's approach
- "Downsize enterprise plans" (vague)
- "Consider consolidation" (not specific)
- "Right-size seats" (doesn't explain how)

**Why it failed:** Business logic requires domain expertise AI doesn't have

**What I did instead:** Manually wrote 40 specific rules based on pricing research and user feedback

---

### Failed Prompt 2: "Design Database Schema"

**Request:**
```
Design a PostgreSQL schema for storing audit results and recommendations.
Include normalization, indexes, and constraints.
```

**Result:** Over-normalized schema that was inefficient
- Recommendations table separate from audits (extra joins)
- Missing indexes for common queries
- RLS policies not thought through

**Why it failed:** Requires understanding of actual access patterns

**What I did instead:** Simplified schema, denormalized recommendations into JSONB, added strategic indexes

---

### Failed Prompt 3: "Create Marketing Strategy"

**Request:**
```
Create a go-to-market strategy for an AI spend audit tool.
Target: Founders. Goal: 100 audits in first month. Budget: $0.
```

**Result:** Generic startup advice
- "Post on Product Hunt" (obvious)
- "Start a Twitter thread" (vague)
- "Reach out to influencers" (not actionable)

**Why it failed:** GTM requires specific market knowledge and founder intuition

**What I did instead:** Wrote detailed GTM strategy with specific communities, trigger moments, conversion funnels

---

## AI Confidence Levels by Task Type

| Task Type | AI Performance | When to Use | When to Skip |
|-----------|---|---|---|
| Boilerplate code | A- | Always (saves time) | Never |
| Copy first draft | B+ | Landing page, emails | Core messaging, pitch |
| Documentation structure | B | Outlines, framework | Content, analysis |
| API scaffolding | A | All API routes | Business logic |
| Test structure | B+ | Test setup, assertions | Edge cases, test data |
| TypeScript types | A | Type definitions | Complex business types |
| Design patterns | A | Component structure | Specific optimizations |
| **Business logic** | **D** | **Never** | **Always** |
| **Strategy decisions** | **D+** | **Never** | **Always** |
| **Domain-specific tech** | **C** | **Rarely** | **Usually** |

---

## What I Learned About Using AI in a Startup

### Principle 1: Use AI for Execution, Not Strategy

AI excels at:
- Generating working code quickly
- Brainstorming copy options
- Explaining patterns
- Documenting decisions

AI fails at:
- Making business decisions
- Writing business logic
- Strategic positioning
- Edge case thinking

**Rule of thumb:** If it's decision-making, do it yourself. If it's execution, let AI accelerate.

---

### Principle 2: AI Saves the Most Time on Boring Tasks

**High ROI AI usage:**
- Writing boilerplate test setup
- Generating Zod validation schemas
- API route scaffolding
- Documentation outlines

**Low/Negative ROI AI usage:**
- Writing recommendation rules
- Designing database schemas
- Making product decisions
- Writing core business logic

**Best use case:** "I know what I want to build. AI, write the scaffolding fast." (45 min → 10 min)

---

### Principle 3: Always Iterate AI Output

AI rarely ships as-is. Every AI-generated piece needed iteration:
- Copy was generic (rewrote for voice)
- Tests were missing edge cases (added comprehensively)
- Code was correct but unoptimized (optimized)
- Documentation was skeletal (filled with domain knowledge)

**Estimate:** Every 100 lines of AI code required 10-20 lines of human iteration/fixes.

---

### Principle 4: Document Your Overrides

Where I diverged from AI suggestions and why:
- **Rules engine:** "AI suggested ML. I chose rule-based for explainability."
- **Database:** "AI over-normalized. I used JSONB for flexibility."
- **Pricing model:** "AI suggested SaaS-only. I chose freemium for growth."

These divergences often reveal important insights about your product.

---

## Honest Assessment: How Much Did AI Help?

**Total development time: 73 hours**

**Time AI saved (estimate):**
- Boilerplate code: +2 hours saved
- Test setup: +1.5 hours saved
- API scaffolding: +2 hours saved
- Documentation structure: +0.5 hours saved
- **Total: ~6 hours saved (8% productivity boost)**

**Time AI cost (debugging/iteration):**
- Over-engineered architecture: -1 hour to simplify
- Missing edge cases in tests: -1.5 hours to add coverage
- Generic copy (had to rewrite): -1 hour to get right
- **Total: -3.5 hours cost**

**Net AI benefit: ~2.5 hours (3% total productivity gain)**

**Reality:** If I built StackSpend without AI, it would've taken ~75-76 hours instead of 73. Not a game-changer. AI is a productivity multiplier, not a time multiplier.

---

## Recommendation: When To Use AI in Startups

### DO Use AI For:
✓ Boilerplate & scaffolding (APIs, tests, types)  
✓ Documentation outlines & frameworks  
✓ Copy brainstorming & first drafts  
✓ Explaining patterns & best practices  
✓ Rubber-ducking (explain problem to AI, find solution yourself)

### DON'T Use AI For:
✗ Core business logic & algorithms  
✗ Strategic decisions (positioning, GTM, pricing)  
✗ Security-critical code (auth, data protection)  
✗ Edge case & error handling  
✗ Complex domain-specific systems  

### Maybe Use AI For:
? Database schema (let it suggest, you decide)  
? Feature prioritization (get ideas, you decide)  
? Naming things (generate options, you pick)  
? Refactoring suggestions (consider them, you evaluate)

---

## Transparency Statement for Submission

If asked about AI usage in my submission:

**Honest answer:**
"I used ChatGPT-4 for boilerplate code generation, test structure, and documentation outlines. These accelerated execution but represented maybe 3-5% of total value. All core logic—the audit engine, business rules, product decisions, and strategic thinking—were 100% my own work. I document where AI helped and where I overrode AI suggestions. The product is mine; AI was a tool that accelerated certain execution tasks."

---

## Files Generated With AI Help

| File | % AI | % Human | Quality |
|------|------|---------|---------|
| API routes | 70% | 30% | A |
| Zod schemas | 80% | 20% | A |
| Test structure | 50% | 50% | A |
| ARCHITECTURE.md | 30% | 70% | A |
| DEVLOG.md | 20% | 80% | A |
| REFLECTION.md | 10% | 90% | A |
| Recommendation rules | 5% | 95% | A |
| GTM.md | 0% | 100% | A |
| UI Components | 0% | 100% | A |

---

## Key Takeaway

AI is a productivity tool for execution, not a substitute for thinking. It's best used for:
- "Help me scaffold this quickly"
- "Generate options for me to evaluate"
- "Explain this pattern to me"

It's worst for:
- "Make this decision for me"
- "Write my business logic"
- "Figure out my strategy"

**My recommendation:** Use AI confidently for execution. Think carefully for everything else.


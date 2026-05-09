# StackSpend System Architecture

## Executive Summary

StackSpend is a **single-player SaaS** (no auth required) that audits AI tool spending, generates recommendations, and produces shareable reports.

**Architecture principles:**
- Stateless API design (audit processing is idempotent)
- Type-safe end-to-end (TypeScript from frontend to DB)
- Minimal dependencies (Next.js + Supabase + shadcn/ui)
- Privacy-first (no tracking, no PII in public reports)
- Scaling-ready (stateless functions, database indexing)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│  Landing → Audit Form → Results → Public Report Share               │
└──────────┬──────────────────────────────────────────────────────────┘
           │
           │ POST /api/audit
           │ POST /api/lead
           │ GET /api/report/[id]
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                                │
│  • Validation (Zod schemas)                                          │
│  • Audit engine invocation                                           │
│  • Error handling & logging                                          │
└──────────┬──────────────────────────────────────────────────────────┘
           │
           │ Query / Insert
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE POSTGRES                               │
│  Tables: audits, leads, audit_inputs                                │
│  RLS Policies: is_public checks for report access                   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    IN-MEMORY MODULES                                  │
│  • Pricing Data (cached on server)                                   │
│  • Audit Engine (40+ rules)                                          │
│  • Type Definitions & Validators                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Complete User Flow

### Flow 1: Run Audit → View Results

```
1. User lands on /
   └─> Sees hero, problem statement, CTA "Start Free Audit"

2. User clicks CTA → Navigate to /audit
   └─> Form rendered with:
       • Team size selector (5-50, 50-100, 100+)
       • Team type dropdown (startup, scale-up, enterprise)
       • Use case (cost control, feature unlock, consolidation)
       • Pain point selector
       • Tool selector table (rows: ChatGPT, Claude, Cursor, etc.)
       • For each tool: plan dropdown + monthly spend input

3. User fills form → Clicks "Generate Audit"
   └─> Frontend validates form
   └─> Sets isLoading = true
   └─> POST /api/audit with:
       {
         teamProfile: { size, teamType, useCase, painPoint },
         tools: [
           { toolId: "chatgpt", plan: "pro", monthlySpend: 30, seats: 3 },
           ...
         ]
       }

4. Server receives /api/audit POST
   └─> Validate input (Zod schema)
   └─> Call generateAudit() from audit-engine
   └─> Engine runs 40+ rules:
       • Downsizing rules (small teams don't need enterprise)
       • Consolidation logic (Claude + ChatGPT overlap)
       • Seat optimization
       • Confidence scoring
   └─> Generate unique report ID (UUID v4)
   └─> Save to Supabase:
       INSERT INTO audits (
         id, team_size, team_type, summary, annual_savings, 
         current_monthly_spend, optimized_monthly_spend, 
         recommendations (JSON), is_public, created_at
       )
   └─> Return { reportId, auditResult }

5. Frontend receives response
   └─> Save auditId to localStorage
   └─> Redirect to /results

6. Results page (/results)
   └─> Load auditId from localStorage
   └─> GET /api/report/:auditId
   └─> Render:
       • "Annual Savings: $12,000"
       • "Monthly Savings: $1,000"
       • Recommendations breakdown (tool by tool)
       • "Already optimized tools" badge
       • "Share this report" CTA
       • Optional: Lead capture email form

7. User sees lead capture
   └─> Optionally enters: email, company, team_size
   └─> Frontend validates email format
   └─> POST /api/lead
   └─> Server:
       • Checks honeypot field (must be empty)
       • Validates email with regex
       • Checks for duplicate email (optional)
       • INSERT INTO leads (email, company, role, created_at)
       • Return success
   └─> Frontend shows "Thanks! Check your email"
```

### Flow 2: Share Public Report

```
1. From results page, user clicks "Share Report"
   └─> Copy link: https://stackspend.vercel.app/report/abc123def456

2. User sends link to stakeholder (Slack, email, etc.)
   └─> Stakeholder clicks link

3. Stakeholder lands on /report/[id]
   └─> Browser requests page
   └─> Next.js renders component
   └─> Component calls GET /api/report/[id]
   └─> Server:
       • Query audits WHERE id = [id]
       • Check RLS: is_public = true
       • Increment view_count
       • Return full audit result
   └─> Component renders full report:
       • Team profile (no email, no personal data)
       • Savings breakdown
       • Tool-by-tool recommendations
       • "Run your own audit" CTA

4. Stakeholder sees report
   └─> Can share again, can't edit
   └─> If interested, clicks "Start Free Audit"
   └─> Loop back to Flow 1
```

### Flow 3: Data Persistence & Retrieval

```
Frontend (React)
├─> User submits audit form
└─> POST /api/audit
    └─> Next.js API Route Handler
        ├─> Input validation
        ├─> Call auditEngine.generateAudit()
        ├─> Initialize report ID
        └─> Supabase.from('audits').insert({
            id: reportId,
            team_size: 12,
            team_type: 'startup',
            use_case: 'cost_control',
            pain_point: 'overlapping_tools',
            tools_submitted: [{ toolId, plan, spend }],
            current_monthly_spend: 1240,
            optimized_monthly_spend: 860,
            annual_savings: 4560,
            monthly_savings: 380,
            savings_rate: 31,
            summary: "Your team is overpaying...",
            recommendations: [
              {
                tool_name: 'ChatGPT',
                current_plan: 'Team Pro',
                recommended_plan: 'Pro',
                monthly_savings: 150,
                reason: "Pro plan sufficient for team usage",
                actions: ["Downgrade to Pro", "No feature loss"]
              },
              ...
            ],
            is_public: false,
            created_at: NOW(),
            view_count: 0
          })

Results Page (/results)
├─> Load from localStorage: { auditId }
├─> GET /api/report/:auditId
└─> Supabase.from('audits')
    .select('*')
    .eq('id', auditId)
    └─> Return full audit record
    └─> Component renders saved data

Public Report Page (/report/[id])
├─> Route parameter: [id] = reportId
├─> GET /api/report/:id
└─> Supabase RLS check: is_public = true
    ├─> Increment view_count
    └─> Return full audit record
    └─> Component renders public view (no edit buttons)
```

---

## Database Schema

### `audits` Table

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Team context
  team_size INTEGER NOT NULL,
  team_type VARCHAR(50) NOT NULL, -- 'startup', 'scaleup', 'enterprise'
  use_case VARCHAR(50), -- 'cost_control', 'feature_unlock', 'consolidation'
  pain_point VARCHAR(100),
  
  -- Submitted tools & spend
  tools_submitted JSONB NOT NULL, -- [{ toolId, plan, monthlySpend, seats }]
  current_monthly_spend DECIMAL(10, 2) NOT NULL,
  current_annual_spend DECIMAL(10, 2) GENERATED AS (current_monthly_spend * 12),
  
  -- Audit results
  optimized_monthly_spend DECIMAL(10, 2) NOT NULL,
  optimized_annual_spend DECIMAL(10, 2) GENERATED AS (optimized_monthly_spend * 12),
  monthly_savings DECIMAL(10, 2) GENERATED AS (current_monthly_spend - optimized_monthly_spend),
  annual_savings DECIMAL(10, 2) GENERATED AS ((current_monthly_spend - optimized_monthly_spend) * 12),
  savings_rate INTEGER NOT NULL, -- percentage
  
  -- Summary & recommendations
  summary TEXT NOT NULL,
  recommendations JSONB NOT NULL, -- [{ tool_name, current_plan, recommended_plan, monthly_savings, reason, actions }]
  tools_already_optimized INTEGER DEFAULT 0,
  total_tools INTEGER DEFAULT 0,
  overall_confidence VARCHAR(20) DEFAULT 'high', -- 'high', 'moderate', 'low'
  
  -- Sharing & privacy
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_audits_is_public ON audits(is_public);
CREATE INDEX idx_audits_team_size ON audits(team_size);
```

### `leads` Table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255),
  role VARCHAR(100),
  team_size INTEGER,
  
  -- Honeypot
  phone_field VARCHAR(255), -- Should be empty
  
  -- Source
  audit_id UUID REFERENCES audits(id) ON DELETE SET NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_audit_id ON leads(audit_id);
```

### RLS Policies

```sql
-- Anyone can read public audits
CREATE POLICY "Enable read access for public audits"
ON audits FOR SELECT
USING (is_public = true);

-- Only the session owner can read their own audit (if needed)
CREATE POLICY "Enable read access for own audits"
ON audits FOR SELECT
USING (auth.uid() = user_id); -- Future: add user_id column

-- Lead capture allows unauthenticated inserts
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all"
ON leads FOR INSERT
WITH CHECK (true);
```

---

## API Routes

### POST /api/audit

**Purpose:** Receive user input, run audit engine, save to DB, return report ID.

**Request:**
```json
{
  "teamProfile": {
    "size": 12,
    "teamType": "startup",
    "useCase": "cost_control",
    "painPoint": "overlapping_tools"
  },
  "tools": [
    {
      "toolId": "chatgpt",
      "plan": "team_pro",
      "monthlySpend": 50,
      "seats": 3
    }
  ]
}
```

**Validation:**
- Team size: 1-1000
- Monthly spend: 0-100000
- Tool IDs must exist in pricing database
- Plans must be valid for that tool

**Processing:**
1. Validate input (Zod schema)
2. Call `generateAudit(teamProfile, tools)`
3. Generate UUID for report ID
4. Save to `audits` table
5. Return `{ reportId, auditResult }`

**Response:**
```json
{
  "reportId": "550e8400-e29b-41d4-a716-446655440000",
  "auditResult": {
    "teamProfile": { ... },
    "currentMonthlySpend": 200,
    "optimizedMonthlySpend": 140,
    "annualSavings": 720,
    "savingsPercentage": 30,
    "summary": "Your team is overpaying...",
    "recommendations": [ ... ],
    "timestamp": "2024-05-15T10:30:00Z"
  }
}
```

**Error Handling:**
- 400 Bad Request (validation failed)
- 500 Internal Server Error (DB error, audit engine crash)
- 429 Too Many Requests (rate limit, future)

---

### GET /api/report/:id

**Purpose:** Fetch a public report by ID (for public report page).

**Request:**
```
GET /api/report/550e8400-e29b-41d4-a716-446655440000
```

**Processing:**
1. Query `audits` WHERE `id = :id`
2. Check `is_public = true` (via RLS)
3. Increment `view_count`
4. Return full audit record

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "teamSize": 12,
  "teamType": "startup",
  "annualSavings": 4560,
  "recommendations": [ ... ],
  "viewCount": 42,
  "createdAt": "2024-05-15T10:30:00Z"
}
```

**Error Handling:**
- 404 Not Found (report doesn't exist)
- 403 Forbidden (report is private)
- 500 Internal Server Error (DB error)

---

### POST /api/lead

**Purpose:** Capture lead email for follow-up.

**Request:**
```json
{
  "email": "user@company.com",
  "company": "Acme Corp",
  "role": "engineering_manager",
  "teamSize": 12,
  "phoneField": "", // honeypot
  "auditId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validation:**
- Email valid format
- Phone field must be empty (honeypot)
- Optional: check for duplicate email
- Audit ID must exist (optional)

**Processing:**
1. Validate input
2. Check honeypot (phoneField === "")
3. Optional: rate limit by IP
4. INSERT INTO `leads`
5. Return success

**Response:**
```json
{
  "success": true,
  "message": "Lead captured. Check your email!"
}
```

**Error Handling:**
- 400 Bad Request (validation failed)
- 429 Too Many Requests (rate limited)
- 500 Internal Server Error (DB error)

---

## Audit Engine Deep Dive

### Overview

The audit engine is a **decision tree engine** that applies 40+ rules to recommend optimal AI tool plans for a given team.

**Input:** Team profile + current tools + spend  
**Output:** Recommendations with confidence scores

### Rule Categories

#### 1. Downsizing Rules (10 rules)

For small teams (5-20 people), premium plans are often overkill.

```javascript
// Rule: ChatGPT Team Pro → Pro for <15 person teams
if (teamSize < 15 && currentPlan === 'team_pro') {
  recommendPlan = 'pro';
  monthlySavings = 30; // $50 → $20
  confidence = 'high';
  reason = "Pro plan sufficient for small team usage";
}
```

#### 2. Consolidation Rules (8 rules)

Detect overlapping tool functionality and recommend consolidation.

```javascript
// Rule: If using both ChatGPT + Claude, consider single-tool focus
if (hasToolAndSpend('chatgpt', '>30') && hasToolAndSpend('claude', '>30')) {
  recommendation = {
    action: 'consolidate',
    option1: { tool: 'chatgpt', monthlySavings: 20 },
    option2: { tool: 'claude', monthlySavings: 20 },
    reason: "ChatGPT + Claude serve similar use cases; pick primary"
  }
}
```

#### 3. Seat Optimization Rules (12 rules)

Right-size seats to actual usage.

```javascript
// Rule: If 8 seats but only 3 use tool, downsize
if (seats > actualUsers * 2 && toolUsage === 'medium') {
  recommendSeats = Math.ceil(actualUsers * 1.5); // Buffer for growth
  monthlySavings = (seats - recommendSeats) * seatCost;
  confidence = 'moderate'; // Some uncertainty in actual usage
}
```

#### 4. Feature Parity Rules (5 rules)

Some features don't justify the premium.

```javascript
// Rule: API access is niche; most teams need UI
if (currentPlan === 'api_dedicated' && useCase !== 'api_integration') {
  recommendation = {
    action: 'switch_to_ui',
    monthlySavings: 400,
    reason: "API plan for non-API use case"
  }
}
```

#### 5. Growth-Conscious Rules (5 rules)

Flag recommendations that might constrain future growth.

```javascript
// Rule: If team growing 50%+ YoY, flagging downsizes as moderate confidence
if (teamGrowthRate > 0.4 && recommendation.action === 'downsize') {
  recommendation.confidence = 'moderate';
  recommendation.note = "Team growing rapidly; revisit in 3 months";
}
```

### Confidence Scoring

Every recommendation gets a confidence level:

- **High confidence:** Downsizing obvious, no growth signals, spending 2x peer average
- **Moderate confidence:** Some uncertainty, plan still applies but with caveats
- **Low confidence:** Niche use case, custom requirements, user should validate

### Engine Code Structure

```typescript
// lib/audit-engine.ts

export function generateAudit(input: AuditInput): FullAuditResult {
  const recommendations = [];
  
  // Apply rule categories
  recommendations.push(...applyDownsizingRules(input));
  recommendations.push(...applyConsolidationRules(input));
  recommendations.push(...applySeatOptimizationRules(input));
  recommendations.push(...applyFeatureParityRules(input));
  recommendations.push(...applyGrowthConsciousRules(input));
  
  // Filter out zero-savings recommendations
  const significantRecs = recommendations.filter(r => r.monthlySavings > 0);
  
  // Calculate aggregates
  const totalMonthlySavings = significantRecs.reduce((sum, r) => sum + r.monthlySavings, 0);
  const annualSavings = totalMonthlySavings * 12;
  const savingsPercentage = (totalMonthlySavings / currentMonthlySpend) * 100;
  
  return {
    teamProfile: input.teamProfile,
    currentMonthlySpend: input.currentMonthlySpend,
    optimizedMonthlySpend: input.currentMonthlySpend - totalMonthlySavings,
    annualSavings: annualSavings,
    monthlySavings: totalMonthlySavings,
    savingsPercentage: Math.round(savingsPercentage),
    recommendations: significantRecs,
    toolsAlreadyOptimized: toolsWithNoRecs,
    overallConfidence: calculateOverallConfidence(significantRecs),
    summary: generateSummaryText(significantRecs, totalMonthlySavings),
    timestamp: new Date().toISOString()
  };
}
```

---

## Scaling Strategy

### Current State (MVP)
- Single Vercel instance
- Supabase free tier (500MB storage, 2GB downloads)
- 100-200 daily active audits
- Full in-memory audit engine

### Phase 1: Scale to 1k Audits/Day
- **Caching:**
  - Redis (Upstash) for pricing data (TTL: 1 day)
  - Cloudflare Workers for static asset caching
- **Database:**
  - Add indexes: `(created_at DESC)`, `(is_public)`
  - Supabase connection pooling
  - Move to Pro tier ($25/month)

### Phase 2: Scale to 10k Audits/Day
- **Edge computing:**
  - Audit engine runs on Vercel Edge Functions
  - Reduced latency for cold regions
- **Database:**
  - Read replicas for analytics queries
  - Separate read pool for public reports
  - Row compression for JSONB recommendations
- **Caching:**
  - CDN caching for public report pages (Cache-Control: public, max-age=3600)
  - Report metadata cached in Redis
- **Monitoring:**
  - Datadog for performance tracking
  - Sentry for error tracking
  - Custom metrics for audit funnel

### Phase 3: Scale to 100k+ Audits/Day
- **Distributed audit processing:**
  - Queue system (Bull + Redis) for async audits
  - Audit jobs pushed to background workers
- **Data warehouse:**
  - Sync audits/leads to Snowflake for analytics
  - Real-time dashboards for founders
- **Multi-region:**
  - Replicate Supabase to multiple regions
  - Vercel serverless in 4+ regions
- **Advanced RLS:**
  - Team-based access (when multi-team feature launches)
  - Custom role-based security

---

## Security & Privacy

### Input Validation
- **Zod schemas** for all API inputs
- **Rate limiting** (future: Vercel Analytics to detect abuse)
- **Honeypot field** in lead capture form to stop bots

### Data Privacy
- **No PII in public reports** — only aggregated team data (size, type, spend ranges)
- **No tracking pixels** — no analytics cookies
- **HTTPS only** — all communication encrypted
- **RLS policies** — database enforces public/private separation
- **No third-party cookies** — privacy-first by design

### SQL Injection Prevention
- Parameterized queries via Supabase PostgREST
- Zod validation before any DB query
- No string concatenation in SQL

### CSRF Protection
- Next.js automatic CSRF prevention for API routes
- Content-Type validation

---

## Performance Optimizations

### Frontend
- **Code splitting:** Lazy load audit form on demand
- **Image optimization:** Next.js Image component with WebP
- **CSS:** Tailwind v4 with CSS variables (minimal bundle)
- **Fonts:** System fonts (no external font requests)

### Backend
- **API route caching:** Vercel caches stable responses (pricing data)
- **Database query optimization:** Minimal SELECT fields, index on frequently filtered columns
- **JSON compression:** Recommendations stored as JSONB (native compression in Postgres)

### Database
- **Connection pooling:** Vercel + Supabase managed connection pool
- **Lazy loading:** Don't fetch recommendations until needed
- **Pagination:** Public reports API supports offset/limit (future)

---

## Future Architecture Changes

### Multi-Tenancy (Phase 3)
When teams can manage multiple audits:

```sql
-- Add user auth
ALTER TABLE audits ADD COLUMN user_id UUID REFERENCES auth.users;

-- Add team table
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name VARCHAR(255),
  created_at TIMESTAMP
);

-- Add team_id to audits
ALTER TABLE audits ADD COLUMN team_id UUID REFERENCES teams;
```

### Real-Time Sync (Phase 2)
Stripe integration to auto-detect actual spending:

```typescript
// /api/sync/stripe
// Fetch from Stripe API
// Compare with submitted spend
// Generate delta report
// Recommend based on reality
```

### Audit Versioning (Phase 2)
Track changes over time:

```sql
ALTER TABLE audits ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE audits ADD COLUMN parent_audit_id UUID REFERENCES audits;

-- Audits with parent_id are "re-audits" of existing reports
```

---

## Decision Log

### Why Next.js App Router?
- File-based routing matches product structure (landing, audit, results, report)
- Server components reduce JS bundle size
- API routes colocated with features
- Vercel deployment is seamless

### Why Supabase + Postgres over Firebase?
- Postgres is battle-tested at scale
- RLS policies are powerful and explicit
- PostgREST API is auto-generated and fast
- SQL is easier to optimize than Firestore
- Cost scales predictably (vs. Firebase's per-operation pricing)

### Why no auth on MVP?
- Single-player SaaS requires no auth
- Public reports drive viral adoption
- Friction reduction = higher audit completion rate
- Auth added in Phase 2 (when multi-team feature launches)

### Why not use OpenAI/ML for recommendations?
- Need explainable, rule-based recommendations
- Financial decisions require transparency
- Avoid ML hallucination risk
- Easier to iterate based on user feedback
- Faster iteration (no training loops)

---

## Monitoring & Observability

### Metrics to Track
- **Audit funnel:** visits → form starts → completions → leads
- **API latency:** audit generation time, report fetch time
- **Error rates:** validation errors, DB errors, 5xx errors
- **User behavior:** share rate, public report views, lead conversion

### Tools
- **Vercel Analytics** for performance and traffic
- **Supabase logs** for SQL queries and errors
- **Sentry** for exception tracking (future)
- **Custom dashboard** in Vercel UI for funnel metrics

---

## Questions & Design Rationales

**Q: Why not use tRPC?**  
A: Overkill for MVP. REST API is simpler, more standard, easier to debug.

**Q: Why store recommendations as JSONB in DB?**  
A: Flexibility for schema changes without migrations. Recommendations may evolve as we add more rules.

**Q: Why public reports without auth?**  
A: Viral mechanics + low friction. Everyone has a unique public link. Auth is added when workspace features launch.

**Q: Why no real-time updates?**  
A: Audit generation is one-shot. No live collaboration. Real-time would be premature optimization.

**Q: Why Vercel Edge Functions for future scaling?**  
A: Audit engine is stateless and pure compute. Edge functions reduce latency for cold regions. Cost scales with CPU time, not concurrency.


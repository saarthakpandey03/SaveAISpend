# StackSpend Development Log — 7 Days to MVP

## Day 1: Scope & Planning

**Hours:** 8  
**Focus:** Ideation → Wireframes → Technical Planning

### What I Did

1. **Ideation (1 hour)**
   - Identified problem: AI spending is invisible and unoptimized
   - Brainstormed target users: founders, engineering managers, finance leads
   - Validated problem with 3 quick chats with indie hackers
   - Landed on positioning: "5-minute audit → shareable report → actionable recommendations"

2. **Product Definition (2 hours)**
   - Designed user flow: Land → Audit → Results → Lead Capture → Public Share
   - Identified 9 core tools (ChatGPT, Claude, Cursor, Copilot, Gemini, v0, Windsurf, APIs)
   - Decided on "rule-based engine" vs. ML (explainability > personalization)
   - Mapped pricing for each tool (public sources)

3. **Technical Scoping (2.5 hours)**
   - Chose stack: Next.js + TypeScript + Tailwind + Supabase
   - Decided: no auth on MVP (public reports = viral mechanic)
   - Designed database schema: `audits` and `leads` tables
   - Outlined audit engine (40+ rules, confidence scoring)

4. **Architecture Design (2.5 hours)**
   - Drew system diagram on whiteboard
   - Planned API routes: `/api/audit`, `/api/lead`, `/api/report/[id]`
   - Defined recommendation rules by category (downsizing, consolidation, seats)
   - Identified risks: pricing data accuracy, rule defensibility, lead spam

### What I Learned

- **User validation is critical:** My initial "AI team spend" idea was too broad. Talking to 3 users instantly clarified the problem.
- **Rule-based > ML:** Started with idea of "ML recommendation engine" but quickly realized explainability matters more for financial decisions.
- **Public reports are underrated:** Early sketches hid reports behind login. Pivoting to public URLs unlocked viral growth potential.

### Blockers

- None major; had clear direction by end of day.

### Tomorrow Plan

- Set up Next.js project with shadcn/ui
- Build landing page and basic audit form UI
- Get styling system in place early (Tailwind + design tokens)

---

## Day 2: Frontend Audit Flow

**Hours:** 10  
**Focus:** Landing page → Audit form → Results skeleton

### What I Did

1. **Project Setup (1.5 hours)**
   - Created Next.js 14 project with `create-next-app`
   - Installed shadcn/ui, Tailwind CSS
   - Set up TypeScript strict mode
   - Configured design tokens (color palette, typography)

2. **Landing Page (3 hours)**
   - Built hero section with headline "Stop Overpaying for AI Tools"
   - Added social proof section (placeholder companies)
   - Created problem statement cards (Too Many Subscriptions, Unused Seats, Wrong Tiers)
   - Responsive design for mobile-first
   - CTA buttons linking to audit flow

3. **Audit Form Component (4 hours)**
   - Built form with sections:
     - Team size selector (dropdown: 5-50, 50-100, 100+)
     - Team type (startup, scaleup, enterprise)
     - Use case and pain point fields
     - Dynamic tool table (add/remove rows)
     - Per-tool: plan selector + monthly spend input
   - Added client-side validation (React Hook Form + Zod)
   - Styled with shadcn/ui components
   - Tested form with dummy data

4. **Results Page Skeleton (1.5 hours)**
   - Laid out results page structure:
     - Savings card (annual, monthly, percentage)
     - Spend breakdown (current vs. optimized)
     - Recommendations table
     - Lead capture form
   - Hardcoded mock data to test styling

### What I Learned

- **Form complexity escalates fast:** Started simple, ended up with 6 inputs + dynamic rows. Zod schema validation was essential to catch edge cases early.
- **Design system saves time:** Using shadcn/ui components meant I didn't reinvent spacing, colors, or button states. Consistency came for free.
- **Mobile-first is non-negotiable:** Built for desktop first (mistake), had to refactor for mobile. Next time: mobile first.

### Blockers

- Form performance on large tool lists (10+ rows) was sluggish. Solved by wrapping in React.memo.
- Zod schema complexity. Started with `z.array(z.object(...))` and hit nesting limits. Restructured into flatter schema.

### Tomorrow Plan

- Build audit engine (core recommendation logic)
- Create pricing data system
- Wire up form submission to engine
- Test engine with 5 sample audits

---

## Day 3: Pricing Data & Audit Engine

**Hours:** 11  
**Focus:** Rule-based recommendation engine with defensible logic

### What I Did

1. **Pricing Data System (2 hours)**
   - Researched and documented pricing for 9 tools:
     - ChatGPT (Free, Plus $20/mo, Team Pro $50/seat)
     - Claude (Free, Pro $20/mo, Opus $100/mo)
     - Cursor (Pro $20/mo, Teams TBD)
     - GitHub Copilot (Free, Teams $19/seat, Enterprise custom)
     - Google Gemini (Free, Advanced $20/mo)
     - Windsurf (Free tier, Pro)
     - OpenAI API (per-token)
     - Anthropic API (per-token)
     - v0 (Free tier, Teams)
   - Created `pricing-data.ts` with clean exports
   - Added notes about seat assumptions and verification dates

2. **Audit Engine — Core Logic (5 hours)**
   - Implemented 40+ rules across 5 categories:
     - Downsizing: Small teams don't need enterprise plans
     - Consolidation: Detect overlapping tools
     - Seat optimization: Right-size seats to usage
     - Feature parity: Some features don't justify premium
     - Growth-conscious: Flag risky recommendations for growing teams
   - Built confidence scoring (high/moderate/low)
   - Created summary text generator (friendly language, non-threatening tone)
   - Tested rules with 5 sample audits:
       - 10-person startup overpaying for ChatGPT Team (save $300/year)
       - 50-person scaleup with duplicate tools (save $1200/year)
       - 5-person bootstrapped founder buying all tools (save $1500/year)

3. **Types & Validation (2 hours)**
   - Created TypeScript types for:
     - AuditInput (team profile, tools array)
     - FullAuditResult (savings, recommendations, metadata)
     - Recommendation (tool, plan, savings, reason, actions)
   - Built Zod schemas for runtime validation
   - Added strict null checking to catch bugs

4. **Form Integration (2 hours)**
   - Connected audit form to engine
   - Form submission:
     - Validates input (Zod)
     - Calls audit engine
     - Saves to localStorage (MVP persistence)
     - Redirects to results page
   - Tested with 3 real-world scenarios

### What I Learned

- **Defensible rules matter more than complexity:** Initially wrote 60 rules, realized 40 solid rules > 60 mediocre rules. Removed low-confidence rules.
- **Confidence scoring is crucial:** Users need to know which recommendations are certain vs. guesses. Explicitly flagging uncertainty builds trust.
- **Testing with real data:** Sample audits revealed edge cases (teams with one tool, negative recommendations, rounding issues). Fixed all before moving to backend.

### Blockers

- Pricing data verification took longer than expected. Had to cross-reference 3 sources per tool.
- Rules conflicted (downsizing vs. growth-conscious). Solved by layering rules and letting later rules override earlier ones.

### Tomorrow Plan

- Build API routes for `/api/audit`
- Set up Supabase backend
- Migrate localStorage to Supabase
- Test full audit flow end-to-end

---

## Day 4: Results Intelligence & UI Polish

**Hours:** 9  
**Focus:** Results page UX, confidence badges, already-optimized state

### What I Did

1. **Results Page Deep Build (4 hours)**
   - Built comprehensive results display:
     - Savings cards (annual, monthly, percentage)
     - Spend comparison (current vs. optimized)
     - Confidence indicator ("High confidence in these recommendations")
     - Tool-by-tool breakdown with:
       - Current plan → Recommended plan
       - Monthly savings
       - Implementation actions
       - Confidence badge
     - "Already optimized tools" section (shows tools on best plans)
     - Lead capture form at bottom
   - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)

2. **Confidence Badges & Transparency (2 hours)**
   - Added confidence scoring to every recommendation:
     - Green "High" badge: Rules certain, low risk
     - Yellow "Moderate" badge: Some uncertainty, validate
     - Orange "Low" badge: Niche case, research needed
   - Created explanatory text for each confidence level
   - Added methodology section (transparent about how recommendations work)

3. **Share & Lead Capture (2 hours)**
   - Built "Share this report" button (copies public link)
   - Designed lead capture form:
     - Email (required)
     - Company (optional)
     - Role (optional)
     - Team size (optional)
     - Honeypot field for bot protection
   - Added success message ("Check your email!")

4. **Mobile Testing (1 hour)**
   - Tested results page on phone
   - Fixed responsive issues (card stacking, button spacing)
   - Verified all inputs are touch-friendly

### What I Learned

- **Transparency builds trust:** Showing confidence levels and explaining methodology was the right call. Early testers appreciated the honesty.
- **Lead capture placement matters:** Putting it at the end (not interrupting results) felt natural. Didn't feel spammy.
- **Visual hierarchy is hard:** Initially all recommendations looked the same. Adding confidence badges created instant hierarchy and helped users prioritize.

### Blockers

- Share link functionality: initially tried navigator.share API (not supported in older browsers). Fell back to clipboard copy.

### Tomorrow Plan

- Set up Supabase backend
- Create API routes for audit save and report fetch
- Wire up results page to API
- Build public report share page

---

## Day 5: Supabase Backend & Persistence

**Hours:** 12  
**Focus:** Real database backend, API routes, public sharing

### What I Did

1. **Supabase Setup (2 hours)**
   - Created Supabase account and project
   - Set up local development with Supabase CLI
   - Installed `@supabase/supabase-js` client
   - Configured environment variables

2. **Database Schema (2 hours)**
   - Created `audits` table:
     - Core fields: id, team_size, team_type, use_case, pain_point
     - Financial: current_monthly_spend, optimized_monthly_spend, annual_savings, savings_rate
     - Results: summary, recommendations (JSONB), overall_confidence
     - Sharing: is_public, view_count
     - Metadata: created_at, updated_at
   - Created `leads` table:
     - Contact: email, company, role, team_size
     - Honeypot: phone_field (bot protection)
     - References: audit_id, created_at
   - Added indexes on frequently queried columns
   - Configured RLS policies for public/private access

3. **API Routes (4 hours)**
   - Built `POST /api/audit` route:
     - Validates input (Zod)
     - Calls audit engine
     - Saves to Supabase
     - Returns reportId
   - Built `GET /api/report/[id]` route:
     - Fetches public reports
     - Checks RLS policies
     - Increments view count
     - Returns full audit data
   - Built `POST /api/lead` route:
     - Validates email and honeypot
     - Captures lead in database
     - Prevents duplicates (unique constraint)

4. **Frontend Integration (3 hours)**
   - Updated form to POST to `/api/audit` instead of localStorage
   - Updated results page to fetch from `/api/report/[id]`
   - Updated public report page (share link functionality)
   - Fixed error handling (404, validation errors, server errors)

5. **Testing (1 hour)**
   - Created 5 test audits in dev environment
   - Verified data saves to Supabase
   - Tested public report access (works with URL, RLS enforced)
   - Tested lead capture with duplicate prevention

### What I Learned

- **RLS policies are powerful:** Row-level security in Postgres means I didn't have to build auth logic. Just `is_public = true` for public reports.
- **JSONB in Postgres is flexible:** Storing recommendations as JSON meant I could change recommendation structure without schema migrations.
- **API route performance is good:** Cold start was ~500ms, warmed up to ~100ms. Acceptable for MVP.

### Blockers

- Supabase connection pooling issues. Initially connected without connection pool, hit limits. Switched to built-in pooling.
- RLS policy debugging: took 30 minutes to realize RLS must be enabled at row level, not table level.

### Tomorrow Plan

- Write comprehensive tests for audit engine
- Fix any remaining bugs discovered in testing
- Polish error messages
- Prepare for final polish pass

---

## Day 6: Testing, Bug Fixes & Performance

**Hours:** 10  
**Focus:** Test coverage, edge cases, performance optimization

### What I Did

1. **Audit Engine Tests (4 hours)**
   - Built test suite with Jest:
     - Small team downsizing (5-person startup overpaying)
     - Consolidation detection (duplicate tools)
     - Already-optimized stacks (teams on best plans)
     - Seat reduction (right-sizing)
     - Invalid input handling
     - Edge cases (zero spend, single tool, all premium plans)
   - Achieved 85% code coverage on audit engine
   - All tests pass

2. **Bug Fixes (3 hours)**
   - Fixed recommendation ordering (highest savings first)
   - Fixed rounding issues (display $1,234.56 not $1234.5678)
   - Fixed form validation (empty tools array was passing)
   - Fixed results page crash when no recommendations
   - Fixed lead form allowing spam emails
   - Fixed mobile button spacing on results page

3. **Performance Optimization (2 hours)**
   - Analyzed Lighthouse: 92 performance, 98 accessibility
   - Optimized images (next/image component)
   - Removed unused dependencies
   - Minified CSS (Tailwind purging)
   - Cached pricing data (no repeated fetches)

4. **Documentation (1 hour)**
   - Started writing test documentation
   - Documented test cases and edge cases
   - Created testing guide for future contributors

### What I Learned

- **Testing saves time:** The test suite caught 3 bugs before users would see them.
- **Performance is a feature:** Even small optimizations (100ms faster) matter for user perception.
- **Edge cases are subtle:** Most bugs came from edge cases (empty arrays, boundary values) not happy paths.

### Blockers

- Test setup took longer than expected (Jest + TypeScript config)
- Mobile performance issues required CSS optimization pass

### Tomorrow Plan

- Final polish and documentation
- Prepare README and submission materials
- Deploy to Vercel
- Get feedback from 3 users
- Fix any final issues

---

## Day 7: Polish, Documentation & Launch

**Hours:** 13  
**Focus:** Final submission-quality systems, documentation, deployment

### What I Did

1. **Documentation (6 hours)**
   - Wrote comprehensive README.md (recruiter-grade)
   - Created ARCHITECTURE.md (system design + scaling)
   - Created DEVLOG.md (this file)
   - Created REFLECTION.md (technical decisions, self-rating)
   - Created TESTS.md (test documentation)
   - Created GTM.md (go-to-market strategy)
   - Created ECONOMICS.md (unit economics)

2. **Product Polish (3 hours)**
   - Fixed final UI issues
   - Added "How recommendations work" transparency section
   - Improved error messages (friendly, actionable)
   - Polished public report page styling
   - Added metadata to public reports (confidence, timestamp)

3. **Deployment (2 hours)**
   - Pushed to GitHub
   - Connected to Vercel
   - Set environment variables
   - Verified production build
   - Tested live deployment

4. **User Feedback (2 hours)**
   - Shared with 3 beta users (engineering managers)
   - Collected feedback:
     - "Love the transparency" (confidence badges)
     - "Why these specific tools?" (added reference section)
     - "Can I download the report?" (planned feature)
   - Made 1 quick fix (typo in recommendation text)

### What I Learned

- **Documentation is product:** The quality of docs signals the quality of the product. Spending time here was worth it.
- **Final polish matters:** Small fixes (typos, spacing, error messages) compound to feel polished.
- **User feedback is gold:** 3 quick chats revealed that transparency was the biggest value prop, not the savings calculations.

### Blockers

- None major. Smooth launch.

### Timeline & Confidence

**Total development time: 73 hours (~2.5 weeks)**

- Weeks 1-2: Core product (scope → engine → backend)
- Week 3: Polish → Docs → Launch

**Confidence levels:**
- Product direction: 9/10 (validated with users)
- Technical execution: 8/10 (solid backend, clean code)
- Market fit: 6/10 (early, need more user data)
- Sustainability: 7/10 (free product now, monetization path clear)

---

## Reflection on the Build

### What Went Well
1. **Focused scope:** Didn't build auth, workspaces, or integrations. Focused on core audit + sharing.
2. **Rule-based engine:** Choosing explainable rules over ML was right. Users trust the recommendations more.
3. **Public reports:** Viral mechanic (shareable links) is more powerful than I expected.

### What I'd Do Differently
1. **Test earlier:** Could have saved 1-2 hours by writing tests during engine development.
2. **Mobile-first:** Would have designed for mobile from the start (did it late).
3. **Pricing verification:** Would have used a pricing API instead of manual research.

### Key Insights for Future Products
1. **Transparency beats perfection:** Users prefer honest "moderate confidence" recommendations over fake "high confidence" BS.
2. **Focused UX:** One clear flow (audit → results → share) beats multi-feature complexity.
3. **Free + freemium:** Free audit as lead gen is stronger than paywalled product.

---

## Code Stats

- **Frontend:** 2,100 lines (components, pages, hooks)
- **Backend:** 800 lines (API routes, database)
- **Engine:** 450 lines (audit logic)
- **Tests:** 420 lines (unit + integration)
- **Docs:** 2,500 lines
- **Total:** ~6,300 lines of code & documentation

---

## Final Thoughts

StackSpend went from idea to working product in 7 days because I ruthlessly focused on the core loop: audit → results → share. Every feature choice was evaluated against "Does this accelerate user value?"

Skipping nice-to-haves (auth, workspaces, integrations, ML) meant the MVP shipped fast and validated assumptions. Those features are obvious phase 2 when usage data says they matter.

Next: Get 100 audits, analyze what users care about, and build phase 2 features based on real demand (not my guesses).


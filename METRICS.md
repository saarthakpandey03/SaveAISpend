# StackSpend Metrics & Dashboards

## North Star Metric

**Audits Completed (Weekly)**

Why?
- Simple, actionable, unambiguous
- Reflects product adoption
- Correlates with leads, revenue, engagement
- Easy to measure and track

**Target trajectory:**
- Week 1: 20-50 audits
- Week 2: 50-100 audits
- Month 1: 230 audits
- Month 3: 600 audits
- Month 6: 1,500 audits

---

## Primary Metrics (Tier 1)

### 1. Audit Funnel

**Flow:**
```
Landing page visits
  ↓
Audit form starts
  ↓
Audit completions
  ↓
Results page viewed
  ↓
Lead capture
  ↓
Conversions (consulting, SaaS)
```

**KPIs:**
- Landing page visits: 2000/month (month 3)
- Form start rate: 10% of visits
- Completion rate: 40% of starts (most drop after 1 question)
- Lead capture rate: 15% of completions
- Target: 2000 visits → 200 starts → 80 completions → 12 leads

**Thresholds:**
- If <5% completion rate: Product too complex, improve UX
- If <10% lead capture: Improve trust/social proof
- If <2% form start rate: Landing page messaging off

---

### 2. Report Share Rate

**Metric:** % of completed audits where user clicks "Share Report"

**Formula:** Shares / Completions × 100

**Target:** 30%+ (indicates users find value)

**Why it matters:**
- Shows product-market fit (users want to share)
- Unlocks viral growth
- Indicates confidence in recommendations
- Creates social proof for brand

**Tracking:**
- Front-end event: user clicks share button
- Track in analytics (Vercel Analytics or custom)

**Thresholds:**
- <15%: Users don't believe recommendations, improve confidence badges
- 15-25%: Good, iterate on copy/messaging
- >30%: Viral loop kicking in, growth accelerates

---

### 3. Lead Email Capture Rate

**Metric:** % of completed audits where user provides email

**Formula:** Emails captured / Completions × 100

**Target:** 15-20%

**Why it matters:**
- Direct sales funnel
- Email list for future monetization
- Measure of product value (email = commitment)

**Tracking:**
- Form submission to `/api/lead`
- Track by source (organic, product hunt, twitter, etc.)

**Thresholds:**
- <10%: Add trust signals (testimonials, confidence badges)
- <5%: Critical issue, rethink email capture UX
- >25%: Excellent, can scale acquisition

---

### 4. Recommendation Implementation Rate

**Metric:** % of leads that actually implement recommendations (qualitative)

**How to measure:**
- Email follow-up survey (month 1 post-audit)
- "Have you implemented any recommendations?"
- Track yes/no/partial responses

**Target:** 20-30% of leads report implementation

**Why it matters:**
- Validates recommendation quality
- Reveals pain points ("too hard to switch")
- Informs features (need Slack integration? Expense tracking?)

**Tracking:**
- Send email 2 weeks post-audit
- Simple 1-question survey
- Correlate with future consulting conversions

---

## Secondary Metrics (Tier 2)

### 5. Report View Count (Public Shares)

**Metric:** Total views on public report pages

**Formula:** Sum of view_count across all audits where is_public = true

**Target:** 3x audits by month 3 (viral coefficient ~0.3)

**Why it matters:**
- Shows viral reach
- Builds social proof (public reports with high views)
- Indicates shareability of content

**Tracking:**
- Database: increment view_count on GET /api/report/[id]
- Trend: should grow as share rate increases

---

### 6. Conversion Rate (Leads → Customers)

**Metric:** % of leads that convert to paying customers

**Formula:** (Consulting deals + Premium subs) / Total leads × 100

**Target:**
- Consulting: 10% of leads
- Pro SaaS: 3% of leads
- Team workspace: 2% of leads
- Total: 15% conversion to something paid

**Tracking:**
- UTM parameters on email links
- Associate lead email with customer payment
- Monthly dashboard of conversions

**Thresholds:**
- <5%: Sales motion broken, revisit email strategy
- 5-10%: Good, optimize email funnel
- >15%: Excellent, scale acquisition

---

### 7. Feature Engagement (Phase 2)

**Once premium features launch, track:**

#### Pro Feature Usage
- Audit re-runs: #/month per user
- Benchmark views: % of Pro users who view benchmarks
- PDF exports: # per month

#### Team Workspace Usage
- Users per workspace: average team members
- Audit frequency: audits per workspace per month
- Integration usage: Slack messages, API calls

---

### 8. Email Engagement

**Metrics:**
- Open rate: % of emails opened (target: 25-35%)
- Click rate: % of clicks in email (target: 5-10%)
- Unsubscribe rate: % unsubscribing (target: <1%)
- Reply rate: % replying with feedback (target: 2-5%)

**Cadence:**
- Welcome email (day 1): "Here's your full report"
- Nurture email (week 2): "How to implement recommendations"
- Offer email (week 4): "Want help implementing? Book a call"
- Re-audit reminder (month 3): "AI pricing has changed, re-audit"

---

### 9. Qualitative Feedback

**Metrics:**
- Twitter mentions (positive): +1 per week (target)
- Product Hunt rating: 4.5+ stars
- Testimonial quotes: 5+ high-quality quotes by month 3
- Support emails: <5/week (indicates good product)

**Tracking:**
- Set up alerts for brand mentions
- Collect quotes from users (DM, reviews)
- Track support email volume

---

## Activation Metrics

### 10. Time to First Audit

**Metric:** Minutes from landing page to audit completion

**Target:** 5-7 minutes average

**Tracking:**
- Front-end analytics: track page load → form start → completion
- Benchmark: better <5 min, good 5-10 min, improve if >15 min

**Why it matters:**
- Friction = abandonment
- Each 1-min reduction = ~5% better completion rate
- Low activation friction = higher shareability

---

### 11. Form Abandonment Points

**Metric:** Where users drop off in audit form

**Tracking:**
- Google Analytics: page/step abandonment
- Form analytics tool (Hotjar, LogRocket)
- Find the "pain point question"

**Common drop-off points:**
- "Team size?" — unclear question
- "Which tools do you use?" — long list, overwhelming
- "Current spend?" — requires looking up data

**Optimization:**
- Simplify questions
- Add examples ("e.g., ChatGPT Pro at $20/month")
- Allow "I don't know" option
- Estimate spend on their behalf

---

### 12. Mobile Conversion Rate

**Metric:** Conversion rate on mobile vs. desktop

**Target:** >80% of desktop rate (some friction expected)

**Tracking:**
- Google Analytics: segment by device
- Compare conversion by screen size

**If <70%:** Major UX issue on mobile, fix immediately

---

## Retention Metrics

### 13. Return Rate (Repeat Audits)

**Metric:** % of users who audit more than once

**Formula:** Unique users with 2+ audits / Total unique users

**Target:** 5-10% return rate

**Why it matters:**
- Shows product stickiness
- Indicates AI spend changes frequently
- Potential for subscription (re-audit reminders)

**Tracking:**
- Anonymous user ID in localStorage
- Track audit history per user
- Email follow-up: "Run another audit?" link

---

### 14. SaaS Churn Rate (Phase 2+)

**Metric:** % of subscribers canceling per month

**Formula:** Canceled subscriptions / Starting subscriptions

**Target:**
- Pro: 5% monthly churn (95% monthly retention)
- Team: 2% monthly churn (98% monthly retention)

**Annual retention:**
- Pro: 60% (starts 100, ends ~60 after 12 months)
- Team: 78% (higher value, stickier)

**Tracking:**
- Subscription management (Stripe, Vercel Billing)
- Automated dashboard showing monthly cohort retention
- Exit surveys: "Why are you canceling?"

---

### 15. NPS (Net Promoter Score)

**Metric:** Willingness to recommend (0-10 scale)

**Formula:** % Promoters (9-10) - % Detractors (0-6)

**Target:** 30+ (excellent for B2B SaaS)

**How to measure:**
- Post-audit email: "Would you recommend StackSpend to a founder?"
- Qualitative: "What should we build next?"
- Quarterly survey to all users

**Interpretation:**
- <0: Problem, major dissatisfaction
- 0-30: Good, room for improvement
- 30-50: Excellent, strong retention
- 50+: World-class (rare)

---

## Financial Metrics

### 16. Customer Acquisition Cost (CAC)

**Formula:** Total marketing cost / New customers acquired

**For StackSpend:**
- Month 1-3: CAC = $0 (organic only)
- Month 4+: CAC = $0 until we add paid ads
- When we run ads: track cost per lead, cost per customer

**Target:** CAC < LTV / 3 (payback in <3 months)

---

### 17. Lifetime Value (LTV)

**Formula:** Revenue per customer × Customer lifespan

**Examples:**
- Consulting: $750 one-time = $750 LTV
- Pro subscriber: $10/month × 24 months × 55% retention = $132 LTV
- Team workspace: $50/month × 36 months × 70% retention = $1,260 LTV

**Target:** LTV:CAC ratio > 3:1

---

### 18. Monthly Recurring Revenue (MRR)

**Formula:** Sum of all recurring subscriptions per month

**Components:**
- Pro SaaS: (# subscribers) × $10
- Team workspace: (# teams) × $50
- Enterprise: (# contracts) × ACV / 12

**Target:**
- Month 3: $0 (no SaaS yet)
- Month 6: $400 MRR
- Month 12: $2,500 MRR

---

### 19. Burn Rate & Runway

**Formula:**
- Monthly burn = Monthly costs
- Runway = Cash / Monthly burn

**StackSpend bootstrap model:**
- Month 1: Burn $50 (profitable by month 3)
- Runway: Infinite (profitable immediately)

**If taking funding:**
- Runway = capital raised / monthly burn

---

## Diagnostic Metrics (Troubleshooting)

### If Audits Are Low

**Check in order:**
1. Landing page traffic: Is anyone visiting?
2. Form start rate: Are visitors interested enough to click?
3. Completion rate: Are they finishing the form?
4. Recommendations quality: Are recommendations reasonable?

**Diagnostic:**
- If landing traffic is low: Marketing isn't working
- If form start low: Landing copy/UX is weak
- If completion low: Form is too complex
- If recommendations are bad: Engine needs tuning

---

### If Leads Are Low

**Possible causes:**
1. Lead capture UX problem (button placement, copy)
2. Trust issue (users don't believe recommendations)
3. No urgency (users don't feel compelled to give email)

**Fix:**
1. Add testimonials, social proof
2. Improve confidence badges and transparency
3. Add urgency ("Get recommendations emailed for future updates")
4. A/B test form placement

---

### If Share Rate Is Low

**Possible causes:**
1. Users don't think recommendations are worth sharing
2. Share button is hard to find
3. Public reports lack credibility

**Fix:**
1. Improve recommendation accuracy and relevance
2. Make share button more prominent
3. Add social proof to public reports
4. Simplify share copy ("Share this to Slack" vs. generic "Share")

---

## Dashboard Setup

### Daily Dashboard (Founder)
- Audits completed (today, this week, this month)
- Leads captured (today, this week, this month)
- Top recommendation being suggested
- Any errors or support emails

### Weekly Dashboard (Team)
- Audit funnel (visits → starts → completions)
- Share rate and public report views
- Lead sources (which marketing channels driving)
- Revenue (consulting deals, if any SaaS)

### Monthly Dashboard (Stakeholders)
- Total audits month-over-month
- Leads and conversions
- Revenue and burn rate
- Customer feedback summary
- Roadmap progress

---

## Early Warning Metrics (When to Pivot)

| Metric | Red Flag | Action |
|--------|----------|--------|
| Completion rate | <20% | Form UX problem, simplify |
| Share rate | <10% | Recommendations not trustworthy |
| Lead capture | <5% | No trust signals, add proof |
| Lead conversion | <2% | Sales broken, revisit messaging |
| NPS | <0 | Major problem, consider pivot |
| Churn (SaaS) | >10% monthly | Product doesn't deliver value |

---

## Measuring Product-Market Fit

**StackSpend reaches PMF when:**
1. Audits: 1,000+/month (consistent, not acquired through paid ads)
2. Share rate: >25% (viral loop activated)
3. Lead conversion: >10% (users want to pay)
4. NPS: >30 (users recommend to friends)
5. Churn: <5% (SaaS users stay)
6. Repeat usage: >5% (users come back)

**Estimate: PMF by month 6-9** (if all metrics track to plan)


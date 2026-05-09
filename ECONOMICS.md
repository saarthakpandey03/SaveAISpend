# StackSpend Unit Economics & Financial Model

## Executive Summary

**Business Model:** Free product → Lead generation → Premium services & features  
**Target:** $10k MRR by month 12, $100k MRR by month 24

---

## Revenue Model Architecture

### Model 1: Consulting Services (Phase 1)

**Concept:** Implement recommendations for founders who don't want to manage it themselves

**Funnel:**
```
Free audit
  ↓
Lead capture (40-50 per 1000 audits)
  ↓
Email nurture (5-10 opens)
  ↓
Sales call (1-2 conversions)
  ↓
$500-1000 implementation project
```

**Unit Economics:**
- CAC (Customer Acquisition Cost): $0 (organic, no ads)
- Conversion rate: audit → lead = 15%
- Lead → consulting customer = 10-20%
- ACV (Annual Contract Value): $0 (one-time project)

**Example: 1000 audits**
- 150 leads captured
- 15-30 consulting customers
- Revenue: $7,500-30,000
- Cost: $0 (founder time)

---

### Model 2: Premium Features (Phase 2)

**Concept:** Freemium model with premium features for power users

#### Tier 1: Free (Current)
- 1 free audit per month
- Shareable public report
- Confidence badges
- All recommendations

#### Tier 2: Pro ($10/month or $100/year)
- Unlimited audits
- Industry benchmarks ("Your spend vs. similar teams")
- Quarterly re-audits with trend analysis
- Export recommendations as PDF
- Priority email support

#### Tier 3: Team Workspace ($50/month or $500/year)
- Multi-user collaboration
- Team members can co-audit
- Role-based access (eng manager, finance, eng lead)
- Centralized dashboard (all team audits)
- Slack integration (audit alerts)
- API access

#### Tier 4: Enterprise (Custom)
- White-label reports
- Custom recommendation rules
- Dedicated integration (Stripe, Anthropic, OpenAI)
- SLA support
- Pricing: $5k-20k/year

---

### Model 3: Vendor Referral / Affiliate (Phase 2)

**Concept:** When users implement recommendations, get referral revenue from vendors

**Example:**
- User recommended Claude Pro
- User clicks "Get Claude Pro" affiliate link
- Anthropic pays $10-20 per signup
- StackSpend earns revenue with 0 additional cost

**Upside:** Aligns incentives (recommend better products, get paid)  
**Risk:** Might bias recommendations

---

## Financial Projections (24 Months)

### Month 1-3: Awareness Phase

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Audits Completed | 230 | 400 | 600 |
| Leads Captured | 35 | 60 | 90 |
| Consulting Deals | 2 | 4 | 6 |
| Consulting Revenue | $1,000 | $2,000 | $3,000 |
| Operating Costs | $50 | $100 | $150 |
| **Net Revenue** | **$950** | **$1,900** | **$2,850** |

**Notes:**
- Hosting: $50/month (Vercel + Supabase)
- No salary (founder-led)
- Consulting deals: $500/deal average
- Lead-to-customer ratio: ~10%

---

### Month 4-6: Product-Market Fit Phase

| Metric | Month 4 | Month 5 | Month 6 |
|--------|---------|---------|---------|
| Audits Completed | 800 | 1,100 | 1,500 |
| Leads Captured | 120 | 165 | 225 |
| Consulting Deals | 10 | 15 | 20 |
| Pro Subscribers | 5 | 15 | 40 |
| Consulting Revenue | $5,000 | $7,500 | $10,000 |
| SaaS Revenue (Pro) | $50 | $150 | $400 |
| Affiliate Revenue | $200 | $400 | $800 |
| **Gross Revenue** | **$5,250** | **$8,050** | **$11,200** |
| Operating Costs | $500 | $800 | $1,000 |
| **Net Revenue** | **$4,750** | **$7,250** | **$10,200** |

**Notes:**
- Pro tier launched in Month 4
- 5% of leads → Pro subscribers
- Affiliate revenue: $10 per recommendation execution
- Higher operating costs (email infrastructure, analytics)

---

### Month 7-12: Scale Phase

| Metric | Month 9 | Month 12 |
|--------|---------|----------|
| Audits Completed | 2,500 | 4,000 |
| Leads Captured | 375 | 600 |
| Consulting Deals | 35 | 50 |
| Pro Subscribers | 120 | 250 |
| Team Workspace Subscribers | 10 | 30 |
| Consulting Revenue | $17,500 | $25,000 |
| SaaS Revenue (Pro) | $1,200 | $2,500 |
| SaaS Revenue (Team) | $5,000 | $15,000 |
| Affiliate Revenue | $2,000 | $4,000 |
| **Gross Revenue** | **$25,700** | **$46,500** |
| Operating Costs | $2,000 | $3,500 |
| **Net Revenue** | **$23,700** | **$43,000** |

**Assumptions:**
- Consulting CAC: $0 (self-serve audit is customer acquisition)
- Pro attach rate: 10% of leads
- Team workspace: 2-3% of leads (higher-touch sales)
- Churn (Pro): 5%/month (competitive, so retention focus)
- Churn (Team): 2%/month (stickier, company owns it)

---

### Year 2 Projection (Conservative)

**Year 2 Revenue Breakdown:**
- Consulting: $300k (20-25 customers, $15k average)
- Pro SaaS: $120k (500 subscribers × $20/month average)
- Team Workspace: $300k (100 customers × $250/month)
- Affiliate: $60k
- Enterprise: $220k (5 customers × $44k average)
- **Total Year 2 Revenue: $1.0M**

**Costs Year 2:**
- Hosting (Vercel + Supabase): $5k
- Email / Customer infrastructure: $3k
- Tools (analytics, design, etc): $2k
- Sales & marketing (contractor support): $10k
- Operations & legal: $5k
- **Total Costs: $25k**

**Net Profit: $975k** (97% margin)

---

## Detailed Unit Economics

### Consulting Services

**Customer Journey:**
```
1000 audits
  × 15% lead rate = 150 leads
  × 10% sales conversion = 15 customers
  × $750 average deal = $11,250 revenue
  
Cost to acquire: $0 (included in product)
Time to deliver: 5 hours × $100/hour = $500 cost
Gross margin: ($750 - $500) / $750 = 33%
```

**Key Metrics:**
- CAC: $0 (customer acquisition is free via product)
- ACV: $750 (one-time project)
- Payback period: Immediate (no upfront CAC)
- Gross margin: 30-40%

**Scaling Note:**
- At 50 projects/month, founder can't deliver alone
- Would need to hire contractor ($2-3k/month)
- This scales until revenue justifies full hire

---

### Pro Subscription ($10/month)

**Customer Journey:**
```
1000 audits
  × 15% lead rate = 150 leads
  × 3% Pro conversion rate = 4.5 customers
  × $10/month = $45/month MRR
  
CAC: $0 (free audit)
LTV (2-year): $10 × 24 months × 60% retention = $144
Payback: 1 month (zero CAC)
Gross margin: 80% (hosting costs ~$2/user)
```

**Key Metrics:**
- Monthly Churn: 5% (typical SaaS)
- 12-month retention: 55%
- LTV: $144 (at 55% 1-year retention)
- CAC: $0

**Acquisition Levers:**
- Email campaigns (2x/month)
- In-product upsell on audit results
- Affiliate programs (partners recommend Pro)

---

### Team Workspace ($50/month)

**Customer Journey:**
```
1000 audits (from 200-person teams typically)
  × 15% lead rate = 150 leads
  × 2% conversion rate (higher touch) = 3 customers
  × $50/month = $150/month MRR
  
CAC: ~$500 (sales call with manager, demo)
LTV (2-year): $50 × 24 × 70% retention = $840
Payback: 11 months (CTM: CAC payback)
Gross margin: 70% (hosting + support costs)
```

**Key Metrics:**
- Lower churn (2%/month) — company owns tool
- Higher LTV
- Requires sales effort (not self-serve)

**Sales Motion:**
- Inbound lead from audit
- Sales call with eng manager (30 min)
- Demo + trial (1 week)
- Contract (annual or monthly)

---

### Enterprise API ($5k-20k/year)

**Target Customer:**
- 100+ person company
- Multiple teams auditing spend
- Need custom rules or integrations
- Have budget for tooling

**Unit Economics:**
```
ACV: $10,000 (average)
Implementation cost: $2,000 (setup, training)
Support cost: $1,000/year (maintenance)
Gross margin: (10,000 - 3,000) / 10,000 = 70%
```

**Sales Effort:**
- Inbound only (targeting via LinkedIn/email)
- 2-3 sales calls per deal
- Long sales cycle (3-6 months)
- High deal value justifies effort

---

## Sensitivity Analysis: What Drives Revenue?

### Lever 1: Audit Volume
- Each 1000 additional audits = +150 leads
- 150 leads = +$7,500 consulting revenue
- Scaling acquisition is the biggest lever

### Lever 2: Lead Capture Rate
- Currently: 15% of audits
- If we improve to 20%: +33% leads
- Strategy: Better UX, more trust signals, email capture copy

### Lever 3: Conversion Rate (Leads → Customers)
- Currently: 10% to consulting, 3% to Pro
- If we 2x conversion: +100% revenue
- Strategy: Better email sequences, case studies, social proof

### Lever 4: Price
- Currently: Consulting $500-1000, Pro $10/month
- If we increase Pro to $20/month: +$120k/year revenue (year 2)
- Risk: Lower conversion rate
- Strategy: Validate with users before pricing increases

---

## Cash Flow & Funding Assumptions

### Bootstrap Scenario (No External Funding)

**Cash position:**
- Month 1: -$50 (first hosting)
- Month 3: +$2,850 (profitable)
- Month 6: +$10,200 (break-even, then profitable)
- Month 12: +$43,000 (revenue-positive)

**Advantage:** Full control, 100% equity  
**Disadvantage:** Growth is slow (hiring, marketing limited)

### Seed Funding Scenario ($250k)

**Use of funds:**
- Product dev: $100k (contractor, part-time hire)
- Marketing: $75k (content, ads, tools)
- Operations: $50k (incorporation, legal, accounting)
- Runway: $25k (6-month buffer)

**Outcome:**
- 2x faster growth
- Better product (more features)
- Higher cash burn initially
- More pressure to hit targets

---

## Path to $1M ARR

**Option A: Consulting-Heavy (Year 2)**
- 20 consulting customers × $50k average = $1M
- Requires: Hiring implementation team ($500k/year salary)
- Gross margin: 30-40%
- Not sustainable long-term (consulting doesn't scale)

**Option B: SaaS-Heavy (Year 2-3)**
- 2000 Pro subscribers × $120/year = $240k
- 100 Team workspace × $5k/year = $500k
- 5 Enterprise customers × $50k/year = $250k
- **Total: $990k**
- Gross margin: 70%+
- Scalable indefinitely

**Best path:** Mix of both (consulting builds trust, SaaS scales)

---

## Risk Factors & Mitigation

### Risk 1: Low Audit Volume
"What if only 100 audits in month 1 instead of 230?"

**Mitigation:**
- Extend runway (cut costs, bootstrap longer)
- Increase marketing effort (no ads, just content)
- Improve product (make audit faster, more engaging)
- Pivot positioning if needed

### Risk 2: Low Lead Conversion
"What if <5% of users give email instead of 15%?"

**Mitigation:**
- Improve lead capture UX (form placement, copy)
- Add social proof (reviews, testimonials)
- Create urgency ("Get recommendations emailed")
- A/B test email copy

### Risk 3: Recommendation Accuracy
"Users implement advice, it doesn't work, they churn"

**Mitigation:**
- Track user outcomes (did they save money?)
- Iterate rules based on feedback
- Confidence badges manage expectations
- Offer consulting to help implement

### Risk 4: Competitive Entry
"VC-backed competitor launches with marketing budget"

**Mitigation:**
- Build community moat (early users are advocates)
- Maintain technology lead (better recommendations)
- Go upmarket (enterprise features) while competitor fights SMB
- Offer affiliate program (bootstrap growth)

---

## Metrics to Track (Dashboard)

### Revenue Metrics
- Monthly Recurring Revenue (MRR)
- Annual Run Rate (ARR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC Ratio (target >3:1)

### Funnel Metrics
- Audits completed
- Leads captured (email)
- Leads → Consulting (conversion %)
- Leads → Pro (conversion %)
- Leads → Team (conversion %)

### User Metrics
- Monthly Active Users
- Audit completion rate (% of form starts)
- Share rate (% of audits shared)
- Return rate (% of users who re-audit)

### Financial Metrics
- Gross margin by revenue stream
- Burn rate
- Cash runway
- Payback period

---

## Sensitivity Table: Impact on Year 1 Revenue

| Scenario | Audits | Leads | Consulting Revenue |
|----------|--------|-------|-------------------|
| Conservative (-30%) | 3,000 | 450 | $22,500 |
| Base case | 4,000 | 600 | $30,000 |
| Optimistic (+30%) | 5,200 | 780 | $39,000 |

**Note:** Year 1 is mainly consulting (SaaS scales in Year 2+)

---

## Conclusion

StackSpend has a **clear path to $1M ARR** through:
1. Free audits as customer acquisition (CAC = $0)
2. Consulting for immediate revenue
3. SaaS (Pro + Team) for scalable, recurring revenue
4. Enterprise API for high-touch, high-value customers

**Key advantage:** Bootstrap-friendly (profitable month 3-4), scales without venture capital.


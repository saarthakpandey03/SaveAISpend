# OPERATIONS: Running StackSpend at Scale

## Purpose

This document outlines how to run and scale StackSpend operationally—pricing updates, monitoring, fraud prevention, customer support, vendor relationships.

---

## Part 1: Pricing Data Management

### Pricing Refresh Cadence

| Tool | Frequency | Owner | Process |
|------|-----------|-------|---------|
| Cursor | Monthly | Founder | Check official pricing page |
| GitHub Copilot | Monthly | Founder | Monitor official docs |
| Claude | Monthly | Founder | API docs + pricing page |
| ChatGPT | Weekly | Founder | Pricing page (changes often) |
| Gemini | Weekly | Founder | Google Cloud pricing |
| OpenAI API | Weekly | Founder | Pricing page (rates volatile) |
| Anthropic API | Weekly | Founder | Console billing page |

### Process

**Daily Pricing Check (10 minutes):**
```
1. Check each vendor's pricing page
2. Note any changes in pricing-data.ts
3. If >5% change, flag for audit refresh
```

**Weekly Update (1 hour):**
```
1. Update pricing-data.ts with new rates
2. Run full test suite
3. Regenerate sample audits
4. Document in PRICE_CHANGES.log
```

**Monthly Review (1 hour):**
```
1. Check for vendor promotions
2. Review API rate changes
3. Update documentation
4. Email existing customers about pricing changes
```

---

## Part 2: Monitoring & Observability

### Key Metrics to Track

**Product Metrics:**
- Free audits completed (target: 100/week → 1,000/week)
- Email capture rate (target: 5-10%)
- Recommendation confidence distribution (high: 60%, moderate: 30%, low: 10%)
- Average savings identified ($500-2k)
- Tool consolidation recommendations (30-40% of audits)

**Business Metrics:**
- Paid conversions from free audits
- Customer retention (target: >80% monthly)
- MRR growth (target: 20% month-over-month)
- Enterprise deals in pipeline

**Technical Metrics:**
- Audit generation time (target: <2 seconds)
- API response time (target: <500ms)
- Error rate (target: <0.1%)
- Uptime (target: 99.5%)

### Monitoring Tools

**Essential:**
- Vercel Analytics (free with deployment)
- Supabase Logs (free tier)
- Basic error tracking (Sentry free tier)

**Nice to have:**
- Amplitude for user behavior
- Stripe for payment tracking
- Simple SQL dashboard for audit trends

---

## Part 3: Abuse & Fraud Prevention

### Risk: Spam Audits

**Problem:** Script kiddies running 1000 fake audits to game metrics

**Prevention:**
1. Rate limiting (1 audit per IP per minute)
2. Email validation (only real emails count toward metrics)
3. Team size sanity checks (flag impossible values like "1000 people")
4. Demo mode exists for showcase purposes (separate from real audits)

**Implementation:**
```typescript
// In API route
const rateLimitCheck = await checkRateLimit(ip);
if (!rateLimitCheck) return 429;

const emailValidation = validateEmail(email);
if (!emailValidation) return 400;

const sanityCheck = validateTeamProfile(teamSize, teamType);
if (!sanityCheck) return 400;
```

### Risk: Bot Email Signups

**Problem:** Bots filling email field with garbage

**Prevention:**
1. Honeypot field (invisible "website" field in form)
2. Email domain validation (reject temp-mail.com, 10minutemail.com)
3. Simple CAPTCHA (optional, only if abuse detected)

**Implementation:**
```typescript
// Honeypot check
if (form.website && form.website.length > 0) {
  return 403; // Likely bot
}

// Domain validation
const spamDomains = ['temp-mail.com', '10minutemail.com', ...];
if (spamDomains.includes(email.domain)) {
  return 400;
}
```

### Risk: Competitor Research

**Problem:** Competitors scraping our audit recommendations to copy methodology

**Prevention:**
1. Results are personalized (not generically applicable)
2. No public leaderboard or published data
3. Audit data is private (not shared unless user requests share)
4. Methodology is transparent (METHODOLOGY.md explains our rules openly)

**Philosophy:** We're comfortable with transparency because trust is our moat.

---

## Part 4: Customer Support Workflow

### Tier 1: Self-Service

**Help Center Topics:**
- "Which plan should I choose?" → Comparison chart
- "How accurate are the recommendations?" → METHODOLOGY.md
- "Can I export my audit?" → Yes, as PDF/CSV (premium feature)
- "How do I cancel?" → One-click in settings

**FAQ Section:**
- 10-15 most common questions
- Automate with chatbot if volume grows

### Tier 2: Email Support

**Response time target: 24 hours**

**Common issues:**
1. "The audit says we should consolidate but we're locked into annual contract"
   → Response: "That's valid. Our recommendations assume you have flexibility. For next year's renewal, this audit will help with negotiations."

2. "Your pricing data seems wrong"
   → Response: "Please send us current pricing. We update monthly and appreciate corrections."

3. "We follow the recommendations but didn't see savings"
   → Response: "Savings depend on usage patterns. Let's review your actual spend before/after."

4. "How do I upgrade to premium?"
   → Response: "From your audit results page, click 'Upgrade' or visit our pricing page."

### Tier 3: Enterprise Support

**Dedicated account management (Month 6+, when enterprise customers arrive)**

- Quarterly business reviews
- Custom audit requests
- Vendor negotiation support
- Integration help

---

## Part 5: Vendor Relationship Management

### Relationships to Maintain

**Cursor Team:**
- Monitor for price changes
- Track product updates (new features = new recommendations needed)
- Consider partnership (referral? co-marketing?)

**Anthropic (Claude):**
- Same as Cursor
- Monitor Claude Opus vs Sonnet pricing
- Note API cost changes

**OpenAI:**
- Monitor ChatGPT pricing (biggest customer base)
- Track new models (o1, o1-mini) and implications
- Watch for enterprise pricing changes

**GitHub (Copilot):**
- Monitor business pricing changes
- Track new Copilot products (Copilot Chat, etc.)
- Watch for acquisition implications

### Outreach Strategy (Month 6+)

**Goal:** Partner with vendors for co-marketing

**Message:** "StackSpend analyzes how teams use your product. We have data on Cursor adoption, ChatGPT Team adoption, etc. Interested in featured partnership?"

**Outcome:**
- Case study (Cursor case: "How 500 teams optimized Cursor spend")
- Referral partnership (we refer free users to you, you mention us to enterprise)
- Co-authored content ("The State of AI Tool Adoption 2026")

---

## Part 6: Scaling Support

### Month 1-3: Founder Runs Everything
- Pricing updates
- Customer support
- Bug fixes
- Audit improvements

### Month 4-6: Hire First Support Person
- Customer support takes 50% of time
- Founder focuses on product + metrics
- Pricing updates automated where possible

### Month 6-12: Hire Product Manager / Engineer
- Support person handles tier 1 + 2
- PM does customer research + roadmap
- Engineer handles scaling + new features

### Year 2+: Build Team
- VP Sales (enterprise deals)
- Marketing Manager (content + campaigns)
- Support team (2-3 people)

---

## Part 7: Data Management & Privacy

### What We Collect

**From audits:**
- Team size
- Team type (startup/enterprise/etc.)
- Tool usage (which tools, which plans)
- Monthly spend (aggregated, not itemized)

**From email signups:**
- Email address
- Team size (optional)
- Painpoint (optional)
- Referral source (optional)

### What We Don't Collect

- User behavior inside tools
- Individual team member names
- Financial data beyond spend aggregates
- Company identifiers (name, industry, location) — optional only

### Privacy Commitments

1. **No selling data** — Customer data is never sold to 3rd parties
2. **Transparent aggregate stats** — We publish aggregate insights ("50% of teams with 10 people overspend on redundancy")
3. **Opt-in research** — Want to participate in research? Opt-in to case studies
4. **Privacy-first design** — Default to not collecting sensitive data

### Compliance

- **GDPR:** "Right to be forgotten" via deletion request
- **CCPA:** "Do not sell my data" honored by default
- **SOC 2:** Implement when customers request it (Year 2+)

---

## Part 8: Metrics Dashboard (Founder View)

### Daily Standup (5 minutes)

```
Audits today: ___
Emails captured today: ___
Conversion rate (cumulative): ___
Customer churn: ___
Critical bugs: ___
```

### Weekly Review (30 minutes)

```
- Free audits: _____ (target: 100/week)
- Email capture rate: ___% (target: 8-10%)
- Paid conversions: ___
- MRR: $_____
- Top painpoint among leads: ___________
- Pricing changes needed: Yes/No
```

### Monthly Strategy (1 hour)

```
- Growth rate (audits/month)
- Retention rate
- Customer feedback themes
- Competitive intelligence
- Product roadmap updates
```

---

## Part 9: Operational Checklist (Weekly)

- [ ] Update pricing data
- [ ] Run full test suite
- [ ] Check error logs
- [ ] Respond to customer support emails
- [ ] Update metrics dashboard
- [ ] Review lead quality
- [ ] Check for spam/abuse patterns

---

## Part 10: Operational Checklist (Monthly)

- [ ] Review customer churn
- [ ] Analyze conversion funnel
- [ ] Update competitive intelligence
- [ ] Plan next month's priorities
- [ ] Vendor relationship outreach
- [ ] Customer case study outreach
- [ ] Blog post planning (1 per month)

---

## Summary

Running StackSpend is operationally lightweight until you hit 1,000 customers:
- Pricing updates: 1-2 hours/week
- Customer support: 2-3 hours/week
- Bug fixes: 3-5 hours/week
- Strategic work: 5-10 hours/week

**Total:** ~15 hours/week founder time. Highly manageable.

Scaling happens at:
- 100 customers → Need support person
- 500 customers → Need product manager
- 2,000 customers → Need VP Sales

At $1M ARR (Year 2), you have the runway to build a proper team.

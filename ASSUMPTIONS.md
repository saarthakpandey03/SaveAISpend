# STACKSPEND: TRANSPARENCY & ASSUMPTIONS

This document details every assumption StackSpend makes, why it matters, and where recommendations might be imperfect.

**Core principle:** Honesty > impressive numbers.

---

## Pricing Assumptions

### Current as of: May 2026

**Tools we price:**
- Cursor (Pro: $20/mo, Business: $40/mo)
- GitHub Copilot (Personal: $10/mo, Business: $21/mo)
- ChatGPT (Plus: $20/mo, Team: $30/person/mo, Enterprise: custom)
- Claude (Claude.ai Pro: $20/mo, API: $0.003-0.015 per 1k tokens)
- Gemini (Advanced: $20/mo, API: varies by model)
- OpenAI API (Pay-as-you-go, $0.005-0.30 per 1k tokens)
- Anthropic API (Pay-as-you-go, $0.003-0.024 per 1k tokens)
- Windsurf ($200/year or free)

### Limitations

1. **Pricing changes constantly** – We capture snapshot pricing. Vendors change prices 2-4x/year.
   - **Impact:** Recommendations could be outdated within 30 days.
   - **Mitigation:** We disclose pricing date and recommend users verify current pricing.

2. **We don't know actual usage** – We assume typical usage per plan tier.
   - **Example:** We assume ChatGPT Plus users generate ~$10/mo in API overage costs. Some users generate $0, others $50+.
   - **Impact:** Savings estimates could be ±50% off for any single tool.
   - **Mitigation:** This is why we recommend starting with 2-3 highest-savings recommendations instead of all.

3. **Hidden costs are ignored** – We don't account for:
   - Vendor discounts (enterprise teams get 20-40% off)
   - Annual billing savings (usually 10-20%)
   - Volume discounts for API usage
   - Team seat sharing practices
   - **Impact:** Our savings could be 15-25% conservative for enterprises.

4. **Regional pricing differs** – We use US pricing only.
   - **Impact:** Recommendations may not apply accurately to EU, APAC, or other regions.

---

## Seat Assumptions

### Rule 1: "Unused Seats"

**We assume:** If a team has 10 seats but team size is 8, those 2 seats are wasted.

**Reality:**
- Some teams buy seats "in advance" for new hires
- Some people have stale logins but don't use the tool
- Some companies bulk-buy annual plans they grow into

**Impact:** Could overestimate seat waste by 10-30%.

**Confidence:** Moderate. Works for mature teams, less accurate for growth-stage.

---

### Rule 2: "Seat Right-Sizing"

**We assume:** If paying for ChatGPT Team at $30/person with 10 people, but only 6 are active, downgrade to Pro at $20/person.

**Reality:**
- Downgrading requires manual work (canceling, re-provisioning)
- Some orgs can't downgrade due to contracts
- Team features (workspace, shared conversations) may be valuable

**Impact:** Savings estimates assume free/instant downgrades. Real implementation takes 1-2 weeks.

**Confidence:** Moderate-High. But only if team is disciplined about managing seats.

---

### Rule 3: "Pro vs. Enterprise"

**We assume:** Unless you have 50+ people, Pro is sufficient.

**Reality:**
- Some teams need enterprise features (SOC2, SAML, priority support)
- Some organizations have mandatory enterprise policies
- Some teams benefit from priority support despite size

**Impact:** Could recommend downgrading teams that need enterprise features.

**Confidence:** Low for enterprise teams, High for startups <50 people.

---

## Recommendation Limitations

### Consolidation Recommendations

**We recommend:** If you have both ChatGPT Team and Claude Pro, you could drop Claude.

**Reality:**
- Some teams use both because team members have different preferences
- Some workflows are specialized for one tool
- Consolidation has a cost: team retraining, workflow changes

**Impact:** Savings estimates don't account for switching costs.

**Confidence:** Moderate. Good signal but requires team validation.

---

### Plan Downgrades

**We recommend:** If not using advanced features, downgrade from Team to Pro.

**Reality:**
- Orgs don't always know who uses what features
- Team collaboration features may be underutilized but valuable
- Downgrading requires someone to manage it quarterly

**Impact:** Could overestimate savings if downgrade isn't actually feasible.

**Confidence:** Moderate. Requires honest audit of actual feature usage.

---

### API vs. UI Tools

**We assume:** If you're using Claude API heavily, you don't need Claude Pro ($20/mo).

**Reality:**
- Some teams use both: Pro for human dev work, API for application work
- Some teams don't accurately track API spending vs. subscription spending
- API can be cheaper per token, but humans often cost more to provision

**Impact:** Might miss that some teams genuinely need both.

**Confidence:** Low. API spending is complex and team-specific.

---

## Benchmarking Assumptions

### Benchmark Rule 1: "Spend Per Team Member"

**We assume:**
- Coding-focused teams: $35-40/person/month
- Writing-focused teams: $20-25/person/month
- Research-focused teams: $15-20/person/month

**Reality:**
- Industry varies wildly. Some AI-native companies spend $100+/person/month.
- Companies with budget constraints might only spend $5-10/person/month.
- Team composition matters: A team with 5 developers and 1 PM spends differently than 3 developers and 3 PMs.

**Impact:** Benchmarks might not reflect your specific industry or team type.

**Confidence:** Low-Moderate. Good directional signal, not precise.

---

### Benchmark Rule 2: "Typical Stack Recommendation"

**We assume:** A coding team should use 2-3 tools:
- 1 IDE assistant (Cursor or Copilot) – $20-40/person
- 1 general-purpose LLM (ChatGPT or Claude) – $15-20/person
- Optional: Specialized tool (Gemini API, Anthropic API) – $0-10/person

**Reality:**
- Some companies use 6+ tools purposefully
- Some startups use 0 commercial tools (just free tiers)
- Different roles need different tools

**Impact:** Might suggest consolidating when variety is actually valuable.

**Confidence:** Moderate. Works for "typical" teams, less for specialized use cases.

---

## What We're NOT Auditing

### Missing Data Points

We don't account for:
1. **Actual usage metrics** – Who uses what, how often, for what
2. **Team preferences** – Which tools the team actually likes
3. **Switching costs** – Cost of migrating to new tools
4. **Quality differences** – Some tools genuinely provide more value
5. **Lock-in effects** – Vendor contracts with penalties
6. **Integration ecosystems** – How tools fit into broader stacks
7. **Support quality** – Some vendors provide better support
8. **Future roadmap** – Teams might want newer features

### Why This Matters

**StackSpend is:**
- A starting point for conversation, not a final decision
- A financial audit, not a product recommendation
- A quick signal, not a comprehensive analysis

**StackSpend is NOT:**
- A replacement for actually analyzing your usage data
- A recommendation to blindly cut spending
- An analysis of whether specific tools are good

---

## Confidence Levels by Recommendation Type

| Recommendation Type | Confidence | Validation Required |
|---|---|---|
| Unused seat removal | High (75%) | Check actual active users last 30 days |
| Plan downgrade (same tool) | Moderate (60%) | Review actual feature usage patterns |
| Tool consolidation | Moderate (55%) | Test new tool with team, measure productivity |
| API vs. UI tool selection | Low (40%) | Analyze actual usage patterns and costs |
| Benchmark comparison | Moderate (50%) | Compare against industry reports |
| Feature utilization | Low (35%) | Requires actual product telemetry |

---

## Our Process for Verifying Recommendations

### Low-Confidence Recommendations
- Always marked as "review needed" in the results
- Include disclaimer: "Requires validation against actual usage"
- Suggested next steps: "Check usage logs for past 30 days"

### Medium-Confidence Recommendations
- Marked as "moderate confidence"
- Explain assumptions: "Assumes no team members depend on enterprise features"
- Suggest validation: "Test downgrade with pilot group first"

### High-Confidence Recommendations
- Still include disclaimer
- Clear reasoning: "You're paying for X but team size is Y"
- Easy to implement: "Remove seats immediately in admin panel"

---

## How Recommendations Can Be Wrong

### Scenario 1: Team Bought "Too Much"

**We'd recommend:** Downsize from Team to Pro
**Reality:** Team actually just bought wrong – they should have bought nothing (free tier sufficient)
**Our mistake:** We don't evaluate if the tool is needed at all

---

### Scenario 2: Tool Consolidation Removes Necessary Capability

**We'd recommend:** Drop Claude Pro, use ChatGPT Team for everything
**Reality:** Team uses Claude for specialized prompt engineering that ChatGPT can't replicate
**Our mistake:** We don't know actual usage patterns

---

### Scenario 3: Vendor Discount Makes Our Pricing Wrong

**We'd recommend:** Upgrade to ChatGPT Team from Plus
**Reality:** Team negotiated 40% discount on 10x Plus seats instead
**Our mistake:** We assume list pricing, not negotiated pricing

---

### Scenario 4: Team Has Unique Constraints

**We'd recommend:** Save $500/month by reducing seats
**Reality:** Team is under contract that penalizes downgrades, and switching costs exceed savings
**Our mistake:** We don't factor in legal/contractual constraints

---

## How to Use This Document

**For users:**
- Read the relevant section for your recommendations
- Validate high-impact recommendations before implementing
- Use this as a starting point, not a directive

**For recruiters/investors:**
- See how transparent we are about limitations
- Notice we're humble about what we don't know
- Understand our recommendation are starting points, not final answers

**For future roadmap:**
- Points to investigate with real usage data
- Vendor APIs to integrate for actual pricing
- Better benchmarking approaches
- Vendor contracts to model

---

## Updates

This document will be updated quarterly as pricing changes and our assumptions evolve.

Last updated: May 8, 2026
Pricing sources: Official vendor websites, public pricing pages

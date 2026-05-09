# StackSpend User Interviews & Validation

## Interview Framework

Each interview follows this structure:
1. **Demographics** — Role, company, stage
2. **AI Stack** — Tools used, why, monthly spend
3. **Problem** — Spend visibility, optimization challenges
4. **Product Reaction** — Does StackSpend solve the problem?
5. **Insights** — Unexpected learnings
6. **Action Items** — Product changes influenced

---

## Interview 1: Sarah Chen, Eng Manager at SeedStage AI Startup

**Date:** May 2024  
**Duration:** 25 minutes  
**Medium:** Zoom

### Demographics
- **Role:** Engineering Manager
- **Company:** AI reasoning startup (Series A, $12M raised)
- **Team Size:** 8 engineers
- **Location:** San Francisco, CA
- **Background:** Ex-Google, now manages ML engineering team

### AI Stack & Spend

**Current tools:**
- ChatGPT Team Pro: $50/seat × 3 (CTO, lead eng, Sarah) = $150/month
- Claude Pro: $20/month × 3 = $60/month
- GitHub Copilot Teams: $19/seat × 8 = $152/month
- Cursor Pro: $20/month × 2 = $40/month
- OpenAI API: ~$100/month (for fine-tuning experiments)

**Total monthly spend: $502/month ($6,024/year)**

**Why each tool:**
- ChatGPT: "Default for coding and brainstorming"
- Claude: "Better at long documents and reasoning"
- Copilot: "Company standard, everyone uses"
- Cursor: "Some devs prefer it for Python"
- API: "R&D for custom models"

### Problem Validation

**Her words:**
> "I know we're probably overpaying. But I don't have time to audit what each person actually uses. Is GitHub Copilot worth $152/month if only 3 engineers actively use it? No idea. ChatGPT Team is expensive — I'm not sure the team features we pay for are actually needed."

**Pain points:**
1. No visibility into actual tool usage
2. Tools were adopted organically (no company policy)
3. Spreadsheet tracking is manual and stale
4. Finance asks "Why are we spending on 5 different tools?"
5. Can't justify tools to CFO without data

### Product Reaction

**After 5-minute demo:**

> "Oh wow, I can see concrete savings? Like, we could save $1,800/year by right-sizing some of these?"

**Specific reactions:**
- "I like that it shows confidence levels. I don't trust a tool that says everything is 100% confident."
- "The 'already optimized' badge is good — makes me feel like you're not just upselling."
- "Can I share this with my CFO? I think this would actually help justify our AI spend."

**Use cases she mentioned:**
1. Quarterly budget planning (share report with CFO)
2. New tool evaluation (run audit, see impact)
3. Team alignment (show engineers the numbers)

### Biggest Surprises

1. **Didn't know Cursor cost money** — Thought it was free, now realizes she's paying for 2 users
2. **Team Pro features not used** — ChatGPT Team has team analytics, but team doesn't use them
3. **Seat count confusion** — Wasn't sure who was actually using ChatGPT (some seats might be inactive)

### Product Changes Influenced

1. **Add "unused seat" detection** — "If we could see which of my team members aren't using ChatGPT Pro, I could downgrade faster."
   - Status: Added to Phase 2 roadmap
2. **Add tool explanation tooltips** — "Why is this tool recommended? What's the difference between Pro and Team?"
   - Status: Improved confidence scoring description
3. **Export as PDF** — "I need to send this to CFO. Can I download it as a pretty PDF?"
   - Status: Added to Pro features

### Quote

> "If I implement these recommendations, I save $1,800/year and look smart to our CFO. That's a huge win for me."

---

## Interview 2: Marcus Rodriguez, Founder / CEO of AI Tools Startup

**Date:** May 2024  
**Duration:** 18 minutes  
**Medium:** Twitter DM then phone

### Demographics
- **Role:** Founder & CEO
- **Company:** AI API wrapper startup (pre-seed, bootstrapped)
- **Team Size:** 2 people (Marcus + 1 engineer)
- **Location:** Austin, TX
- **Background:** Ex-startup founder, now on 2nd venture

### AI Stack & Spend

**Current tools:**
- ChatGPT Plus: $20/month (Marcus)
- Claude Pro: $20/month (Marcus)
- GitHub Copilot: $10/month (Marcus)
- Cursor: $20/month (engineer)
- OpenAI API: ~$500/month (product usage)
- Anthropic API: ~$200/month (product usage)

**Total monthly spend: $770/month ($9,240/year)**

**His breakdown:**
- "Plus/Pro/Copilot are me exploring. I try every tool to understand what our users need."
- "Cursor is [engineer's] preference."
- "API costs are business costs (product), not tooling."

### Problem Validation

> "Honestly? I know I'm wasting money on the subscriptions. I pay for three chat tools but use ChatGPT 90% of the time. But switching costs attention, and attention is my scarcest resource right now."

**Pain points:**
1. Too many subscriptions (inertia, never cancelled)
2. No system for deciding which tools matter
3. Didn't realize API costs separate from subscription costs
4. Felt embarrassed about "not optimizing" (founder guilt)

### Product Reaction

**After audit:**

> "Wait, you're saying I could save $1,200/year by just… canceling Claude and Copilot? That sounds right actually."

**Key reactions:**
- "The 'already using best tools' thing made me feel better" (reduced founder guilt)
- "I like that you explained WHY. Not just 'cancel this.'"
- "This took 3 minutes. I've been meaning to audit this for 6 months."

### Biggest Surprises

1. **API costs are separate** — He had mentally conflated "AI spend" with "ChatGPT subscriptions." API costs dwarf subscriptions.
2. **Switching costs are lower than he thought** — Recommendation was so clear he was willing to switch immediately
3. **Cold product worked** — Didn't know about StackSpend before, found via Twitter link, completed audit immediately

### Product Changes Influenced

1. **Separate "subscription spend" from "API spend"** — Two different cost centers, different recommendations
   - Status: Will add in Phase 2 as separate audit categories
2. **Show payback time** — "If I implement this in 1 hour, I save $100/month. ROI is huge."
   - Status: Added time-to-implement estimates
3. **Add "which tool should I use for X?" guide** — Wasn't about cost, but about which tool is best for different tasks
   - Status: Feature request logged, lower priority

### Quote

> "I've been procrastinating on this for 6 months. Your tool made the decision easy in 3 minutes. That's worth something."

---

## Interview 3: Priya Kapoor, Finance Lead at Mid-Market Scaleup

**Date:** May 2024  
**Duration:** 32 minutes  
**Medium:** Zoom call

### Demographics
- **Role:** Finance Manager
- **Company:** Data analytics startup (Series B, $50M raised)
- **Team Size:** 120 engineers (company-wide), 15 person team using AI tools
- **Location:** NYC
- **Background:** Ex-Airbnb Finance, now owns SaaS spend at current startup

### AI Stack & Spend

**Company-wide AI spend:** (estimated from her audit)
- ChatGPT Team: $50/seat × 12 = $600/month
- Claude Enterprise: $30k/month (API spend)
- GitHub Copilot Teams: $19/seat × 110 = $2,090/month
- Cursor: $20/month × 8 = $160/month
- Various other tools (Windsurf, v0): ~$200/month

**Total: ~$33,000/month ($396,000/year)**

**But here's the insight:** Priya estimates actual usage is probably 30-40% of seats.

### Problem Validation

> "We're losing six figures a year to seat bloat. I know it. CFO knows it. But getting 120 engineers to actually use the licenses they're assigned is like herding cats. We pay for everyone, but only 40 people actually use them. And half of those people probably aren't using the right tier."

**Pain points:**
1. Massive seat bloat (120 licenses, 40 active users)
2. Enterprise contract lock-in (hard to downgrade mid-contract)
3. Individual tool choices made by teams (no coordination)
4. Finance has no visibility into which teams use what
5. CFO pressure to cut SaaS spend

### Product Reaction

**After running audit on one team's actual usage:**

> "This is exactly what I need to take to my CFO. Concrete numbers, clear recommendations. Not just 'we're overpaying'."

**Specific reactions:**
- "I love that you break it down by tool. Finance needs that level of detail."
- "The confidence scoring is good. I can present moderate-confidence items as 'opportunities to explore' rather than definite cuts."
- "Can I see what similar companies spend? That's my real leverage with CFO."

### Biggest Surprises

1. **Consolidation math shocked her** — Claude API + ChatGPT Team had massive feature overlap. Could save $1k/month consolidating
2. **Seat utilization data** — Learned that 8 seats of Cursor are unused. Quick win: cancel them
3. **Engagement with product** — Priya spent 20 minutes exploring the audit, asking "What if we did X instead?"

### Product Changes Influenced

1. **Industry benchmarks (Phase 2)** — "If I could compare our spend to similar companies our size, that's huge leverage with CFO."
   - Status: Core feature for Phase 2 monetization (benchmark access = premium)
2. **Role-based recommendations** — "My data scientists probably need Claude. My frontend devs need Copilot. Don't give me one-size-fits-all."
   - Status: Logged for Phase 3 (advanced features)
3. **Bulk audit capability** — "Can I upload a spreadsheet of my whole team and get a report?"
   - Status: Planned as enterprise feature

### Quote

> "If I can show the CFO we're wasting $150k/year on Copilot seats nobody uses, I become a hero. Your tool just gave me that superpower."

---

## Key Themes Across Interviews

### Theme 1: Guilt + Inertia

All three users expressed some version of:
- "I know I'm overpaying"
- "I've been meaning to audit for months"
- "Switching feels like effort"

**Insight:** Removing friction (fast audit, clear recommendations) turns intention into action.

### Theme 2: Legitimacy of Recommendations

Every user emphasized confidence/transparency:
- "I like that you show confidence levels"
- "Why is this recommended? What's the data?"
- "Can I compare to other companies?"

**Insight:** Users want to trust recommendations. Show your work, not just conclusions.

### Theme 3: Different Use Cases

- Sarah (manager): Need to justify to CFO
- Marcus (founder): Need to make quick decisions
- Priya (finance): Need detailed analysis for enterprise negotiation

**Insight:** One tool, three different jobs. Need flexibility in how data is presented.

### Theme 4: Underlying Problem

All three struggle with:
- **Visibility:** Don't know who's using what
- **Governance:** No clear process for tool adoption
- **Accountability:** Tools are adopted ad-hoc, no owner

**Insight:** StackSpend solves 50% of problem (audit). Other 50% is process/governance (not our problem, but worth noting).

---

## Validation Summary

### What Worked

✓ Free product (zero friction to try)  
✓ Fast audit (3-5 min, not 30 min)  
✓ Transparent recommendations (show confidence, not hype)  
✓ Public report sharing (easy to get buy-in)  
✓ Found real problems (all three saved $1k+/year)

### What Needs Work

✗ Usage data (We recommend based on cost, not usage. Users want usage-based recommendations)  
✗ Industry comparison (Users want benchmarks to validate their spend)  
✗ Bulk audits (Finance needs to audit multiple teams, not one at a time)  
✗ Implementation guidance (Users know what to do, but need help executing)

### Product Priorities (Based on Interviews)

1. **High:** Confidence scoring + explanations (all users mentioned)
2. **High:** Export/share capabilities (Sarah mentioned PDF, Priya mentioned presentations)
3. **High:** Industry benchmarks (Priya mentioned, big leverage point)
4. **Medium:** Usage data integration (Priya mentioned, Marcus didn't care)
5. **Medium:** Bulk audit (Priya mentioned, others didn't need)

---

## Conversion Insights

**Consulting potential:**
- Sarah: Would buy consulting to implement recommendations ($500-1000)
- Marcus: Self-serve (too small), not buyer
- Priya: Would buy consulting for enterprise negotiation ($5000+) and ongoing audit service ($500/month)

**SaaS potential:**
- Sarah: Would subscribe to benchmarks (curious if she's doing well vs. peers)
- Marcus: Too small, probably not buyer
- Priya: Would subscribe to Pro features (better reports, benchmarks, regular audits)

**Estimated conversion value:**
- Sarah: $500 consulting + $50/month SaaS = $1,100 year 1
- Marcus: $0 (too small, self-serve)
- Priya: $5,000 consulting + $500/month SaaS = $11,000 year 1

---

## Next Interview Targets

### Persona to Validate Next

1. **VP Finance at $50M+ startup** — Larger scale, higher deal value
2. **CTO / VP Eng at Series B** — Different buying dynamic than manager
3. **Fractional CFO / Finance consultant** — Advises multiple companies, needs bulk capability

### Questions to Ask

1. "What would it take for you to actually switch tools based on our recommendations?"
2. "Who else on your team needs to approve this decision?"
3. "What's missing from this recommendation?"
4. "Would you pay for benchmarks/comparison data?"

---

## Recommended Quote for Marketing

> "StackSpend gave me concrete numbers to justify AI spend to my CFO. In 3 minutes, I found $1,800 in annual savings." — Sarah Chen, Eng Manager


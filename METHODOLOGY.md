# METHODOLOGY: How StackSpend Works

## Purpose

This document explains exactly how StackSpend generates recommendations, why the numbers might be wrong, and when you should ignore the results.

**Goal:** Extreme honesty = lasting trust.

---

## Part 1: Pricing Data (The Foundation)

### Where Pricing Comes From

All pricing data comes from **publicly available sources** (May 2026):
- Official vendor pricing pages
- Published rate cards
- Public API documentation
- Team/enterprise tiers from vendor websites

### Pricing Assumptions

When vendors don't publish pricing:
- **Cursor Pro ($20/mo)** → Assumed based on market comparables
- **GitHub Copilot Team ($39/user/month)** → Published, verified
- **Claude Pro ($20/month)** → Published, verified
- **ChatGPT Team ($30/user/month)** → Published, verified
- **API costs** → Using latest published rates

**Risk:** Pricing changes frequently. This audit reflects May 2026 pricing. For API-based tools, actual costs depend heavily on usage.

---

## Part 2: Seat Logic (The Assumption Layer)

### How Seat Assumptions Work

For non-API tools (Cursor, GitHub Copilot, Claude Pro, ChatGPT Pro), we assume:

**Small Team (2-5 people):**
- 80% adoption for coding tools
- 100% adoption for research tools
- Premium tiers for power users only

**Growing Team (6-20 people):**
- 60% adoption for coding tools
- 70% adoption for research tools
- Split between free/premium plans

**Enterprise (20+ people):**
- 40% adoption for coding tools
- 50% adoption for research tools
- Most use team/enterprise tiers

### Why These Assumptions Might Be Wrong

1. **Your team might have different adoption rates**
   - Some teams use Cursor 100%, others 20%
   - We assume industry averages
   - Verify against actual usage data

2. **Seat sharing**
   - Teams often share subscriptions (against ToS)
   - We assume 1 seat = 1 user
   - Your actual spend may be 30% lower if you're creative with licensing

3. **Free tier adoption**
   - We assume teams use free versions when available
   - Many teams go straight to paid
   - This changes recommendations significantly

4. **Temporary trial licenses**
   - Teams often have unused trial seats
   - We assume they're cleaned up
   - You might have paid seats gathering dust

---

## Part 3: Optimization Thresholds (The Logic Layer)

### When We Recommend Changes

**Cursor Pro → Hobby:**
- Recommended if: Team member uses <4 hours/week
- Threshold: Premium features used <30% of the time
- Risk: Losing 4-file context window, slower completions

**ChatGPT Team → ChatGPT Plus:**
- Recommended if: Team uses <100 messages/week
- Threshold: No heavy API integration
- Risk: Losing team workspace, shared memory

**Claude Pro → Free:**
- Recommended if: Usage <50 API calls/week
- Threshold: No complex reasoning requirements
- Risk: Rate limiting, context window limitations

**Tool Consolidation:**
- Recommended if: Using >2 tools for same purpose
- Example: Both Cursor AND GitHub Copilot
- Risk: Losing specialized features of each tool

---

## Part 4: Confidence Levels (The Honesty Layer)

### High Confidence (80%+)
- Clear tool redundancy
- Transparent pricing
- Obvious cost overage
- Example: "Team of 12 with only 4 active Cursor Pro seats but paying for all 12"

### Moderate Confidence (50-79%)
- Reasonable optimization based on typical patterns
- Some assumptions about actual usage
- Example: "Medium team with both ChatGPT Team and Claude Pro might consolidate"

### Low Confidence (<50%)
- Assumptions exceed what data can support
- Highly team-specific tradeoffs
- Example: "Whether API tools are cost-efficient depends entirely on your inference patterns"

**We only show recommendations with >50% confidence.** Marginal cases are flagged as "Review Needed."

---

## Part 5: What This Audit Gets Right

✓ **Seat oversubscription** — If you're paying for 12 Cursor seats but only 4 use it, we catch that.

✓ **Tool redundancy** — If you're paying for both ChatGPT Team AND Claude for the same purpose, we flag it.

✓ **Free tier substitution** — If your team can shift to free Gemini or ChatGPT free, we show that savings.

✓ **API vs seat tradeoffs** — For heavy API users, we show when pay-as-you-go is better than monthly seats.

✓ **Team scaling scenarios** — We show what happens to spend if your team grows.

---

## Part 6: What This Audit Gets Wrong

✗ **Actual usage patterns** — We assume; we don't measure. Your team might use Cursor 100%, not 60%.

✗ **Switching costs** — We don't account for onboarding time, team retraining, or muscle memory.

✗ **Feature value** — We assume all coding tools are interchangeable. They're not (context window, autocomplete quality, reasoning ability vary wildly).

✗ **Vendor lock-in** — We don't factor in the cost of retraining on a new tool.

✗ **Custom negotiated pricing** — Enterprise customers often get 30-50% discounts. We assume list price.

✗ **Usage seasonality** — We assume consistent spend month-to-month. Real teams spike during crunch periods.

---

## Part 7: Where Human Review Matters

**Before acting on any recommendation, consider:**

1. **Team feedback** — Do engineers actually want to switch tools? (If not, the $50/month savings isn't worth team friction.)

2. **Switching costs** — Cursor → GitHub Copilot might save $30/month but cost 10 hours of retraining.

3. **Long-term contracts** — You might be locked into annual plans that make mid-year switching impossible.

4. **API usage patterns** — If you have custom integrations, consolidation might break them.

5. **Compliance requirements** — Some industries require specific vendor certifications we don't know about.

---

## Part 8: How to Validate These Recommendations

### For Seat-Based Tools:
```
1. Ask each team member: "How much do you actually use this tool?"
2. Check last login dates in your vendor dashboards
3. Estimate actual seats needed (not budgeted seats)
4. Calculate real spend based on active usage
```

### For API-Based Tools:
```
1. Check your vendor billing dashboard for actual monthly costs
2. Project next 3 months based on recent usage
3. Run comparative pricing for alternatives
4. Consider long-tail latency/cost tradeoffs
```

### For Consolidation:
```
1. Test the recommended tool with a small team first
2. Run in parallel (keep both tools for 1 month)
3. Measure switch time and satisfaction
4. Then make the full cutover
```

---

## Part 9: Pricing Refresh Cadence

This audit reflects **May 2026** pricing. Tools we track:

| Tool | Price Volatility | Last Updated |
|------|------------------|--------------|
| Cursor | Low | May 2026 |
| GitHub Copilot | Low | May 2026 |
| Claude | Low | May 2026 |
| ChatGPT | Moderate | May 2026 |
| Gemini | Moderate | May 2026 |
| OpenAI API | High | May 2026 |
| Anthropic API | High | May 2026 |

**For API tools:** Cost can drift 20-50% month-to-month based on usage patterns.

---

## Part 10: When to Ignore This Audit

❌ **You've already decided on a tool** — Don't let us second-guess your team's preferences.

❌ **You have custom contracts** — Negotiated pricing beats our public rate cards.

❌ **You have team stability concerns** — Switching tools mid-project is usually not worth the savings.

❌ **You have regulatory requirements** — Certain industries can't switch vendors easily.

❌ **Savings are <$50/month** — Not worth the operational friction.

---

## Part 11: How We Use This Audit Internally

**Confidence multiplier:**
- High confidence recommendations are weighted 3x
- Moderate confidence recommendations are weighted 1x
- Low confidence recommendations are not shown

**Edge cases we handle:**
- Teams with only 1 person (all per-seat pricing becomes per-tool)
- Teams with >100 people (enterprise pricing kicks in)
- International teams (currency fluctuations not considered)
- APIs with volume discounts (not modeled)

---

## Part 12: Feedback & Refinement

Found an error in our pricing? Our assumptions wrong?

Email: founders@stackspend.com with:
- Your team size
- Which recommendation seemed off
- What the correct pricing/logic should be

We refine this model continuously based on real feedback.

---

## Summary

This audit is a **starting point for conversation, not gospel truth.**

Use it to:
- Identify obvious overspend
- Start team discussions about tooling
- Quantify switching costs you hadn't considered
- Plan your AI tool strategy

Don't use it to:
- Make unilateral tool switching decisions
- Override team preferences
- Assume precision where we're making assumptions
- Skip the "validate with actual usage data" step

**Goal:** Help you spend smarter on AI tools. Not to replace your team's judgment, but to augment it with data.

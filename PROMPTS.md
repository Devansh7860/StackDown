# PROMPTS.md — AI Summary Prompt Documentation

## Overview

SpendLens uses the Anthropic Claude API to generate a personalized executive summary for each completed audit. This is the *only* place AI is used in the product — the audit recommendations themselves are deterministic TypeScript, not AI-generated.

---

## The Prompt

### System Message
```
You are a financial analyst specializing in SaaS and AI tool spend optimization for startups and small engineering teams. You write in a conversational, direct tone — like a sharp CFO friend giving advice over coffee, not like a corporate consulting report. You never use bullet points. You never use markdown. You write exactly one clean paragraph.
```

### User Message Template
```
Analyze this AI tool audit for a {teamSize}-person {useCase} team:

Tools audited:
{tools — formatted as "ToolName (Plan, X seats, $Y/mo)"}

Total potential savings: ${monthlySavings}/month (${annualSavings}/year)
Savings percentage: {savingsPercentage}%

Key recommendations:
{top recommendations — formatted as "ACTION ToolName: reasoning"}

Overlaps detected:
{overlap descriptions, or "None detected"}

Write exactly ONE paragraph (80-100 words) that:
1. Acknowledges their specific setup (mention the team size and at least one tool by name)
2. Names the single biggest savings opportunity with the exact dollar figure
3. Gives one concrete next step they can take today
4. If savings are $0 or near-zero, be honest: say their setup looks well-optimized
5. Ends with an encouraging, non-salesy note

Do NOT use bullet points. Do NOT use markdown. Do NOT be vague — never say "various tools" when you can name them. Just one clean paragraph, 80-100 words.
```

---

## Why This Prompt Works

### 1. Role anchoring ("financial analyst")
Prevents generic chatbot-style responses. The model adopts a specific professional persona, which produces more authoritative, direct language.

### 2. Tone directive ("sharp CFO friend over coffee")
The double qualifier — both the role (CFO) and the register (friend, over coffee) — creates a very specific voice: expert but accessible. "Not a corporate consulting report" is an explicit negative constraint that significantly reduces hedging language ("it may be worth considering...").

### 3. Structured output constraints (numbered requirements)
The five numbered requirements prevent rambling and ensure every summary hits the same beats. Without these, the model tends to produce generic introductions ("AI tools are increasingly important for startups...") and miss the specific data.

### 4. Honesty clause
Requirement #4 explicitly says: "if savings are $0 or near-zero, be honest." This is critical. Without it, the model finds savings even when none exist — it wants to be helpful, so it manufactures vague recommendations. The honesty clause short-circuits this.

### 5. Specificity requirement ("never say 'various tools'")
This single line dramatically improves output quality. The model is pattern-matching on "name at least one tool" and will use the actual tool names from the input data.

---

## Iteration History

### Attempt 1: Too vague
**Prompt:** "Summarize this audit in 100 words."  
**Problem:** Generic, didn't mention specific tools or dollar figures. Sounded like a press release.  
**Example output:** *"Your team is spending on several AI tools. There are opportunities to reduce costs by evaluating your current subscriptions and looking for overlaps."*

### Attempt 2: Too structured
**Prompt:** "Write 5 bullet points summarizing the key findings."  
**Problem:** Output looked like an AI template. Users found it cold and impersonal. The "executive briefing" framing was lost.

### Attempt 3: No honesty clause  
**Prompt:** Same as final, minus requirement #4.  
**Problem:** For stacks that were already well-optimized, the model invented dubious recommendations. "You could consider negotiating enterprise pricing with Cursor..." — speculative, unhelpful, eroded trust.

### Final version: With honesty clause + specificity requirement
Produces outputs like: *"Your 8-person team is spending $592/month across 4 AI tools, with a clear 47% reduction available today. The single biggest win — cancelling GitHub Copilot at $152/month — requires zero workflow changes since Cursor already handles everything Copilot does. Log into GitHub → Settings → Billing and cancel the Copilot subscription this afternoon. Your Anthropic API spend looks reasonable for a coding team of your size."*

---

## Fallback Template

When the Anthropic API fails (timeout, rate limit, authentication error, or quota exceeded), the system generates a deterministic template summary instead of failing silently:

```typescript
function buildFallbackSummary(result: AuditResult, input: AuditInput): string {
  if (result.alreadyOptimal) {
    return `Your ${input.teamSize}-person ${input.useCase} team's AI tool stack looks well-optimized. ` +
      `We found no significant savings opportunities across your ${input.tools.length} tools. ` +
      `That said, prices change — running this audit quarterly ensures you stay current.`;
  }

  const topRec = result.recommendations
    .filter(r => r.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  return `Based on our analysis of your ${input.teamSize}-person team's ${input.tools.length} AI tools, ` +
    `we identified $${Math.round(result.totalMonthlySavings)}/month ($${Math.round(result.totalAnnualSavings)}/year) ` +
    `in potential savings — a ${result.savingsPercentage}% reduction from your current $${Math.round(result.totalCurrentSpend)}/month spend. ` +
    (topRec
      ? `The biggest single win is ${topRec.recommendedAction === 'cancel' ? 'cancelling' : 'downgrading'} ${topRec.toolName} at $${Math.round(topRec.monthlySavings)}/month saved. `
      : '') +
    `See the per-tool breakdown above for specific next steps.`;
}
```

The fallback is intentionally less polished than the AI version but always accurate — it's derived directly from the typed `AuditResult` object.

---

## Model Selection

**Model:** `claude-sonnet-4-20250514`

**Why Sonnet over Haiku?** The summary is user-facing and needs to sound like a real analyst, not a form letter. Haiku is faster and cheaper but produces noticeably more generic prose. The cost difference for a 100-word summary is fractions of a cent — Sonnet is worth it.

**Why Sonnet over Opus?** Opus would be overkill for a 100-word paragraph. Sonnet hits the quality threshold for this use case at 3-4x lower cost.

**Max tokens:** 200 (gives room for 100 words + a small buffer without risking excessive output).

**Timeout:** 8 seconds. If the API hasn't responded by then, the fallback template is used. User-perceived latency is capped.

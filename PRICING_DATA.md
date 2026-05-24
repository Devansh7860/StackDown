# PRICING_DATA.md
## AI Tool Pricing Verification Log

> **Purpose:** Every pricing number used in SpendLens must be verified against official sources. This file is the audit trail.
> **Last full verification:** 2026-05-24
> **Verified by:** Prateek (manual spot-check of each pricing page)

---

## Cursor

**Source:** https://cursor.com/pricing
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Hobby | $0 | 2,000 completions, 50 slow premium requests |
| Pro | $20 | Unlimited completions, unlimited auto mode, $20 premium credits/mo |
| Pro+ | $60 | Everything in Pro, $60 premium credits/mo |
| Ultra | $200 | Everything in Pro+, $200 premium credits/mo |
| Teams | $40 | Pro features + SSO/SAML, admin dashboard, zero data retention |
| Enterprise | Custom | Contract pricing, dedicated support |

**Key audit insight:** Teams adds SSO, admin dashboard, and invoice billing. For teams <10 without compliance requirements, Pro is functionally identical for coding tasks. Savings: ($40−$20) × seats = $20/seat/mo.

---

## GitHub Copilot

**Source:** https://github.com/features/copilot#pricing
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Evaluation plan, 2,000 completions/mo |
| Pro | $10 | Code completions, Copilot Chat, $10 AI Credits/mo |
| Pro+ | $39 | Power users, higher limits, Claude Opus & o3 access |
| Business | $19 | Pro + org management, policy controls, audit logs, IP indemnity |
| Enterprise | $39 | Business + custom fine-tuned models, knowledge bases |

**Key audit insight:** Copilot Pro and Cursor Pro have near-identical feature sets for most dev workflows. Teams using Cursor as their primary IDE do not need a separate Copilot subscription.

---

## Claude (Anthropic)

**Source:** https://www.anthropic.com/pricing
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Min seats | Notes |
|------|---------------|-----------|-------|
| Free | $0 | 1 | Limited messages, Claude 3.5 Haiku |
| Pro | $20 | 1 | 5× free, priority access, all Claude models |
| Max (5×) | $100 | 1 | 5× the usage of Pro |
| Max (20×) | $200 | 1 | 20× the usage of Pro |
| Team | $30 | **5** | Higher usage, admin console, 200K context |
| Enterprise | Custom | 1 | SSO, audit logs, custom retention |

**Key audit insight:** Claude Team has a **5-seat minimum**. A team of 2-3 paying for Claude Team is automatically paying for 2-3 unused seats at $30/seat. Switching to Claude Pro saves $90/mo for a team of 2 (2×$20 vs 5×$30).

---

## ChatGPT (OpenAI)

**Source:** https://openai.com/chatgpt/pricing
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Min seats | Notes |
|------|---------------|-----------|-------|
| Free | $0 | 1 | Limited GPT-4o access |
| Go | $8 | 1 | Higher limits than free, standard response times |
| Plus | $20 | 1 | Full GPT-4o, DALL-E 3, Advanced Data Analysis |
| Pro | $200 | 1 | Unlimited access, Pro mode, advanced reasoning models |
| Team | $30 | 2 | Plus + admin console, higher limits, data excluded from training |
| Enterprise | Custom | 1 | Unlimited GPT-4o, SSO, custom retention |

**Key audit insight:** For writing/research teams, Claude Pro and ChatGPT Plus serve overlapping purposes. Most teams that evaluate both settle on one after 2 weeks.

---

## Anthropic API

**Source:** https://www.anthropic.com/pricing#api
**Date verified:** 2026-05-24

| Model | Input (per MTok) | Output (per MTok) |
|-------|------------------|-------------------|
| claude-sonnet-4-20250514 | $3.00 | $15.00 |
| claude-3-5-haiku | $0.80 | $4.00 |
| claude-3-opus | $15.00 | $75.00 |

**Note:** API pricing is usage-based (pay-per-token). SpendLens captures monthly spend as user input and uses it for savings calculations, not a per-seat price.

**Key audit insight:** If a team has both Claude Pro subscriptions AND the Anthropic API, and their primary use is programmatic API calls, the Claude Pro web UI subscriptions may be redundant ($20/mo per person).

---

## OpenAI API

**Source:** https://openai.com/pricing
**Date verified:** 2026-05-24

| Model | Input (per MTok) | Output (per MTok) |
|-------|------------------|-------------------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o mini | $0.15 | $0.60 |
| o1 | $15.00 | $60.00 |

**Note:** API pricing is usage-based. SpendLens captures monthly spend as user input.

**Key audit insight:** Teams using both Anthropic API and OpenAI API — if one handles >90% of traffic, consolidating to one reduces overhead and enables volume discount negotiations.

---

## Gemini (Google)

**Source:** https://one.google.com/about/plans (consumer) / https://ai.google.dev/pricing (API)
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Gemini 1.5 Flash, limited Pro access |
| Advanced (Google One AI Premium) | $19.99 | Gemini 1.5 Pro Ultra, 2TB storage, Workspace integration |
| API (Pay-as-you-go) | $0 | Per-token pricing, 1M free tokens/mo on 1.5 Flash |

**Key audit insight:** Gemini Advanced bundles 2TB Google One storage. Teams that don't need the storage (use OneDrive or Dropbox) are overpaying for the bundle. Gemini Advanced is most valuable for teams heavily embedded in Google Workspace.

---

## Windsurf (Codeium)

**Source:** https://codeium.com/pricing
**Date verified:** 2026-05-24

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Limited flow actions, basic autocomplete |
| Pro | $15 | Unlimited autocomplete, advanced models, 500 premium credits/mo |
| Teams | $35 | Pro + admin controls, usage analytics, priority support |

**Key audit insight:** At $15/seat, Windsurf Pro is $5/seat cheaper than Cursor Pro ($20/seat). Teams already on Cursor have no reason to add Windsurf — they're in the same product category. Teams on Windsurf who are considering Cursor should evaluate the $5/seat premium vs Cursor's broader model access and larger community.

---

## Verification Methodology

1. **Manual check:** Navigated to each pricing page directly (not cached/aggregator)
2. **Date check:** Confirmed no "prices subject to change" banners with recent dates
3. **Cross-reference:** Where prices are mentioned in press/tech coverage, confirmed against official page
4. **Enterprise prices:** Marked as "custom" — never assumed or guessed
5. **API prices:** Spot-checked against the API documentation (pricing.json where available)

---

## Price Change Policy

Prices will be re-verified before final submission. If any price changes between now and Day 7, update:
1. `PRICING_DATA.md` (this file) — update the table and date
2. `lib/audit-engine/tools.ts` — update the `pricePerSeat` field
3. Rerun all tests to ensure savings calculations are still correct

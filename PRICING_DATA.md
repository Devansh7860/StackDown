# PRICING_DATA.md
## AI Tool Pricing Verification Log

> **Purpose:** Every pricing number used in StackDown must be verified against official sources. This file is the audit trail.
> **Last full verification:** 2026-05-27
> **Verified by:** Prateek (manual spot-check of each pricing page)

---

## Cursor

**Source:** https://cursor.com/pricing
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Hobby | $0 | Limited agent requests and Tab completions; evaluation only |
| Pro | $20 | $20 monthly credit pool; unlimited Auto mode, Tab completions, all frontier models |
| Pro+ | $60 | Everything in Pro, 3× usage credits |
| Ultra | $200 | Everything in Pro, 20× usage credits + priority feature access |
| Teams | $40 | Pro features + centralized billing, usage analytics, admin dashboards, SSO (SAML/OIDC), shared rules |
| Enterprise | Custom | Audit logs, SCIM seat management, priority support |

**Billing note:** Since June 2025, Cursor uses a credit-based model. "Auto" mode is unlimited. Manually selecting specific frontier models draws from the monthly credit pool.

**Key audit insight:** Teams adds SSO, admin dashboard, and invoice billing. For teams <10 without compliance requirements, Pro is functionally identical for coding tasks. Savings: ($40−$20) × seats = $20/seat/mo.

---

## GitHub Copilot

**Source:** https://github.com/features/copilot#pricing
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Limited completions and chat requests |
| Pro | $10 | Standard code completions + $10 in AI credits/mo |
| Pro+ | $39 | Power users, heavy agentic use, $39 in AI credits/mo |
| Business | $19 | Pro + org policy controls, audit logs, IP indemnity, pooled credits across team |
| Enterprise | $39 | Business + custom fine-tuned models, knowledge bases |

**Billing note (effective June 1, 2026):** GitHub Copilot moved from per-request limits to AI Credits (token-based billing). Base subscription prices unchanged. Standard completions and Next Edit Suggestions remain unlimited and free.

**Key audit insight:** Copilot Pro ($10) and Cursor Pro ($20) have near-identical code completion features for most dev workflows. Teams using Cursor as their primary IDE do not need a separate Copilot subscription — Cursor's credit pool covers everything Copilot Pro provides.

---

## Claude (Anthropic)

**Source:** https://www.anthropic.com/pricing
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Min seats | Notes |
|------|---------------|-----------|-------|
| Free | $0 | 1 | Basic access, daily limits, no Claude Code |
| Pro | $20 | 1 | ~5× usage of Free, Claude Code, Projects, all models |
| Max (5×) | $100 | 1 | 5× Pro usage, priority access, early features |
| Max (20×) | $200 | 1 | 20× Pro usage for heavy power users |
| Team Standard | $25 | **5** | Collaborative features, admin console, 200K context |
| Team Premium | $125 | **5** | Full Claude Code access, higher limits |
| Enterprise | Custom | 1 | SSO, audit logs, custom retention |

**Billing note (effective June 15, 2026):** Programmatic usage (API calls via Agent SDK, third-party apps) will draw from a separate dedicated monthly programmatic credit pool rather than standard subscription limits.

**Key audit insight:** Claude Team plans have a **5-seat minimum**. A team of 2-3 paying for Claude Team Standard ($25/seat × 5 = $125/mo) can switch to Claude Pro at 2-3 × $20 = $40-60/mo. Savings: $65-85/mo for small teams.

---

## ChatGPT (OpenAI)

**Source:** https://openai.com/chatgpt/pricing
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Min seats | Notes |
|------|---------------|-----------|-------|
| Free | $0 | 1 | Limited GPT-5.5 access |
| Go | $8 | 1 | Higher limits, standard response times |
| Plus | $20 | 1 | Full GPT-5.5, DALL-E 3, Deep Research (10 runs/mo), Codex, Agent Mode |
| Pro | $100–$200 | 1 | Heavy power users, unlimited access, advanced reasoning |
| Business (Team) | $20–$30 | **2** | Plus + admin console, SAML SSO, SOC 2, shared workspaces, data excluded from training |
| Enterprise | Custom | 1 | Custom retention, unlimited usage |

**Key audit insight:** For writing/research teams, Claude Pro and ChatGPT Plus serve overlapping purposes. Most teams that evaluate both settle on one after 2 weeks. Business plan requires 2-seat minimum (improved from 5 previously).

---

## Anthropic API

**Source:** https://www.anthropic.com/pricing#api
**Date verified:** 2026-05-27

| Model | Input (per MTok) | Output (per MTok) |
|-------|------------------|-------------------|
| Claude Opus 4.7 | $5.00 | $25.00 |
| Claude Sonnet 4.6 | $3.00 | $15.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |

**Cost optimization:** Prompt Caching reduces costs by up to 90% for repeated inputs. Batch API offers 50% discount on all token costs for async workloads.

**Note:** API pricing is usage-based (pay-per-token). StackDown captures monthly spend as user input and uses it for savings calculations, not a per-seat price.

**Key audit insight:** If a team has both Claude Pro subscriptions AND the Anthropic API, and their primary use is programmatic API calls, the Claude Pro web UI subscriptions may be redundant ($20/mo per person).

---

## OpenAI API

**Source:** https://openai.com/pricing
**Date verified:** 2026-05-27

| Model | Input (per MTok) | Output (per MTok) |
|-------|------------------|-------------------|
| GPT-5.5 | $2.50 | $10.00 |
| GPT-4o mini | $0.15 | $0.60 |
| o3 | $10.00 | $40.00 |

**Note:** API pricing is usage-based. StackDown captures monthly spend as user input.

**Key audit insight:** Teams using both Anthropic API and OpenAI API — if one handles >90% of traffic, consolidating to one reduces overhead and enables volume discount negotiations.

---

## Gemini (Google)

**Source:** https://one.google.com/about/plans (consumer) / https://ai.google.dev/pricing (API)
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Gemini 2.0 Flash access, limited Pro |
| Advanced (Google One AI Premium) | $19.99 | Gemini 2.0 Ultra, 2TB storage, deep Workspace integration |
| API (Pay-as-you-go) | $0 | Per-token pricing, 1M free tokens/mo on Flash |

**Key audit insight:** Gemini Advanced bundles 2TB Google One storage. Teams that don't need the storage (use OneDrive or Dropbox) may be overpaying for the bundle. Most valuable for teams deeply embedded in Google Workspace (Gmail, Docs, Sheets).

---

## Windsurf (formerly Codeium)

**Source:** https://windsurf.com/pricing
**Date verified:** 2026-05-27

| Plan | Price/seat/mo | Notes |
|------|---------------|-------|
| Free | $0 | Limited daily/weekly usage quotas; core AI features |
| Pro | $20 | Standard usage quotas; all premium models (Claude, GPT, SWE-1.5) |
| Teams | $40 | Pro + management tools, centralized billing, admin dashboards |
| Max | $200 | Power users with higher capacity limits |
| Enterprise | Custom | SSO, advanced security, self-hosted option |

**Billing note (updated March 2026):** Windsurf moved from a credit-based system to quota-based pricing with daily/weekly usage allowances that refresh automatically. Overages on paid plans billed at API rates.

**Key audit insight:** Windsurf Pro increased from $15 to $20/seat in 2026, now matching Cursor Pro pricing. At $20/seat, there is no longer a price advantage to Windsurf over Cursor — the choice comes down purely to IDE preference and team workflow.

---

## Verification Methodology

1. **Manual check:** Navigated to each pricing page directly (not cached/aggregator)
2. **Date check:** Confirmed no "prices subject to change" banners with recent dates
3. **Cross-reference:** Where prices are mentioned in press/tech coverage, confirmed against official page
4. **Enterprise prices:** Marked as "custom" — never assumed or guessed
5. **API prices:** Spot-checked against the API documentation where available

---

## Price Change Log

| Tool | Old Price | New Price | Change Date | Notes |
|------|-----------|-----------|-------------|-------|
| Claude Team | $30/seat (5-seat min) | $25/seat Standard, $125/seat Premium (5-seat min) | ~May 2026 | Restructured into Standard vs Premium tiers |
| ChatGPT Business | $30/seat (2-seat min) | $20-30/seat (2-seat min) | 2026 | Competitive adjustment |
| Windsurf Pro | $15/seat | $20/seat | March 2026 | Price increase with quota system migration |
| Windsurf Teams | $35/seat | $40/seat | March 2026 | Increased with quota system |
| GitHub Copilot | Per-request limits | AI Credits (token-based) | June 1, 2026 | Billing model change, prices unchanged |
| Cursor | Per-request limits | Credit-based | June 2025 | Billing model change, prices unchanged |

---

## Price Change Policy

Prices verified on **2026-05-27**. If any price changes before submission, update:
1. `PRICING_DATA.md` (this file) — update the table, date, and price change log
2. `lib/audit-engine/tools.ts` — update the `pricePerSeat` field
3. Rerun all tests to ensure savings calculations are still correct

# REFLECTION.md — SpendLens Project Retrospective

---

## 1. What technical decisions did you make, and why?

The most consequential decision was making the audit engine **fully deterministic** — pure TypeScript functions with no AI involved in the core logic. Early in planning, I considered letting Claude generate recommendations on the fly. I decided against this for three reasons: (1) AI-generated pricing recommendations are unreliable — models hallucinate plan names and prices, (2) the output is non-repeatable, making testing impossible, and (3) a finance-literate reviewer needs to be able to verify every number, which requires explicit rule code they can read.

The second big decision was **Next.js App Router over a Vite SPA**. This was driven by a single hard requirement: shareable audit URLs need proper Open Graph meta tags so they render correctly when shared on Slack, LinkedIn, or Twitter. A SPA returns an empty HTML shell to crawlers. Next.js's `generateMetadata()` function solves this on the server, and it cost me nothing in complexity.

I chose **Upstash Redis over in-memory rate limiting** after realizing that serverless functions are stateless — an in-memory counter resets on every cold start. With Upstash, the 5-audits-per-IP-per-hour sliding window persists reliably across all function invocations.

---

## 2. What did you learn that you didn't expect to?

I underestimated how much **the pricing data itself would be the hardest part**. I assumed I could look up 8 tools' pricing in an afternoon. It took much longer because:
- Plans change constantly (Claude added the "Max" plan mid-sprint)
- Many tools have different pricing for annual vs monthly billing
- "Team" plans often have minimum seat requirements that completely change the math (Claude Team requires 5 seats minimum — this is a genuinely useful audit signal)
- API tools (Anthropic API, OpenAI API) are usage-based, which means the "monthly spend" is user-reported rather than calculable

This taught me that the data layer is often more complex than the logic layer in B2B tools. The audit engine itself took a day. Getting the pricing right took almost as long.

---

## 3. What would you do differently with more time?

**Benchmark mode.** The most requested feature during user interviews was context: "Is $80/developer/month high or low?" Right now we show absolute savings, but we don't say whether someone's overall spend is typical for their stage. Adding a benchmark dataset (average AI spend per developer by company stage) would make the results dramatically more shareable — "My team spends $94/dev/month. Series A average is $72." That stat gets screenshotted.

**Real-time audit updates.** Currently, the AI summary generation happens synchronously during the audit API call, which adds latency. With more time, I'd decouple this: return the deterministic audit result immediately (~100ms), then stream the AI summary in via Supabase Realtime or a simple polling endpoint. Users would see their savings number instantly, then watch the AI analysis appear.

**Actual user interviews before building.** I did interviews mostly after the core product was done. Ideally these happen on Day 1 — the team size inputs, use case classification, and tool coverage all would have been better informed by talking to 3-4 Engineering Managers first.

---

## 4. What was the hardest bug or problem you faced?

The hardest problem was the **chart width bug in Recharts**. After the layout refactor, the `ResponsiveContainer` was rendering with `width=-1` and `height=-1` in the browser console. This happened because the container's parent element didn't have an explicit pixel height at mount time — `ResponsiveContainer` with `width="100%"` and `height="100%"` needs a parent with a concrete dimension to measure against.

The fix was changing from `height="100%"` to `height={220}` (a fixed pixel value) and adding `style={{ minHeight: 220 }}` to the wrapper div. Simple in hindsight, but it took time to trace because the chart still visually rendered correctly in most browsers — the error was only in the console and caused silent measurement failures on mobile.

---

## 5. How would you validate and grow this if it were real?

**Week 1 — Validation:**
Post a "Show HN" with a personal story. Include my own audit results ("I found we were paying for Cursor Business AND GitHub Copilot for 6 devs — $228/mo wasted"). HN responds to authentic, specific stories. Watch form completion rate. If it drops below 40%, the form is too complex — simplify immediately.

**Weeks 2-4 — Distribution:**
DM 50 founders on X who have recently tweeted about AI tools or Cursor vs Copilot. The conversion message writes itself: "You're debating this? There's a free 3-minute tool that tells you objectively." Post in r/ExperiencedDevs and r/startups with the same personal story angle.

**North Star Metric:** Audits completed per week. Everything flows from completed audits — leads, Credex referrals, word-of-mouth. If audits are growing, the business case is working.

**Pivot trigger:** If after 30 days of active distribution the share rate stays below 5%, the results aren't compelling enough. That's a product problem, not a distribution problem. The fix: add benchmark comparisons so results are more shareable ("I'm spending 30% above average"). The "wow factor" needs to be big enough that users voluntarily share without prompting.

**Monetization path:** The tool is already a qualified lead generator for Credex. High-savings audits (>$500/mo) get a Credex CTA on the results page and a targeted email. Credex's existing customer relationships with AI vendors make this credible — not just a generic discount pitch.

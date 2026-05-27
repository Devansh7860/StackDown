# METRICS.md — Measurement Framework

## North Star Metric

**Audits Completed per Week**

Not leads. Not signups. Not page views.

**Why:** A completed audit is the moment StackDown delivers its core value. Everything downstream — leads, shares, Credex referrals, word-of-mouth — flows from completed audits. If this number grows, it means the product is being discovered, understood, and used. If it's flat, it doesn't matter if the landing page looks great or the Credex CTA converts well — the top of the funnel is broken.

Audits started but not completed don't count. They indicate intent but not value delivery.

---

## 3 Input Metrics That Drive the North Star

### 1. Form Start Rate
**Definition:** Percentage of landing page visitors who click "Start Your Free Audit" and begin Step 1 of the form.

**Target:** 30%+

**Why it matters:** Measures landing page copy and first-impression effectiveness. A low rate (< 15%) means the value proposition isn't landing — users don't understand what they're getting or don't believe it's free/fast enough.

**Improvement levers:**
- Shorten hero copy
- Add more specific social proof (with real numbers)
- Reduce visual noise on landing page
- A/B test "Start Free Audit" vs "Audit My Stack"

### 2. Form Completion Rate
**Definition:** Percentage of users who start Step 1 and successfully submit the audit (reach the results page).

**Target:** 60%+

**Why it matters:** Measures form UX quality, perceived effort, and tool coverage. Drop-off analysis by step reveals where friction is highest.

**Expected drop-off points:**
- Step 1 → Step 2: Users who can't find their tool in the list, or get confused by plan selection
- Step 2 → Step 3: Users who don't know their team size or use case
- Step 3 → Submit: Users who read the summary and lose confidence

**Improvement levers:**
- Add more tools (Notion, Linear, Figma — expansion opportunity)
- Improve plan auto-fill (reduce input required)
- Add inline explanation for "team size" field

### 3. Share Rate
**Definition:** Percentage of completed audits where the user clicks the Share button (copies URL or uses Web Share API).

**Target:** 15%+

**Why it matters:** This is the viral coefficient metric. Every share is a potential new audit start. Share rate below 5% means the results aren't "wow" enough to forward — either savings are too small, or the presentation isn't compelling.

**Improvement levers:**
- Make the savings number larger and more prominent
- Add benchmark comparison ("You're 40% above average for Series A")
- Add a pre-filled tweet button ("I just found $X in AI waste — here's the free tool")
- Improve the results page visual hierarchy

---

## What to Instrument First

In priority order, using a simple event tracking system (e.g., PostHog free tier or Plausible):

1. **`page_view → cta_click`** — Measures landing page conversion (Form Start Rate)
2. **`step_1_complete → step_2_complete → step_3_complete → audit_submitted`** — Step-by-step funnel with drop-off visibility
3. **`audit_submitted → results_rendered`** — Measures API latency perceived by user (target < 3s)
4. **`share_button_click`** — Tracks viral coefficient
5. **`lead_form_submitted`** — Lead capture rate
6. **`audit_savings_amount`** — Distribution of savings amounts across all audits (validates assumptions in ECONOMICS.md)

All events should include: `sessionId`, `auditToken`, `savingsAmount`, `toolCount`.

---

## Pivot Triggers

After 30 days of active distribution (Show HN, Reddit, cold outreach):

| Metric | Current Target | Pivot Threshold | Signal |
|--------|---------------|-----------------|--------|
| Form Start Rate | 30% | < 15% | Landing page copy failing — run copy A/B tests before anything else |
| Form Completion Rate | 60% | < 30% | Form is too complex or tools aren't relevant — simplify or expand coverage |
| Share Rate | 15% | < 5% | Results aren't compelling enough to share — add benchmark comparison mode |
| Lead Capture Rate | 25% | < 10% | Value perception gap — users don't see enough value to give email |

**What NOT to pivot on too early:**
- Absolute audit volume in Week 1 (distribution hasn't kicked in yet)
- Individual tool recommendation accuracy (iterate based on user feedback, not low audit counts)

---

## Longer-Term Metrics (Post-Product-Market-Fit)

Once audits are growing steadily, shift focus to:

- **Lead → Consultation conversion rate** (Credex pipeline quality)
- **Consultation → Customer conversion rate** (Credex sales efficiency)
- **Return audit rate** (percentage of users who run a new audit within 90 days)
- **Revenue per audit** (LTV divided by audit count — the ultimate unit economic)

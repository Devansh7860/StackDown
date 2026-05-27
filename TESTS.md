# TESTS.md — Test Suite Documentation

## Overview

StackDown uses **Vitest** for unit testing. Tests focus on the audit engine — the core business logic that must be deterministic, defensible, and numerically correct.

## Running Tests

```bash
# Run all tests once
npm test

# Run in watch mode (re-runs on file save)
npm run test:watch

# Run a specific file
npx vitest run __tests__/audit-engine.test.ts
npx vitest run __tests__/overlaps.test.ts
```

## Test Files

### `__tests__/audit-engine.test.ts` — 7 tests

Tests the per-tool evaluation and aggregate audit logic in `lib/audit-engine/index.ts` and `lib/audit-engine/rules.ts`.

| Test | What it covers |
|------|---------------|
| Cursor Business → Pro downgrade for small team | Plan right-sizing rule: team < 10 doesn't need Business-tier SSO/admin features. Saves `(40-20) × seats`. |
| Claude Team for team of 2 → downgrade recommended | Claude Team has a 5-seat minimum. A team of 2 paying for 5 seats wastes `3 × $30 = $90/mo`. |
| Already optimal stack → `alreadyOptimal: true` | A lean, correctly-sized stack (e.g. Cursor Pro × 3, team of 3) should get zero recommendations and `alreadyOptimal: true`. |
| High savings tier classification | Savings > $500/mo should set `savingsTier: 'high'`. Drives the Credex CTA threshold. |
| Annual savings = 12× monthly | Ensures `totalAnnualSavings` is always exactly `totalMonthlySavings × 12`. No rounding discrepancies. |
| Reasoning strings contain dollar amounts | Every recommendation's `reasoning` field must contain `$` and be > 30 chars. Prevents vague "this tool is cheaper" outputs. |
| `totalCurrentSpend` equals sum of inputs | Aggregator correctly sums user-provided `monthlySpend` values. Guards against off-by-one. |

### `__tests__/overlaps.test.ts` — 4 tests

Tests the cross-tool conflict detection in `lib/audit-engine/overlaps.ts`.

| Test | What it covers |
|------|---------------|
| Cursor + Copilot → HIGH severity overlap | Both provide identical code completion + AI chat. Copilot is redundant when Cursor is present. |
| Cursor + Windsurf → HIGH severity overlap | Direct competitors in the AI code editor category. Running both splits the team unnecessarily. |
| Claude + ChatGPT for writing use case | MEDIUM severity for writing/research teams. Not all use cases warrant cancellation. |
| No false positives for non-overlapping tools | A stack of Cursor + Claude + Anthropic API should return zero overlaps. |

## What's NOT Tested (and Why)

| Area | Reason |
|------|--------|
| API routes (`/api/audit`, `/api/lead`) | Require live Supabase + Upstash connections. Integration tests need mocking infrastructure that wasn't worth the setup time for a 7-day build. Manual testing confirmed correct behavior. |
| UI components | Form interaction and animation testing requires `@testing-library/react` with jsdom. The form logic is covered by the engine tests. |
| Anthropic API | Non-deterministic by nature — response content varies per call. The fallback mechanism is tested implicitly by the engine tests (fallback is pure TS). |

## Test Design Principles

1. **Finance-literate assertions** — Every test on savings amounts uses specific numbers, not "greater than zero." If the test says `expect(savings).toBe(100)`, it means `(40-20) × 5 seats = $100/mo` — traceable to the pricing data.

2. **Edge cases over happy paths** — The most valuable tests cover: minimum seat requirements (Claude Team 5-seat minimum), already-optimal stacks (must return `alreadyOptimal: true`, not manufacture savings), and boundary conditions on savings tiers.

3. **No mocking of business logic** — The audit engine is a pure function with no external dependencies. Tests call `runAudit()` directly with fixture inputs and assert on the output. No mocks needed.

# DEVLOG.md — SpendLens Build Journal

> Daily build log for the Credex Web Dev Intern assignment.
> Evaluators: this file is updated every day of the 7-day sprint.

---

## Day 1 — 2026-05-22

**Hours worked:** ~4 hours

**What I did:**
- Set up the Next.js 15 project using the Supabase starter template (App Router, TypeScript, Tailwind, ESLint)
- Installed all core dependencies upfront: `@supabase/supabase-js`, `resend`, `nanoid`, `zod`, `@upstash/ratelimit`, `@upstash/redis`, `@anthropic-ai/sdk`, `framer-motion`, `canvas-confetti`, and all dev dependencies (vitest, @testing-library/react, jsdom)
- Configured `shadcn/ui` with a custom dark theme aligned to the "Financial Terminal" design system
- Set up `.env.local` with real API keys for Supabase, Anthropic, Resend, and Upstash
- Created `.env.example` with placeholder values (committed to repo)
- Added `.github/workflows/ci.yml` for lint + test CI
- Created `vitest.config.ts` with jsdom environment and path aliases
- Created empty `DEVLOG.md` (filled in today)
- Set up `lib/supabase/client.ts` and `lib/supabase/server.ts` (from Supabase starter)

**What I learned:**
- The Supabase Next.js starter ships with an auth template (login, signup, protected routes) — useful for future features but not needed for Day 1. Keeping it for now, will clean up later.
- `nanoid` v5 is ESM-only. Need to be careful with imports in API routes.
- Upstash Redis requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — not the standard Redis connection string.

**Blockers / what I'm stuck on:**
- Still need to run the Supabase SQL schema (create `audits` and `leads` tables). Scheduled for today afternoon.
- Vercel deployment not done yet — will do alongside Day 2 work.

**Plan for tomorrow (Day 2):**
- Build `lib/audit-engine/types.ts` + `lib/audit-engine/tools.ts` with all pricing data
- Build all 6 form components (AuditForm, StepIndicator, ToolSelector, ToolRow, TeamDetails, ReviewStep)
- Implement localStorage persistence hook
- Rebuild landing page with actual SpendLens branding (replace Supabase starter template)
- Start `PRICING_DATA.md`

---

## Day 2 — 2026-05-22

**Hours worked:** ~5 hours

**What I did:**
- Fixed Day 1 gaps: filled `vitest.config.ts`, created `__tests__/audit-engine.test.ts` placeholder, updated `DEVLOG.md`
- Rebuilt `app/globals.css` with the "Financial Terminal" design token system: zinc-950 background, green-500 savings accent, purple-500 Credex brand, Geist fonts for body/numbers
- Updated `app/layout.tsx`: proper SpendLens metadata, OG/Twitter tags, GeistMono for number formatting, forced dark mode
- Created `lib/audit-engine/types.ts` — all TypeScript types: `ToolId`, `UseCase`, `ToolInput`, `AuditInput`, `ToolRecommendation`, `OverlapWarning`, `AuditResult`
- Created `lib/audit-engine/tools.ts` — complete pricing data for 8 tools × their plans, with source URLs and `getPlansForTool()` / `getPlanById()` helpers
- Created `lib/schemas.ts` — Zod schemas for `auditInputSchema` and `leadCaptureSchema` (with honeypot field)
- Built 6 form components:
  - `components/form/StepIndicator.tsx` — animated 3-step progress bar
  - `components/form/ToolRow.tsx` — collapsible tool card with plan dropdown, auto-calculated spend, override toggle
  - `components/form/ToolSelector.tsx` — renders all 8 tools, tracks running total
  - `components/form/TeamDetails.tsx` — team size input + use case toggle buttons
  - `components/form/ReviewStep.tsx` — stack summary + submit CTA
  - `components/form/AuditForm.tsx` — 3-step orchestrator with Framer Motion slide transitions, localStorage restore toast, validation, API submission
- Created `hooks/useFormPersistence.ts` — 500ms debounced localStorage save/load/clear
- Rebuilt `app/page.tsx` as the full SpendLens landing page:
  - Sticky glass nav, dot-grid background
  - Gradient hero headline (56px)
  - Badge + CTA with green glow
  - Social proof quote
  - "How it works" 3-step section
  - Tool grid (all 8 tools)
  - Embedded AuditForm
  - Footer
- Created `PRICING_DATA.md` — all 8 tools with verified prices, source URLs, date 2026-05-22, and per-tool audit insights

**What I learned:**
- Framer Motion's `AnimatePresence` with `mode="wait"` is the right way to do step transitions — prevents exit and enter animations from happening simultaneously
- The Claude Team 5-seat minimum is a real gotcha: teams of 2-3 paying for Team are automatically wasting 2-3 seats. This is the strongest audit signal for the Claude tool.
- Zod v4 changed how enums work — `z.enum(array)` needs a `[string, ...string[]]` cast for dynamic arrays.

**Blockers / what I'm stuck on:**
- The API route `/api/audit` doesn't exist yet (Day 3 work) — form submission will get a 404 for now
- Need to run Supabase SQL schema before Day 3

**Plan for tomorrow (Day 3):**
- Build `lib/audit-engine/rules.ts` — per-tool evaluation logic (downgrade/cancel/keep rules)
- Build `lib/audit-engine/overlaps.ts` — cross-tool conflict detection matrix
- Build `lib/audit-engine/index.ts` — main `runAudit()` pure function
- Write all 7 audit engine tests (the ones specified in Section 4)
- Build `app/api/audit/route.ts` — POST endpoint with Zod validation + rate limiting + Supabase save
- Configure `lib/ratelimit.ts` — Upstash sliding window

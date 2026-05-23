# DEVLOG

---

## Day 1 — 2026-05-22

Set up the project today. Used the Supabase Next.js starter as the base, installed all dependencies upfront so I don't have to deal with it mid-week. Got the env vars sorted, CI workflow added, vitest configured. Nothing runs yet but the skeleton is solid.

Tomorrow: types, pricing data, and the form.

---

## Day 2 — 2026-05-22

Long session. Built the entire multi-step form — tool selector, team details, review step, all of it. Also rewrote the landing page (the starter template was embarrassing). Added localStorage persistence so the form survives a refresh.

Ran into the Claude Team 5-seat minimum thing which is actually a solid audit signal — teams of 2-3 are silently overpaying. Good find.

Tomorrow: the audit engine and the API route.

---

## Day 3 — 2026-05-23

Built the entire audit engine today. Rules for all 8 tools, cross-tool overlap detection, and the main `runAudit()` aggregator. 15 tests passing. The Claude Team 5-seat minimum rule is genuinely good — confirmed it produces the right savings math.

Also wired up the `/api/audit` route — Zod validation, Upstash rate limiting, Anthropic summary with fallback, Supabase write. Gracefully handles missing env keys so local dev doesn't blow up.

Tomorrow: results page and shareable audit URLs.

// app/api/audit/route.ts
// POST /api/audit — validates input, runs audit engine, saves to Supabase, returns result.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import { runAudit } from '@/lib/audit-engine/index';
import { generateAuditSummary } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/ratelimit';
import { createAdminClient } from '@/lib/supabase/admin';
import { TOOL_IDS } from '@/lib/audit-engine/tools';

// ── Validation schema ──────────────────────────────────────────────────────

const auditRequestSchema = z.object({
  tools: z
    .array(
      z.object({
        toolId: z.enum(TOOL_IDS as [string, ...string[]]),
        planId: z.string().min(1),
        seats: z.number().int().min(1).max(10000),
        monthlySpend: z.number().min(0).max(1_000_000),
      })
    )
    .min(1, 'Add at least one tool')
    .max(20, 'Too many tools'),
  teamSize: z.number().int().min(1).max(100_000),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
});

// ── Helper ─────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'spendlens').digest('hex').slice(0, 16);
}

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 2. Validate input
  const parsed = auditRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // 3. Rate limit
  const ip = getClientIp(req);
  const ipHash = hashIp(ip);

  const { success, remaining, reset } = await checkRateLimit(ipHash);
  if (!success) {
    const resetIn = Math.ceil((reset - Date.now()) / 1000 / 60);
    return NextResponse.json(
      {
        error: `Too many requests. You've run 5 audits this hour. Try again in ~${resetIn} minute${resetIn !== 1 ? 's' : ''}.`,
        retryAfter: reset,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  }

  // 4. Run audit engine (pure TS, ~1ms)
  const auditResult = runAudit({
    tools: input.tools as Parameters<typeof runAudit>[0]['tools'],
    teamSize: input.teamSize,
    useCase: input.useCase,
  });

  // 5. Generate AI summary (with 8s timeout + fallback)
  const aiSummary = await generateAuditSummary(auditResult, {
    tools: input.tools as Parameters<typeof runAudit>[0]['tools'],
    teamSize: input.teamSize,
    useCase: input.useCase,
  });

  // 6. Save to Supabase
  const shareToken = nanoid(10);
  const supabase = createAdminClient();

  if (supabase) {
    const { error: dbError } = await supabase.from('audits').insert({
      share_token: shareToken,
      tools_data: input.tools,
      audit_result: auditResult,
      ai_summary: aiSummary,
      team_size: input.teamSize,
      use_case: input.useCase,
      total_monthly_savings: auditResult.totalMonthlySavings,
      total_annual_savings: auditResult.totalAnnualSavings,
      savings_tier: auditResult.savingsTier,
      ip_hash: ipHash,
    });

    if (dbError) {
      console.error('Supabase insert failed:', dbError.message);
      // Don't fail the request — return result without persistence
    }
  } else {
    console.warn('Supabase admin client not configured — skipping DB write');
  }

  // 7. Return result
  return NextResponse.json({
    shareToken,
    result: auditResult,
    aiSummary,
    // Useful for the client to navigate directly
    auditUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/audit/${shareToken}`,
  });
}
